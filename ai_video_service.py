import os
import uuid
import subprocess
from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
import torch
from diffusers import DiffusionPipeline, StableDiffusionInstructPix2PixPipeline
import cv2
import numpy as np

app = Flask(__name__)

# Configuration
UPLOAD_FOLDER = 'ai_uploads'
RESULTS_FOLDER = 'results'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(RESULTS_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Load AI Models
device = "cuda" if torch.cuda.is_available() else "cpu"
text_to_video_pipe = DiffusionPipeline.from_pretrained(
    "damo-vilab/text-to-video-ms-1.7b",
    torch_dtype=torch.float16,
    variant="fp16"
).to(device)

image_to_video_pipe = StableDiffusionInstructPix2PixPipeline.from_pretrained(
    "timbrooks/instruct-pix2pix",
    torch_dtype=torch.float16
).to(device)

@app.route('/generate', methods=['POST'])
def generate_video():
    data = request.json
    if not data or 'text' not in data:
        return jsonify({'error': 'Text prompt required'}), 400
    
    prompt = data['text']
    duration = int(data.get('duration', 15))
    style = data.get('style', 'cinematic')
    
    try:
        # Generate video frames
        video_frames = text_to_video_pipe(
            prompt,
            num_inference_steps=50,
            num_frames=duration*10
        ).frames
        
        # Save as video
        output_filename = f"{str(uuid.uuid4())}.mp4"
        output_path = os.path.join(RESULTS_FOLDER, output_filename)
        
        # Convert frames to video using OpenCV
        height, width, _ = video_frames[0].shape
        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        video = cv2.VideoWriter(output_path, fourcc, 10, (width, height))
        
        for frame in video_frames:
            video.write(cv2.cvtColor(frame, cv2.COLOR_RGB2BGR))
        video.release()
        
        return jsonify({
            'status': 'success',
            'video_url': f'/results/{output_filename}'
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/animate', methods=['POST'])
def animate_image():
    if 'file' not in request.files:
        return jsonify({'error': 'Image file required'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    style = request.form.get('style', 'animation')
    filename = secure_filename(file.filename)
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(filepath)
    
    try:
        # Process image with InstructPix2Pix
        output_frames = image_to_video_pipe(
            f"transform this image into {style} style",
            image=filepath,
            num_inference_steps=50,
            image_guidance_scale=1.5,
            guidance_scale=7.5
        ).images
        
        # Create animation
        output_filename = f"animated_{str(uuid.uuid4())}.mp4"
        output_path = os.path.join(RESULTS_FOLDER, output_filename)
        
        height, width, _ = cv2.imread(filepath).shape
        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        video = cv2.VideoWriter(output_path, fourcc, 10, (width, height))
        
        for frame in output_frames:
            frame_cv = cv2.cvtColor(np.array(frame), cv2.COLOR_RGB2BGR)
            video.write(frame_cv)
        video.release()
        
        return jsonify({
            'status': 'success',
            'video_url': f'/results/{output_filename}'
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
