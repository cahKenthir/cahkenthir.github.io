import os
from flask import Flask, request, jsonify
import uuid
import subprocess
from werkzeug.utils import secure_filename

app = Flask(__name__)
UPLOAD_FOLDER = 'ai_uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'mp4', 'mov'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/generate', methods=['POST'])
def generate_video():
    # Text-to-video generation
    if 'text' in request.json:
        text_prompt = request.json['text']
        # Call your AI model here (e.g., Stable Diffusion, etc.)
        video_path = f"generated/{uuid.uuid4()}.mp4"
        # Placeholder for actual AI call
        # subprocess.run(['python', 'text_to_video.py', text_prompt, video_path])
        return jsonify({
            'status': 'success',
            'video_url': f'/generated/{video_path}'
        })
    
    # Image-to-video generation
    if 'file' in request.files:
        file = request.files['file']
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)
            
            # Process with AI
            output_path = f"generated/{uuid.uuid4()}.mp4"
            # Placeholder for actual AI call
            # subprocess.run(['python', 'image_animation.py', filepath, output_path])
            
            return jsonify({
                'status': 'success',
                'video_url': f'/generated/{output_path}'
            })
    
    return jsonify({'error': 'Invalid request'}), 400

if __name__ == '__main__':
    app.run(port=5001)
