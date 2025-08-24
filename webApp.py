


from flask import Flask, render_template, request, redirect, url_for
import webbrowser
import os
from flask_cors import CORS
import json

import lambdaTTS
import lambdaSpeechToScore
import lambdaGetSample

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = '*'

rootPath = ''


@app.route(rootPath+'/')
def main():
    return render_template('main.html')


# @app.route(rootPath + '/upload_csv', methods=['GET', 'POST'])
# def upload_csv():
#     message = ""
#     if request.method == 'POST':
#         csv_path = request.form.get('csv_path')
#         try:
#             lambdaGetSample.save_csv_to_database(csv_path, language='en')
#             message = f"CSV saved to databases/data_en.csv"
#         except Exception as e:
#             message = f"Error: {str(e)}"
#     return render_template('upload_csv.html', message=message)



@app.route(rootPath + '/upload_csv', methods=['GET', 'POST'])
def upload_csv():
    message = ""
    if request.method == 'POST':
        csv_path = request.form.get('csv_path')
        try:
            lambdaGetSample.save_csv_to_database(csv_path, language='en')
            # Optionally reload your dataset here
            lambdaGetSample.reload_lambda_database(language='en')
            message = f"CSV saved to databases/data_en.csv"
            return redirect(url_for('main'))  # Redirect to main page after upload
        except Exception as e:
            message = f"Error: {str(e)}"
    return render_template('upload_csv.html', message=message)


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


if __name__ == "__main__":
    language = 'en'
    print(os.system('pwd'))
    webbrowser.open_new('http://127.0.0.1:3000/')
    app.run(host="0.0.0.0", port=3000)


