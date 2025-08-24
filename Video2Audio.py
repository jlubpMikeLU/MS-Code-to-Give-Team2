

import ffmpeg
import os

def extract_audio_ffmpeg(video_path, output_audio_path=None):
    """
    Extract audio using ffmpeg
    
    Args:
        video_path (str): Path to the input video file
        output_audio_path (str): Path for the output audio file
    
    Returns:
        str: Path to the extracted audio file
    """
    if output_audio_path is None:
        base_name = os.path.splitext(video_path)[0]
        output_audio_path = f"{base_name}_audio.mp3"
    
    try:
        (
            ffmpeg
            .input(video_path)
            .output(output_audio_path, acodec='libmp3lame', audio_bitrate='192k')
            .run(overwrite_output=True, capture_stdout=True, capture_stderr=True)
        )
        return output_audio_path
    except ffmpeg.Error as e:
        print(f"Error: {e.stderr.decode()}")
        return None

# Example usage
audio_file = extract_audio_ffmpeg("input_video.mp4", "output_audio.mp3")

