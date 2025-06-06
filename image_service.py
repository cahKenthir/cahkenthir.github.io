from flask import Flask, request, jsonify
import os
import uuid
import cv2
import numpy as np
from PIL import Image
import torch
from realesrgan import RealESRGAN
from rembg import remove
from werkzeug.utils import secure_filename

app = Flask(__name__)

# Configuration
UPLOAD_FOLDER = 'img_uploads'
RESULTS_FOLDER = 'img_results'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(RESULTS_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Load AI Models
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
esrgan = RealESRGAN(device, scale=4)
esrgan.load_weights('weights/RealESRGAN_x4plus.pth')

@app.route('/process', methods=['POST'])
def process_image():
    if 'image' not in request.files:
        return jsonify({'error': 'Image file required'}), 400
    
    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    action = request.form.get('action', 'enhance')
    filename = secure_filename(file.filename)
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(filepath)
    
    try:
        output_filename = f"{action}_{str(uuid.uuid4())}.png"
        output_path = os.path.join(RESULTS_FOLDER, output_filename)
        
        if action == 'enhance':
            # Super-resolution
            img = Image.open(filepath).convert('RGB')
            sr_img = esrgan.predict(img)
            sr_img.save(output_path)
        elif action == 'remove_bg':
            # Background removal
            with open(filepath, 'rb') as f:
                input_img = f.read()
            output_img = remove(input_img)
            with open(output_path, 'wb') as f:
                f.write(output_img)
        elif action == 'retouch':
            # Face retouching (simplified)
            img = cv2.imread(filepath)
            
            # Face detection
            face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            faces = face_cascade.detectMultiScale(gray, 1.1, 4)
            
            for (x, y, w, h) in faces:
                # Apply skin smoothing
                face_roi = img[y:y+h, x:x+w]
                face_roi = cv2.bilateralFilter(face_roi, 9, 75, 75)
                img[y:y+h, x:x+w] = face_roi
            
            cv2.imwrite(output_path, img)
        else:
            return jsonify({'error': 'Invalid action'}), 400
        
        return jsonify({
            'status': 'success',
            'image_url': f'/results/{output_filename}'
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5003)
