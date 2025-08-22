# CyberArk Computer Vision Analysis

This project automates the analysis of screen recordings for security monitoring and access management. It combines **OpenCV frame differencing** with **Meta's Llama4 Maverick AI** to efficiently analyze only significant frames, minimizing cost and maximizing insight.

## 🚀 Key Features

- **Frame Differencing Pipeline**: Detects significant screen changes using OpenCV, filtering out redundant frames (e.g., partial typing, idle screens).
- **AI-Powered Analysis**: Uses Llama4 Maverick to extract applications, text, and user activities from selected frames.
- **Rate Limiting Protection**: Smart retry logic with sleep timers to handle Together AI's strict per-model rate limits (auto-retries on 429 errors).
- **Cost Optimization**: Reduces API calls by 95%+ by analyzing only meaningful frames.
- **Configurable & Robust**: Adjustable sensitivity, retry count, and sleep duration for different use cases and budgets.
- **Automated Reporting**: Generates detailed, structured markdown reports for compliance and review.

## 📦 Requirements

```bash
pip install together opencv-python pillow requests
```

## ⚡ Quick Start

1. **Set your Together API key** in the notebook:
   ```python
   os.environ["TOGETHER_API_KEY"] = "your_api_key_here"
   ```
2. **Configure input/output paths** (defaults provided):
   ```python
   video_path_coding_vba = "./VidRecordings/CodingVBA_sample.mp4"
   output_video_coding_vba = "./Outputs/analysis_output_coding_vba.md"
   ```
3. **Run the enhanced pipeline** (with rate limiting protection):
   ```python
   ENHANCED_CONFIG = {
       'difference_threshold': 0.1,    # Sensitivity to changes
       'min_frame_interval': 5,        # Frames between captures
       'max_frames': 60,               # Max frames to analyze
       'resize_factor': 1,             # Speed/quality tradeoff
       'max_retries': 5,               # Retries on rate limit
       'sleep_duration': 70,           # Seconds to wait on 429
       'cleanup_temp_files': False,    # Clean up after run
       'username': 'YourName'
   }
   result_path = process_video_with_frame_differencing(
       video_path=video_path_coding_vba,
       output_markdown_path=output_video_coding_vba,
       **ENHANCED_CONFIG
   )
   ```

## ⚙️ Configuration Tips

| Parameter           | Description                        | Recommended      |
|---------------------|------------------------------------|------------------|
| `difference_threshold` | Sensitivity to frame changes     | 0.05–0.3         |
| `min_frame_interval`   | Min frames between captures      | 10–60            |
| `max_frames`           | Max frames to analyze            | 10–60            |
| `max_retries`          | Retries on 429 errors            | 3–5              |
| `sleep_duration`       | Wait time after rate limit (sec) | 70–80            |

- **High sensitivity**: More frames, more cost, more detail
- **Low sensitivity**: Fewer frames, lower cost, only major changes
- **Preview**: Use `preview_extracted_frames()` to visually check frame selection

## 🛡️ Rate Limiting & Error Handling

- **Automatic Retry**: If a 429 (rate limit) error occurs, the pipeline waits (`sleep_duration`) and retries up to `max_retries` times per frame.
- **Resumes from Failure**: Each frame is retried independently; failures do not halt the pipeline.
- **Together AI Model Limit**: Llama4 Maverick is limited to ~0.6 queries/minute (1 every ~100s). Adjust `sleep_duration` accordingly.
- **Console Output**: Progress and retry status are printed for monitoring.

## 📊 Example Output

Markdown reports include:
- Metadata (video, timestamp, user)
- Applications/tools detected
- Activity timeline (summaries per frame)
- Security/compliance notes

## 📝 Project Structure

```
Cyberark_CompVision/
├── FrameDifferencing_llama4Maverick.ipynb  # Main notebook
├── Screenshots/                           # Sample images
├── VidRecordings/                         # Input videos
├── Outputs/                               # Analysis reports
└── README.md                              # Documentation
```

## 🔒 Security & Compliance
- Use only with proper authorization
- Reports may contain sensitive data—handle securely
- Protect your API keys

## 💡 Tips for Risk Teams
- Tune `difference_threshold` and `max_frames` for your monitoring needs
- Use preview utilities to validate frame selection
- Monitor API usage and costs
- Review reports for compliance and incident response

---
For more details, see the notebook's code comments and example cells.