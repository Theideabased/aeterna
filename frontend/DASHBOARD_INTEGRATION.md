# Dashboard API Integration

## ✅ What Was Changed

The dashboard has been completely refactored to use your Aeterna FastAPI backend instead of multiple separate API calls.

### New Components Added:

1. **SelectVideoAspect.jsx** - Choose video aspect ratio (9:16, 16:9, 1:1)
2. **SelectVoice.jsx** - Choose AI voice for narration (English voices)
3. **SelectVideoSource.jsx** - Choose video clip source (Pixabay/Pexels)

### Updated Components:

1. **page.jsx (create-new)** - Now calls `/api/v1/videos` endpoint with full parameters
2. **SelectTopic.jsx** - Updated to set both `topic` and `video_subject` fields

### API Integration:

**Old Flow** (Removed):
```
1. Call /api/get-video-script
2. Call /api/generate-audio-file
3. Call /api/generate-caption
4. Call /api/generate-image (multiple times)
```

**New Flow**:
```
1. Call POST /api/v1/videos with VideoParams
2. Poll GET /api/v1/tasks/{task_id} until complete
3. Save video data to localStorage
```

### Parameters Sent to API:

```json
{
  "video_subject": "User's topic",
  "video_aspect": "9:16|16:9|1:1",
  "voice_name": "en-US-AriaNeural",
  "video_source": "pixabay",
  "video_language": "en-US",
  "video_clip_duration": 30,
  "video_count": 1,
  "subtitle_enabled": true,
  "subtitle_position": "bottom",
  "font_size": 60,
  "text_fore_color": "#FFFFFF",
  "stroke_color": "#000000",
  "stroke_width": 1.5,
  "bgm_type": "random",
  "bgm_volume": 0.2,
  "voice_volume": 1.0,
  "voice_rate": 1.0
}
```

## 🚀 How to Use

### 1. Start the API Backend:
```bash
cd api
./start_api.sh
```

### 2. Start the Frontend:
```bash
cd frontend
npm install
npm run dev
```

### 3. Access Dashboard:
- Open: http://localhost:3000/dashboard/create-new
- Fill in the form:
  - **Content**: Choose a topic type or write custom prompt
  - **Video Aspect**: Select 9:16 (TikTok), 16:9 (YouTube), or 1:1 (Instagram)
  - **Voice**: Choose from 7 English voices
  - **Video Source**: Pixabay or Pexels
  - **Duration**: 15, 30, or 60 seconds
- Click "Generate The Video"
- Wait for task completion (polls every 5 seconds)
- Video will be saved to localStorage when complete

## 🔧 Configuration

### Frontend Environment Variables:
Create `/frontend/.env.local`:
```env
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8080
```

### Backend API:
The API should be running at `http://127.0.0.1:8080`

## 📊 Task Polling:

- Polls every 5 seconds
- Max 10 minutes timeout (120 retries)
- Shows status in toast notifications
- Handles errors gracefully

## 💾 Data Storage:

- Videos saved to: `localStorage['videos']`
- Credits stored in: `localStorage['userCredits']`
- Cost per video: 10 credits
- Default credits: 100

## 🎯 API Endpoints Used:

1. `POST /api/v1/videos` - Create video generation task
2. `GET /api/v1/tasks/{task_id}` - Poll task status

## ⚠️ Important Notes:

1. **Make sure API is running** before using dashboard
2. **API must be at http://127.0.0.1:8080** (or update .env.local)
3. **Gemini API key** must be configured in `api/config.toml`
4. **Pixabay API key** must be configured in `api/config.toml`

## 🐛 Troubleshooting:

**Problem**: "Failed to generate video"
- Check if API is running: `curl http://127.0.0.1:8080/ping`
- Check browser console for errors
- Verify API keys in `api/config.toml`

**Problem**: Task timeout
- Video generation can take 5-10 minutes
- Check task status manually: `GET /api/v1/tasks/{task_id}`

**Problem**: No video source found
- Check Pixabay API key is valid
- Try switching to Pexels source
