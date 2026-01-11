# 🎬 Aeterna Video Generation Examples

This folder contains ready-to-use JSON payload examples for generating motivational videos about successful people.

## 📋 Available Examples

### 1. **example_motivation.json** (Default)
- **Topic**: The Habits of Highly Successful People
- **Aspect Ratio**: 16:9 (YouTube, Desktop)
- **Voice**: Gemini Zephyr-Female
- **Duration**: ~5 seconds per clip

### 2. **example_morning_routine.json**
- **Topic**: Morning Habits of Billionaires
- **Aspect Ratio**: 9:16 (TikTok, Instagram Reels, YouTube Shorts)
- **Voice**: Gemini Zephyr-Male
- **Duration**: ~4 seconds per clip
- **Style**: Vertical video with golden text

### 3. **example_never_give_up.json**
- **Topic**: From Failure to Fortune - Inspiring Stories
- **Aspect Ratio**: 16:9 (YouTube, Desktop)
- **Voice**: Gemini Zephyr-Female
- **Duration**: ~6 seconds per clip
- **Style**: Emotional with background overlay

### 4. **example_focus.json**
- **Topic**: The Power of Focus - Goal Achievement
- **Aspect Ratio**: 1:1 (Instagram Feed, Facebook)
- **Voice**: Gemini Zephyr-Male
- **Duration**: ~5 seconds per clip
- **Style**: Square format with cyan text

## 🚀 Quick Start

### Step 1: Start the API Server
```bash
./start_api.sh
```

Wait until you see:
```
✨ Starting API server on http://127.0.0.1:8080
📖 API Documentation: http://127.0.0.1:8080/docs
```

### Step 2: Generate a Video

**Option A: Using the Script (Easiest)**
```bash
# Generate with default motivation example
./generate_video.sh

# Or generate with a specific example
./generate_video.sh example_morning_routine.json
./generate_video.sh example_never_give_up.json
./generate_video.sh example_focus.json
```

The script will:
- ✅ Submit the video generation request
- ✅ Monitor progress in real-time
- ✅ Display the video URL when complete
- ✅ Show download command

**Option B: Using curl directly**
```bash
curl -X POST "http://127.0.0.1:8080/v1/videos" \
  -H "Content-Type: application/json" \
  -d @example_motivation.json
```

**Option C: Using the Web UI**
```bash
./start_webui.sh
# Visit http://127.0.0.1:8501
```

## 🎨 Customizing Examples

You can edit any JSON file to customize:

### Video Content
- `video_subject`: The main topic/script prompt
- `video_terms`: Search keywords for stock footage (comma-separated)
- `paragraph_number`: Number of script paragraphs (more = longer video)

### Video Format
- `video_aspect`: "16:9" (YouTube), "9:16" (TikTok), "1:1" (Instagram)
- `video_clip_duration`: Seconds per video clip (3-10 recommended)
- `video_concat_mode`: "random" or "sequential"

### Voice Settings
- `voice_name`: "gemini:Zephyr-Female" or "gemini:Zephyr-Male"
- `voice_rate`: Speed (0.5-2.0, default 1.0)
- `voice_volume`: Volume (0.0-1.0)

### Visual Style
- `text_fore_color`: Subtitle text color (hex, e.g., "#FFFFFF")
- `text_background_color`: Background color or "transparent"
- `stroke_color`: Text outline color
- `font_size`: Text size (40-80 recommended)
- `subtitle_position`: "top", "center", or "bottom"

### Audio
- `bgm_type`: Background music style (see below)
- `bgm_volume`: Music volume (0.0-1.0, 0.2-0.4 recommended)

#### Available BGM Types:
- `uplifting` - Energetic and positive
- `inspiring` - Motivational and hopeful
- `emotional` - Deep and touching
- `calm` - Peaceful and relaxing
- `dramatic` - Intense and powerful

## 📦 Example Output

When generation completes, you'll get:
```
🎉 Video generated successfully!
📹 Video URL: http://127.0.0.1:8080/tasks/abc123.../final-1.mp4

💡 Download command:
   wget 'http://127.0.0.1:8080/tasks/abc123.../final-1.mp4' -O my_video.mp4
```

## 🎯 Tips for Best Results

1. **Be Specific**: Use clear, descriptive `video_subject` prompts
2. **Match Terms**: Ensure `video_terms` relate to your topic
3. **Test Durations**: Try different `video_clip_duration` values (3-7 works well)
4. **Aspect Ratio**: Choose based on target platform:
   - YouTube/Website: 16:9
   - TikTok/Reels/Shorts: 9:16
   - Instagram Feed: 1:1
5. **Voice Speed**: 1.0-1.2 is natural for most content
6. **BGM Volume**: Keep 0.2-0.4 so voice is clear

## 🛠️ Troubleshooting

### API Server Not Running
```bash
# Check if server is running
curl http://127.0.0.1:8080/ping

# If not, start it
./start_api.sh
```

### Video Generation Failed
- Check logs in terminal where API is running
- Verify your API keys in `.env` file
- Ensure `video_source` is "pixabay" (not "pexels")
- Try simpler `video_terms` keywords

### Slow Generation
- Reduce `paragraph_number` (fewer paragraphs = shorter video)
- Reduce `video_clip_duration` (shorter clips)
- Use `n_threads: 2` or `n_threads: 4` for parallel processing

## 📚 More Examples

Want to create your own? Copy any example:
```bash
cp example_motivation.json my_custom_video.json
# Edit my_custom_video.json
./generate_video.sh my_custom_video.json
```

## 🌟 Social Media Optimized Examples

- **TikTok/Reels**: Use `example_morning_routine.json` (9:16 vertical)
- **YouTube**: Use `example_motivation.json` (16:9 landscape)
- **Instagram Feed**: Use `example_focus.json` (1:1 square)

Happy video creating! 🚀🎥
