# Video Generation Testing Guide

## ✅ Fixed Issues

1. **API Task Retrieval Bug** - Fixed `base.get_task_id()` generating random UUIDs instead of using URL parameter
2. **State Persistence** - Added automatic task restoration from disk on API startup
3. **Frontend Display** - Removed complex polling, now redirects to dedicated videos page
4. **PlayerDialog** - Updated to use localStorage and display actual video files

## 🧪 Testing the System

### Quick Test (Existing Videos)

1. **Run the test script:**
   ```bash
   cd /home/user/Documents/aeterna
   ./test_videos.sh
   ```

2. **View videos in browser:**
   - Frontend should be running at: http://localhost:3000
   - Navigate to: **http://localhost:3000/dashboard/videos**
   - You'll see all 4 completed videos ready to watch/download

### Generate New Video Test

1. **Go to Create New page:**
   - Click "Create New" in sidebar
   - Enter any topic (e.g., "Amazing ocean facts")
   - Click "Generate The Video"

2. **What happens:**
   - ✅ Loading spinner appears
   - ✅ Task is submitted to API
   - ✅ Success toast shows task ID
   - ✅ Info toast explains: "Check Videos page in 2-5 minutes"
   - ✅ Auto-redirects to Videos page after 3 seconds
   - ✅ Credits deducted immediately

3. **Check video progress:**
   - Go to Videos page
   - Click "Refresh Videos" button every minute
   - When video completes (state = 1), it appears in the grid

### API Direct Test

Test API endpoints directly:

```bash
# Get all videos
curl http://127.0.0.1:8080/api/v1/tasks | python3 -m json.tool

# Get specific video (use actual task_id from above)
curl http://127.0.0.1:8080/api/v1/tasks/c7ed7fa5-3db9-4bf1-8480-d5664da1f65f | python3 -m json.tool

# Download video directly
curl -o test_video.mp4 "http://127.0.0.1:8080/tasks/c7ed7fa5-3db9-4bf1-8480-d5664da1f65f/final-1.mp4"
```

## 📁 File Structure

### Videos Page Location
`frontend/app/dashboard/videos/page.jsx`

Features:
- Fetches all completed videos from API
- Displays video player for each
- Download buttons for final and combined videos
- Refresh button to check for new videos
- Task ID and progress display

### Navigation
- Added "My Videos" to sidebar (3rd item)
- Icon: Video (from lucide-react)
- Path: `/dashboard/videos`

## 🎬 Video URLs

API returns video URLs like:
```
http://127.0.0.1:8080/tasks/{task_id}/final-1.mp4
http://127.0.0.1:8080/tasks/{task_id}/combined-1.mp4
```

These are served directly by the API and work in:
- Browser video player
- Direct download
- HTML5 `<video>` tag

## 🔄 Workflow Summary

### Old (Broken):
1. Submit → Poll every 5s → Hope dialog shows → Often fails

### New (Working):
1. Submit → Show message → Redirect to Videos page
2. User clicks Refresh when ready
3. Videos appear with player and download

## 📝 Current Videos

You have **4 completed videos** ready to test:
1. `c7ed7fa5` - Scary story (creaking house)
2. `2f3ea717` - Octopus facts
3. `951fa960` - Dark success secrets
4. `975a3718` - Successful people habits

All available at: http://localhost:3000/dashboard/videos

## 🚀 Next Steps

1. Test the Videos page with existing videos
2. Generate a new video and wait 2-5 minutes
3. Refresh Videos page to see new video appear
4. Test download functionality

No more regenerating unnecessarily! 🎉
