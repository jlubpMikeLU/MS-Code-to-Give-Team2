
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
