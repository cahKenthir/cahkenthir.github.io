import cv2
import numpy as np
import insightface
from flask import Flask, request, jsonify
import os
import uuid

app = Flask(__name__)
app_face = FaceAnalysis(name='buffalo_l')
app_face.prepare(ctx_id=0, det_size=(640, 640))

@app.route('/swap', methods=['POST'])
def face_swap():
    if 'source' not in request.files or 'target' not in request.files:
        return jsonify({'error': 'Source and target files required'}), 400
    
    source = request.files['source']
    target = request.files['target']
    
    # Save temporary files
    source_path = f"/tmp/{uuid.uuid4()}.jpg"
    target_path = f"/tmp/{uuid.uuid4()}.jpg"
    source.save(source_path)
    target.save(target_path)
    
    # Read images
    source_img = cv2.imread(source_path)
    target_img = cv2.imread(target_path)
    
    # Face detection
    source_faces = app_face.get(source_img)
    target_faces = app_face.get(target_img)
    
    if len(source_faces) == 0 or len(target_faces) == 0:
        return jsonify({'error': 'No faces detected'}), 400
    
    # Perform swap
    swapper = insightface.model_zoo.get_model('inswapper_128.onnx')
    result = swapper.get(target_img, target_faces[0], source_faces[0])
    
    # Save result
    output_path = f"/results/{uuid.uuid4()}.jpg"
    cv2.imwrite(output_path, result)
    
    return jsonify({
        'status': 'success',
        'result_url': f'/results/{os.path.basename(output_path)}'
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5002)