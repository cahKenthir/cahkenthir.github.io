from flask import Flask, request, jsonify
import torch
from diffusers import DiffusionPipeline

app = Flask(__name__)

device = "cuda" if torch.cuda.is_available() else "cpu"
pipe = DiffusionPipeline.from_pretrained("damo-vilab/text-to-video-ms-1.7b", torch_dtype=torch.float16).to(device)

@app.route('/generate', methods=['POST'])
def generate_video():
    data = request.json
    prompt = data['text']
    
    video_frames = pipe(prompt, num_inference_steps=50).frames
    
    return jsonify({
        'status': 'success',
        'frames': len(video_frames)
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)