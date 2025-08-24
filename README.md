To rewrite the `README.md` while keeping everything the same except for the CSV and video upload parts, you just need to remove the two sections that mention those features. I've updated the document for you, focusing the content on the core audio-based functionality.

-----

### AI Pronunciation Trainer

This is an AI-powered pronunciation training application that helps users improve their spoken language skills. The application provides instant feedback on pronunciation accuracy, allowing users to practice speaking sentences and receive a score based on how closely their pronunciation matches the target. It supports multiple languages and can be extended with custom training data.

#### Features

  * **Real-time Pronunciation Scoring:** Get an accuracy score for your pronunciation of a given sentence.
  * **Text-to-Speech:** Listen to a native-like pronunciation of the target sentence to hear the correct way to say it.
  * **Language Support:** The application is configured to support English and German but can be expanded with additional languages.

-----

### Getting Started

#### Prerequisites

  * Python 3.x
  * pip (Python package installer)
  * An internet connection to download necessary libraries and models.

#### Installation

1.  **Clone the Repository:**

    ```bash
    git clone https://github.com/jlubpMikeLU/MS-Code-to-Give-Team2.git
    cd MS-Code-to-Give-Team2
    ```

2.  **Create a Virtual Environment:**
    It's recommended to create a virtual environment to manage project dependencies.

    ```bash
    python -m venv ai_pronunciation
    ```

3.  **Activate the Virtual Environment:**

      * **Windows:**
        ```bash
        .\ai_pronunciation\Scripts\activate
        ```
      * **macOS / Linux:**
        ```bash
        source ai_pronunciation/bin/activate
        ```

4.  **Install Dependencies:**
    Install all required Python packages from the `requirements.txt` file.

    ```bash
    pip install -r requirements.txt
    ```
<img width="2879" height="1702" alt="image" src="https://github.com/user-attachments/assets/e02a0291-e04e-4484-886f-569bb78b60cb" />

-----

### Running the Application

1.  Make sure your virtual environment is activated.

2.  Run the main application file.

    ```bash
    python webApp.py
    ```

    The application will start a local server, and a web browser window will automatically open to `http://127.0.0.1:3000/homework_list`.

-----

### Usage

#### Homework List

The application starts on a homework list page. Click the **"Submit Audio"** button next to a homework title to be taken to the pronunciation assessment page.

#### Main Pronunciation Page

  * **Select Language:** Use the dropdown menu to choose between English or German.
  * **Pronunciation Assessment:**
      * Click the microphone button to start recording your voice.
      * Click the microphone button again to stop recording.
      * The application will display a score and highlight words you pronounced well or poorly.
  * **Text Input:** The text field will be pre-filled with the homework title you selected.
  * **Play Sample Audio:** Click the play button to hear a machine-generated pronunciation of the sentence for reference.
<img width="2865" height="1611" alt="image" src="https://github.com/user-attachments/assets/60189563-41cb-4acb-b579-dcb42aacf193" />

<img width="2872" height="1610" alt="image" src="https://github.com/user-attachments/assets/0d15515f-d969-4860-b56a-83769da3716a" />

