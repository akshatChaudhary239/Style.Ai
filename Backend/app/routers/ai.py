from fastapi import APIRouter
from app.services.style_engine import recommend_outfit

router = APIRouter()


@router.post("/recommend")
async def recommend_handler(payload: dict):
    """
    Frontend sends:
    {
        "height_cm": int,
        "weight_kg": int,
        "body_type": str,
        "skin_tone": str,
        "clothing_type": str,
        "budget": str
    }
    """
    # Call our custom rule-based recommendation engine
    recommendation = recommend_outfit(payload)

    return {
        "success": True,
        "recommendation": recommendation
    }
