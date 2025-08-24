
import sys
import pandas as pd

# Set UTF-8 as default encoding
import locale
locale.getpreferredencoding = lambda: 'UTF-8'

# Apply panphon patch
import custom_panphon
custom_panphon.patch_panphon()

from flask import Flask, render_template, request, jsonify
import webbrowser
import os
from flask_cors import CORS
import json
import moviepy.editor as mp
import base64
import tempfile

import lambdaTTS
import lambdaSpeechToScore
import lambdaGetSample

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = '*'
app.config['MAX_CONTENT_LENGTH'] = 100 * 1024 * 1024  # 100MB max file size

rootPath = ''


@app.route(rootPath+'/')
def main():
    return render_template('main.html')


@app.route(rootPath + '/process_video', methods=['POST'])
def process_video():
    if 'video' not in request.files:
        return jsonify({'error': 'No video file uploaded'}), 400
    
    video_file = request.files['video']
    if video_file.filename == '':
        return jsonify({'error': 'No video selected'}), 400
    
    if not video_file.filename.lower().endswith(('.mp4', '.avi')):
        return jsonify({'error': 'Please upload an MP4 or AVI file'}), 400
        
    if not request.form.get('title'):
        return jsonify({'error': 'No text provided for pronunciation check'}), 400
        
    try:
        print("Starting video processing...")
        # Save video temporarily
        temp_video = tempfile.NamedTemporaryFile(suffix=os.path.splitext(video_file.filename)[1], delete=False)
        video_file.save(temp_video.name)
        temp_video.close()
        print(f"Video saved to {temp_video.name}")
        
        # Convert video to audio
        print("Converting video to audio...")
        try:
            video = mp.VideoFileClip(temp_video.name)
            if video.audio is None:
                raise ValueError("Video has no audio track")
                
            temp_audio = tempfile.NamedTemporaryFile(suffix='.wav', delete=False)
            print(f"Writing audio to {temp_audio.name}")
            video.audio.write_audiofile(temp_audio.name, fps=16000, logger=None)  # Set audio sample rate to match expected format
            video.close()
        except Exception as e:
            print(f"Error during video conversion: {str(e)}")
            if 'video' in locals():
                video.close()
            raise ValueError(f"Failed to convert video to audio: {str(e)}")

        # Read the audio file and convert to base64
        print("Converting audio to base64...")
        with open(temp_audio.name, 'rb') as audio_file:
            audio_data = audio_file.read()
            audio_base64 = base64.b64encode(audio_data).decode('utf-8')
        print("Audio conversion complete")

        # Clean up temporary files
        if os.path.exists(temp_video.name):
            os.unlink(temp_video.name)
        if os.path.exists(temp_audio.name):
            os.unlink(temp_audio.name)

        # Process audio through existing speech-to-score pipeline
        print("Preparing event for scoring...")
        event = {
            'body': json.dumps({
                'base64Audio': f'data:audio/wav;base64,{audio_base64}',
                'title': request.form.get('title', ''),
                'language': request.form.get('language', 'en')
            })
        }
        print(f"Event prepared with title: {request.form.get('title', '')}, language: {request.form.get('language', 'en')}")
        
        print("Processing through speech-to-score pipeline...")
        try:
            result = lambdaSpeechToScore.lambda_handler(event, None)
            print("Scoring complete")
            return result
        except Exception as scoring_error:
            print(f"Error in scoring: {str(scoring_error)}")
            raise
        
    except Exception as e:
        print(f"Error in process_video: {str(e)}")
        # Clean up any temporary files in case of error
        try:
            if 'temp_video' in locals() and os.path.exists(temp_video.name):
                print(f"Cleaning up video file: {temp_video.name}")
                os.unlink(temp_video.name)
            if 'temp_audio' in locals() and os.path.exists(temp_audio.name):
                print(f"Cleaning up audio file: {temp_audio.name}")
                os.unlink(temp_audio.name)
            if 'video' in locals():
                video.close()
        except Exception as cleanup_error:
            print(f"Error during cleanup: {str(cleanup_error)}")
            pass
        return jsonify({'error': str(e)}), 500

    try:
        # Save video temporarily
        temp_video = tempfile.NamedTemporaryFile(suffix=os.path.splitext(video_file.filename)[1], delete=False)
        video_file.save(temp_video.name)
        temp_video.close()

        # Convert video to audio
        try:
            video = mp.VideoFileClip(temp_video.name)
            if video.audio is None:
                raise ValueError("Video has no audio track")
                
            temp_audio = tempfile.NamedTemporaryFile(suffix='.wav', delete=False)
            video.audio.write_audiofile(temp_audio.name, fps=16000)  # Set audio sample rate to match expected format
            video.close()

            # Read the audio file and convert to base64
            with open(temp_audio.name, 'rb') as audio_file:
                audio_data = audio_file.read()
                audio_base64 = base64.b64encode(audio_data).decode('utf-8')
        finally:
            # Clean up temporary files
            try:
                if os.path.exists(temp_video.name):
                    os.unlink(temp_video.name)
                if os.path.exists(temp_audio.name):
                    os.unlink(temp_audio.name)
            except Exception as e:
                print(f"Error cleaning up temporary files: {e}")

        # Process audio through existing speech-to-score pipeline
        event = {
            'body': json.dumps({
                'base64Audio': f'data:audio/wav;base64,{audio_base64}',
                'title': request.form.get('title', ''),
                'language': request.form.get('language', 'en')
            })
        }
        
        result = lambdaSpeechToScore.lambda_handler(event, None)
        return result

    except Exception as e:
        return jsonify({'error': str(e)}), 500




@app.route(rootPath+'/getAudioFromText', methods=['POST'])
def getAudioFromText():
    event = {'body': json.dumps(request.get_json(force=True))}
    return lambdaTTS.lambda_handler(event, [])


@app.route(rootPath+'/getSample', methods=['POST'])
def getNext():
    event = {'body':  json.dumps(request.get_json(force=True))}
    return lambdaGetSample.lambda_handler(event, [])


@app.route(rootPath+'/GetAccuracyFromRecordedAudio', methods=['POST'])
def GetAccuracyFromRecordedAudio():

    try:
        event = {'body': json.dumps(request.get_json(force=True))}
        lambda_correct_output = lambdaSpeechToScore.lambda_handler(event, [])
    except Exception as e:
        print('Error: ', str(e))
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Credentials': "true",
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
            },
            'body': ''
        }

    return lambda_correct_output

@app.route(rootPath + '/homework_list')
def homework_list():
    # You can get this list from a database in a real application
    homeworks = [
        {'id': 1, 'title': 'English Pronunciation - Lesson 1'},
        {'id': 2, 'title': 'The Importance of a Good Pronunciation'},
        {'id': 3, 'title': 'Practice your R and L sounds'}
    ]
    return render_template('homework_list.html', homeworks=homeworks)

@app.route(rootPath + '/launch_assessment')
def launch_assessment():
    title = request.args.get('title', '')
    return render_template('main.html', homework_title=title)

if __name__ == "__main__":
    language = 'en'
    print(os.system('pwd'))
    webbrowser.open_new('http://127.0.0.1:3000/homework_list')
    app.run(host="0.0.0.0", port=3000)
