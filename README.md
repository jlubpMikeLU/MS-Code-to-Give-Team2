### AI Pronunciation Trainer

This is an AI-powered pronunciation training application that helps users improve their spoken language skills. The application provides instant feedback on pronunciation accuracy, allowing users to practice speaking sentences and receive a score based on how closely their pronunciation matches the target. It supports multiple languages and can be extended with custom training data.

-----

### Features

  * **Real-time Pronunciation Scoring**: Get an accuracy score for your pronunciation of a given sentence.
  * **Text-to-Speech**: Listen to a native-like pronunciation of the target sentence to hear the correct way to say it.
  * **Upload Videos**: Analyze audio from an uploaded video file to check your pronunciation.
  * **Customizable Content**: Upload your own CSV files with sentences and their translations to create personalized practice sets.
  * **Language Support**: The application is configured to support English and German but can be expanded with additional languages.

-----

### Getting Started

#### Prerequisites

  * Python 3.x
  * `pip` (Python package installer)
  * An internet connection to download necessary libraries and models.

#### Installation

1.  **Clone the Repository**:

    ```bash
    git clone https://github.com/jlubpMikeLU/MS-Code-to-Give-Team2.git
    cd MS-Code-to-Give-Team2
    ```

2.  **Create a Virtual Environment**:
    It's recommended to create a virtual environment to manage project dependencies.

    ```bash
    python -m venv ai_pronunciation
    ```

3.  **Activate the Virtual Environment**:

      - **Windows**:
        ```bash
        .\ai_pronunciation\Scripts\activate
        ```
      - **macOS / Linux**:
        ```bash
        source ai_pronunciation/bin/activate
        ```

4.  **Install Dependencies**:
    Install all required Python packages from the `requirements.txt` file.

    ```bash
    pip install -r requirements.txt
    ```

<img width="2876" height="1699" alt="image" src="https://github.com/user-attachments/assets/dfc5a0c7-4443-4adb-aa53-54db4b565c55" />

### Running the Application

1.  Make sure your virtual environment is activated.
2.  Run the main application file.
    ```bash
    python webApp.py
    ```
3.  The application will start a local server, and a web browser window will automatically open to `http://127.0.0.1:3000/homework_list`.

-----

### Usage

#### Homework List
  * The application starts on a homework list page.
  * Click the **"Submit Audio"** button next to a homework title to be taken to the pronunciation assessment page.
<img width="2856" height="1605" alt="image" src="https://github.com/user-attachments/assets/a8754c83-790c-44b4-87ca-5219901666f3" />



#### Main Pronunciation Page
  * **Select Language**: Use the dropdown menu to choose between English or German.
  * **Pronunciation Assessment**:
      * Click the microphone button to start recording your voice.
      * Click the microphone button again to stop recording.
      * The application will display a score and highlight words you pronounced well or poorly.
  * **Text Input**: The text field will be pre-filled with the homework title you selected.
  * **Play Sample Audio**: Click the play button to hear a machine-generated pronunciation of the sentence for reference.
  * **Upload Video**: Click the **"Upload Video"** link to upload a video file. The application will extract the audio and perform a pronunciation check on the extracted audio.
<img width="2869" height="1617" alt="image" src="https://github.com/user-attachments/assets/3d36c63e-6d04-4a16-b48d-27d5e61a835b" />

-----

### Extending the Application

  * **Adding New Sentences**: You can upload a CSV file with your own set of sentences and translations by navigating to the `/upload_csv` route or by using the **"Upload CSV"** link on the main page. The CSV should have columns for the sentence, translation, and any other relevant data.
