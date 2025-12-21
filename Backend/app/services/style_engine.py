

def recommend_outfit(profile: dict):
    """
    profile = {
        "height_cm": int,
        "weight_kg": int,
        "body_type": str,
        "skin_tone": str,
        "clothing_type": str,
        "budget": str
    }
    """

    height = profile["height_cm"]
    weight = profile["weight_kg"]
    body_type = profile["body_type"]
    skin_tone = profile["skin_tone"]
    clothing_type = profile["clothing_type"]
    budget = profile["budget"]

    # ---------------------------------------------
    # 1️⃣ COLOR RECOMMENDATIONS BASED ON SKIN TONE
    # ---------------------------------------------
    color_rules = {
        "brown": ["red", "mustard", "olive green", "navy", "white", "black"],
        "white": ["black", "grey", "navy", "olive", "pastel blue"],
        "black": ["white", "cream", "light grey", "soft pastels"],
        "asian": ["navy", "earth tones", "maroon", "white"],
    }

    avoid_colors = {
        "brown": ["pale pastels", "neon colors"],
        "white": ["neon yellow"],
        "black": ["dark brown"],
        "asian": ["neon green"],
    }

    best_colors = color_rules.get(skin_tone, ["black"])
    bad_colors = avoid_colors.get(skin_tone, [])

    # ---------------------------------------------
    # 2️⃣ TOP WEAR BASED ON BODY TYPE + HEIGHT
    # ---------------------------------------------
    if body_type == "fit":
        top = f"{best_colors[0]} oversized t-shirt"
        top_reason = "Oversized fits compliment your structured frame and give a clean streetwear vibe."
    elif body_type == "skinny":
        top = f"{best_colors[1]} hoodie or boxy tee"
        top_reason = "Boxy fits add volume and improve your proportions."
    elif body_type == "skinny fat":
        top = f"{best_colors[0]} structured tee or layered shirt"
        top_reason = "Structure helps define your frame and balance the torso."
    else:  # extreme fat
        top = f"dark {best_colors[2]} vertical-pattern shirt"
        top_reason = "Dark colors and vertical patterns slim the profile and add proportion."

    # ---------------------------------------------
    # 3️⃣ BOTTOM WEAR LOGIC
    # ---------------------------------------------
    if body_type in ["fit", "skinny fat"]:
        bottom = "black or blue baggy jeans"
        bottom_reason = "Baggy jeans balance proportions and suit your body structure."
    elif body_type == "skinny":
        bottom = "cargo pants or relaxed-fit denim"
        bottom_reason = "Adds volume to the lower body and balances your silhouette."
    else:
        bottom = "straight-fit dark jeans"
        bottom_reason = "Straight fit enhances symmetry and avoids extra bulk."

    # ---------------------------------------------
    # 4️⃣ SHOES LOGIC
    # ---------------------------------------------
    shoes = "white sneakers or Converse"
    shoes_reason = "White sneakers work with every outfit and add a clean contrast."

    # ---------------------------------------------
    # 5️⃣ FINAL PERSONALITY MESSAGE (AI VIBES)
    # ---------------------------------------------
    message = (
        f"Trust me bestie, this combo is FIRE 🔥. "
        f"The {top} will highlight your tone, "
        f"and pairing it with {bottom} completes the perfect street-casual vibe. "
        "Finish it confidently — you're gonna look amazing.\""
    )

    # ---------------------------------------------
    # RETURN STRUCTURED RESULT
    # ---------------------------------------------
    return {
        "top": top,
        "top_reason": top_reason,
        "bottom": bottom,
        "bottom_reason": bottom_reason,
        "shoes": shoes,
        "shoes_reason": shoes_reason,
        "avoid_colors": bad_colors,
        "best_colors": best_colors,
        "message": message,
    }
