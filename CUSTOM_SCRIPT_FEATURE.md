# Custom Prompt with Title and Script

## ✅ New Feature: Advanced Custom Control

Users can now provide custom title and script when using "Custom Prompt" option!

### 🎨 What Was Added:

**Backend (API):**
1. **`video_title`** field added to `VideoParams` schema
   - Optional field to provide custom video title
   - Defaults to `video_subject` if not provided
   - Saved in `script.json` for reference

**Frontend (Dashboard):**
1. **Enhanced SelectTopic Component** with 3 input fields:
   - **Video Title** (Optional) - Custom title for the video
   - **Video Topic** (Required) - What the video should be about
   - **Custom Script** (Optional) - Write your own script or leave empty for auto-generation

2. **New UI Components Created:**
   - `Input.jsx` - Text input component
   - `Label.jsx` - Form label component

### 📋 How It Works:

#### Option 1: Quick Generation (Preset Topics)
```
User selects: "Motivational"
→ Auto-generates script about motivation
→ Auto-generates video
```

#### Option 2: Custom Topic (AI Script)
```
User selects: "Custom Prompt"
User enters topic: "5 morning habits for productivity"
→ AI generates script from topic
→ Generates video with AI script
```

#### Option 3: Full Custom Control (Your Script)
```
User selects: "Custom Prompt"
User enters title: "My Morning Routine"
User enters topic: "productivity tips"
User enters script: "Wake up at 5am. Exercise for 30 minutes..."
→ Uses YOUR custom script
→ Generates video with your exact words
```

### 🔧 API Request Example:

**Basic (Auto-generate everything):**
```json
{
  "video_subject": "Motivational video about success",
  "video_aspect": "9:16",
  "voice_name": "en-US-AriaNeural"
}
```

**With Custom Title:**
```json
{
  "video_subject": "Success mindset tips",
  "video_title": "10 Habits of Successful People",
  "video_aspect": "9:16",
  "voice_name": "en-US-AriaNeural"
}
```

**With Custom Script:**
```json
{
  "video_subject": "Morning routine",
  "video_title": "My Perfect Morning",
  "video_script": "Every morning I wake up at 5am. First, I drink water. Then I exercise for 30 minutes. This changed my life.",
  "video_aspect": "9:16",
  "voice_name": "en-US-AriaNeural"
}
```

### 📊 UI Layout (Custom Prompt):

```
┌─────────────────────────────────────────┐
│ Content Type: [Custom Prompt ▼]        │
├─────────────────────────────────────────┤
│                                         │
│ Video Title (Optional)                  │
│ ┌─────────────────────────────────────┐ │
│ │ My Amazing Video Title              │ │
│ └─────────────────────────────────────┘ │
│ Add a custom title for your video       │
│                                         │
│ Video Topic * (Required)                │
│ ┌─────────────────────────────────────┐ │
│ │ Create a motivational video about   │ │
│ │ morning routines and productivity   │ │
│ └─────────────────────────────────────┘ │
│ Describe what your video should be about│
│                                         │
│ Custom Script (Optional)                │
│ ┌─────────────────────────────────────┐ │
│ │ Wake up at 5am every morning.       │ │
│ │ Start with a glass of water.        │ │
│ │ Exercise for 30 minutes...          │ │
│ └─────────────────────────────────────┘ │
│ 💡 Leave empty to auto-generate         │
│                                         │
└─────────────────────────────────────────┘
```

### 🎯 Use Cases:

1. **Content Creators**: Write your exact script for brand consistency
2. **Educators**: Create educational videos with precise information
3. **Marketers**: Control messaging for promotional videos
4. **Quick Users**: Let AI do all the work with preset topics

### ✨ Benefits:

✅ **Full Control** - Write your own script word-for-word
✅ **Flexible** - Mix auto-generation with custom elements
✅ **Time-Saving** - Choose between speed (AI) or precision (custom)
✅ **Professional** - Add proper titles to your videos
✅ **Consistent** - Maintain brand voice with custom scripts

### 🔄 Backend Logic:

```python
# 1. Check if user provided custom script
if params.video_script:
    use_custom_script()
else:
    generate_script_from_topic()

# 2. Save title (custom or subject)
title = params.video_title or params.video_subject

# 3. Generate video with script + title
create_video(title, script, params)
```

### 📝 Validation:

- `video_subject`: **Required** (always needed)
- `video_title`: Optional (defaults to subject)
- `video_script`: Optional (AI generates if empty)

### 🚀 Testing:

```bash
# Test with custom script
curl -X POST http://127.0.0.1:8080/api/v1/videos \
  -H "Content-Type: application/json" \
  -d '{
    "video_subject": "Morning routine",
    "video_title": "My Perfect Morning",
    "video_script": "Wake up at 5am. Drink water. Exercise. This changed my life.",
    "video_aspect": "9:16",
    "voice_name": "en-US-AriaNeural"
  }'
```

### 📂 Files Modified:

**Backend:**
- `api/app/models/schema.py` - Added `video_title` field
- `api/app/services/task.py` - Save title in script.json

**Frontend:**
- `frontend/app/dashboard/create-new/_components/SelectTopic.jsx` - Enhanced with 3 inputs
- `frontend/app/dashboard/create-new/page.jsx` - Added title & script to API call
- `frontend/components/ui/input.jsx` - Created Input component
- `frontend/components/ui/label.jsx` - Created Label component

### 💡 Pro Tips:

1. **Keep scripts concise** - 30-60 seconds works best
2. **Natural language** - Write like you speak
3. **Clear structure** - Break into logical segments
4. **Test presets first** - See AI quality before customizing
