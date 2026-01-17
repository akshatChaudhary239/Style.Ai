from fastapi import APIRouter, Request, HTTPException, Header
from pydantic import BaseModel
from app.services.razorpay_service import (
    get_pack,
    create_order,
    verify_webhook_signature
)
from app.db.supabase import supabase_admin

router = APIRouter(prefix="/payments", tags=["payments"])

# ---- Request Model ----
class CreateOrderBody(BaseModel):
    pack_id: str
    seller_id: str  # auth uuid (seller_profile.id)

# ---- Create Orders ----
@router.post("/create-order")
async def create_payment_order(body: CreateOrderBody):
    try:
        pack = get_pack(body.pack_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid pack")

    # Create Razorpay orders
    order = create_order(
        amount_paise=pack["amount"],
        receipt=f"seller_{body.seller_id}"
    )

    # Log payment (status = created)
    supabase_admin.table("payment_logs").insert({
        "seller_id": body.seller_id,
        "razorpay_order_id": order["id"],
        "amount": pack["amount"],
        "slots_added": pack["slots"],
        "status": "created",
    }).execute()

    return {
        "order_id": order["id"],
        "amount": pack["amount"],
        "currency": "INR",
        "key_id": None  # frontend uses env RAZORPAY_KEY_ID
    }

# ---- Webhook ----
@router.post("/webhook")
async def razorpay_webhook(
    request: Request,
    x_razorpay_signature: str = Header(None)
):
    payload = await request.body()

    if not x_razorpay_signature:
        raise HTTPException(status_code=400, detail="Missing signature")

    if not verify_webhook_signature(payload, x_razorpay_signature):
        raise HTTPException(status_code=400, detail="Invalid signature")

    data = await request.json()
    event = data.get("event")

    if event != "payment.captured":
        return {"status": "ignored"}

    payment = data["payload"]["payment"]["entity"]
    order_id = payment["order_id"]
    payment_id = payment["id"]

    # Fetch log
    res = supabase_admin.table("payment_logs") \
        .select("*") \
        .eq("razorpay_order_id", order_id) \
        .single() \
        .execute()

    log = res.data
    if not log or log["status"] == "paid":
        return {"status": "ok"}  # idempotent

    # Credit slots
    supabase_admin.table("seller_profile").update({
        "total_slots": supabase_admin.rpc(
            "increment",
            {"x": log["slots_added"]}
        )
    }).eq("id", log["seller_id"]).execute()

    # Update log
    supabase_admin.table("payment_logs").update({
        "status": "paid",
        "razorpay_payment_id": payment_id
    }).eq("id", log["id"]).execute()

    return {"status": "success"}
