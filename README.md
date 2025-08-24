
# AI Pronunciation Trainer 

## Installation 

1. Install ffmpeg: https://ffmpeg.org/download.html
   You can follow this youtube video to install: https://www.youtube.com/watch?v=4jx2_j5Seew

2. Create a virtual environment and run it:
```
python -m venv venv 
.\venv\Scripts\activate 
pip install -r requirements.txt
python webApp.py
```

3. If any problems met, change according to the picture:
<img width="1280" height="505" alt="image" src="https://github.com/user-attachments/assets/9c6c7336-7f06-4795-bee6-2645383d4de7" />
<img width="1280" height="518" alt="image" src="https://github.com/user-attachments/assets/75b72a1a-f50c-40aa-9d32-6735af1fd672" />

```
csv_path = str(files("panphon").joinpath(fn))
df = pd.read_csv(csv_path, encoding='utf-8')

weights_path = str(files('panphon').joinpath(weights_fn))
df = pd.read_csv(weights_path, encoding='utf-8')
```

