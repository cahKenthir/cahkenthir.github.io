from flask import Flask, request, jsonify
import cv2
import numpy as np
import dlib
import os
import uuid
from werkzeug.utils import secure_filename
from PIL import Image
import insightface
from insightface.app import FaceAnalysis

app = Flask(__name__)

# Initialize face analysis
app_face = FaceAnalysis(name='buffalo_l')
app_face.prepare(ctx_id=0, det_size=(640, 640))

# Configuration
UPLOAD_FOLDER = 'face_uploads'
RESULTS_FOLDER = 'face_results'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(RESULTS_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def swap_faces(source_img, target_img, blend_percent=50, color_match_percent=75):
    # Detect faces
    source_faces = app_face.get(source_img)
    target_faces = app_face.get(target_img)
    
    if len(source_faces) == 0 or len(target_faces) == 0:
        raise ValueError("No faces detected in one or both images")
    
    # Get face landmarks
    source_face = source_faces[0]
    target_face = target_faces[0]
    
    # Swap faces using InsightFace
    swapper = insightface.model_zoo.get_model('inswapper_128.onnx', download=True)
    
    # Convert blend and color match to 0-1 range
    blend_ratio = blend_percent / 100.0
    color_match_ratio = color_match_percent / 100.0
    
    # Perform face swap
    result_img = swapper.get(target_img, target_face, source_face, 
                           paste_back=True, 
                           blend_ratio=blend_ratio,
                           color_match_ratio=color_match_ratio)
    
    return result_img

@app.route('/swap', methods=['POST'])
def face_swap_api():
    if 'source' not in request.files or 'target' not in request.files:
        return jsonify({'error': 'Source and target files required'}), 400
    
    source_file = request.files['source']
    target_file = request.files['target']
    
    if source_file.filename == '' or target_file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    # Save uploaded files
    source_filename = secure_filename(source_file.filename)
    target_filename = secure_filename(target_file.filename)
    source_path = os.path.join(app.config['UPLOAD_FOLDER'], source_filename)
    target_path = os.path.join(app.config['UPLOAD_FOLDER'], target_filename)
    
    source_file.save(source_path)
    target_file.save(target_path)
    
    try:
        # Read images
        source_img = cv2.imread(source_path)
        target_img = cv2.imread(target_path)
        
        # Get parameters
        blend = int(request.form.get('blend', 50))
        color_match = int(request.form.get('color_match', 75))
        
        # Perform face swap
        result_img = swap_faces(source_img, target_img, blend, color_match)
        
        # Save result
        output_filename = f"swapped_{str(uuid.uuid4())}.jpg"
        output_path = os.path.join(RESULTS_FOLDER, output_filename)
        cv2.imwrite(output_path, result_img)
        
        return jsonify({
            'status': 'success',
            'result_url': f'/results/{output_filename}'
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5002)
