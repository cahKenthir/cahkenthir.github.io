from flask import Flask, request, jsonify
import cv2
import numpy as np
import os
import uuid
from werkzeug.utils import secure_filename

app = Flask(__name__)

# Initialize face detection (using OpenCV as example)
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

@app.route('/swap', methods=['POST'])
def face_swap():
    if 'files' not in request.files or len(request.files.getlist('files')) != 2:
        return jsonify({'error': 'Two files required'}), 400
    
    # Save uploaded files
    source_file = request.files.getlist('files')[0]
    target_file = request.files.getlist('files')[1]
    
    source_path = f"temp/{secure_filename(source_file.filename)}"
    target_path = f"temp/{secure_filename(target_file.filename)}"
    
    os.makedirs('temp', exist_ok=True)
    source_file.save(source_path)
    target_file.save(target_path)
    
    # Perform face swap (simplified example)
    try:
        # Load images
        source_img = cv2.imread(source_path)
        target_img = cv2.imread(target_path)
        
        # Detect faces
        source_faces = face_cascade.detectMultiScale(cv2.cvtColor(source_img, cv2.COLOR_BGR2GRAY), 1.1, 4)
        target_faces = face_cascade.detectMultiScale(cv2.cvtColor(target_img, cv2.COLOR_BGR2GRAY), 1.1, 4)
        
        if len(source_faces) == 0 or len(target_faces) == 0:
            return jsonify({'error': 'No faces detected'}), 400
        
        # Simple face swap (in a real app, you'd use more advanced techniques)
        (x,y,w,h) = source_faces[0]
        source_face = source_img[y:y+h, x:x+w]
        
        (x,y,w,h) = target_faces[0]
        # Resize source face to target face dimensions
        resized_face = cv2.resize(source_face, (w, h))
        target_img[y:y+h, x:x+w] = resized_face
        
        # Save result
        output_path = f"results/{uuid.uuid4()}.jpg"
        os.makedirs('results', exist_ok=True)
        cv2.imwrite(output_path, target_img)
        
        return jsonify({
            'status': 'success',
            'result_url': f'/results/{output_path}'
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5002)
