"""Adaptive Image Printing Service

This small Flask service fetches images, computes simple image metrics
and applies adaptive enhancements (autocontrast, brightness adjustment,
resizing, and optional conversion to WebP) before returning the processed image.

It also exposes `/health` and `/metrics` endpoints so the orchestrator can be "self-aware".
"""
from io import BytesIO
import time
import threading
from typing import Dict

import numpy as np
from PIL import Image, ImageOps, ImageEnhance
import requests
from flask import Flask, request, send_file, jsonify

app = Flask(__name__)

# Simple in-memory metrics/state (not persistent)
state: Dict = {
    "last_processed": None,
    "total_processed": 0,
    "last_decision": None,
}

def analyze_image(img: Image.Image):
    arr = np.asarray(img.convert("L"), dtype=np.float32) / 255.0
    mean_brightness = float(arr.mean())
    contrast = float(arr.std())
    return {"brightness": mean_brightness, "contrast": contrast}

def adapt_and_process(img: Image.Image, width=None, height=None, prefer_webp=True):
    metrics = analyze_image(img)
    decisions = {}

    # Autocontrast for low-contrast images
    if metrics["contrast"] < 0.08:
        img = ImageOps.autocontrast(img)
        decisions["autocontrast"] = True
    else:
        decisions["autocontrast"] = False

    # Brighten dark images
    if metrics["brightness"] < 0.4:
        enhancer = ImageEnhance.Brightness(img)
        img = enhancer.enhance(1.15)
        decisions["brighten"] = 1.15
    else:
        decisions["brighten"] = 1.0

    # Resize if requested
    if width or height:
        w = width or img.width
        h = height or img.height
        img = img.resize((int(w), int(h)), Image.LANCZOS)
        decisions["resize"] = (int(w), int(h))

    # Convert to webp when preferred
    out_format = "PNG"
    if prefer_webp:
        out_format = "WEBP"
        decisions["format"] = "webp"
    else:
        decisions["format"] = "png"

    return img, metrics, decisions

@app.route("/health")
def health():
    return jsonify(status="ok"), 200

@app.route("/metrics")
def metrics():
    return jsonify(state)

@app.route("/process", methods=["POST"])
def process_image():
    """Process an image adaptively.

    JSON body options:
      - image_url: URL to fetch image (preferred), OR upload file under form key `file`
      - width, height: desired output dimensions
      - webp: boolean to request webp output
    """
    start = time.time()

    # Accept file upload or image_url
    img = None
    if "file" in request.files:
        uploaded = request.files["file"]
        img = Image.open(uploaded.stream).convert("RGB")
    else:
        data = request.get_json(silent=True) or request.form.to_dict()
        image_url = data.get("image_url") or request.args.get("image_url")
        if not image_url:
            return jsonify(error="image_url or file is required"), 400
        try:
            resp = requests.get(image_url, timeout=8)
            resp.raise_for_status()
            img = Image.open(BytesIO(resp.content)).convert("RGB")
        except Exception as e:
            return jsonify(error=f"failed to fetch image: {e}"), 400

    # parse options
    width = request.values.get("width")
    height = request.values.get("height")
    try:
        width = int(width) if width else None
        height = int(height) if height else None
    except ValueError:
        return jsonify(error="width/height must be integers"), 400

    prefer_webp = request.values.get("webp", "true").lower() not in ("0", "false", "no")

    # Process
    out_img, metrics_res, decisions = adapt_and_process(img, width=width, height=height, prefer_webp=prefer_webp)

    # update state
    state["last_processed"] = time.time()
    state["total_processed"] += 1
    state["last_decision"] = {"metrics": metrics_res, "decisions": decisions}

    buf = BytesIO()
    fmt = "WEBP" if prefer_webp else "PNG"
    out_img.save(buf, format=fmt, quality=85)
    buf.seek(0)

    duration = time.time() - start
    headers = {
        "X-Process-Time": f"{duration:.3f}",
    }

    return send_file(buf, mimetype=f"image/{fmt.lower()}", as_attachment=False, download_name=f"adaptive.{fmt.lower()}"), 200, headers

if __name__ == "__main__":
    # run in threaded mode for light concurrency; in production use a WSGI server
    app.run(host="0.0.0.0", port=5000, threaded=True)
