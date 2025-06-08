from flask import Flask, request, jsonify
from PIL import Image
import io
import numpy as np
import cv2
import rembg
import realesrgan

app = Flask(__name__)

@app.route('/enhance', methods=['POST'])
def enhance_image():
    if 'image' not in request.files:
        return jsonify({'error': 'Image file required'}), 400
    
    image = request.files['image'].read()
    
    # Remove background
    output = rembg.remove(image)
    
    # Convert to PIL Image
    img = Image.open(io.BytesIO(output))
    
    # Super resolution
    model = realesrgan.RealESRGAN(device='cuda')
    model.load_weights('weights/RealESRGAN_x4plus.pth')
    sr_img = model.predict(img)
    
    # Save result
    output_path = f"/results/enhanced_{uuid.uuid4()}.png"
    sr_img.save(output_path)
    
    return jsonify({
        'status': 'success',
        'image_url': f'/results/{os.path.basename(output_path)}'
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5003)