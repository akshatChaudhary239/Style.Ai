import os
import razorpay
import hmac
import hashlib

RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID")
RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET")
RAZORPAY_WEBHOOK_SECRET = os.getenv("RAZORPAY_WEBHOOK_SECRET")

if not RAZORPAY_KEY_ID or not RAZORPAY_KEY_SECRET:
    raise RuntimeError("Razorpay keys not set")

client = razorpay.Client(
    auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET)
)

# ---- Slot Packs (V1: hardcoded, safe) ----
SLOT_PACKS = {
    "pack_5":  {"amount": 49900, "slots": 5},   # amount in paise
    "pack_12": {"amount": 99900, "slots": 12},
    "pack_30": {"amount": 199900, "slots": 30},
}

def get_pack(pack_id: str):
    pack = SLOT_PACKS.get(pack_id)
    if not pack:
        raise ValueError("Invalid slot pack")
    return pack

def create_order(amount_paise: int, receipt: str):
    return client.order.create({
        "amount": amount_paise,
        "currency": "INR",
        "receipt": receipt,
        "payment_capture": 1,
    })

def verify_webhook_signature(payload: bytes, signature: str):
    if not RAZORPAY_WEBHOOK_SECRET:
        raise RuntimeError("RAZORPAY_WEBHOOK_SECRET not set")

    expected = hmac.new(
        RAZORPAY_WEBHOOK_SECRET.encode(),
        payload,
        hashlib.sha256
    ).hexdigest()

    return hmac.compare_digest(expected, signature)
