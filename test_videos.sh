#!/bin/bash

# Test script for Aeterna video generation

echo "======================================"
echo "Aeterna Video Generation Test"
echo "======================================"
echo ""

# Test 1: Check API is running
echo "Test 1: Checking if API is running..."
API_RESPONSE=$(curl -s http://127.0.0.1:8080/api/v1/ping)
if [ $? -eq 0 ]; then
    echo "✅ API is running"
    echo "Response: $API_RESPONSE"
else
    echo "❌ API is not running. Please start it with: cd api && ./start_api.sh"
    exit 1
fi
echo ""

# Test 2: Get all existing videos
echo "Test 2: Fetching all completed videos..."
curl -s http://127.0.0.1:8080/api/v1/tasks | python3 -m json.tool > /tmp/all_videos.json
VIDEO_COUNT=$(cat /tmp/all_videos.json | grep -o '"task_id"' | wc -l)
echo "✅ Found $VIDEO_COUNT completed videos"
echo ""

# Test 3: Show first video details
if [ $VIDEO_COUNT -gt 0 ]; then
    echo "Test 3: Getting details of first video..."
    FIRST_TASK_ID=$(cat /tmp/all_videos.json | grep -o '"task_id": "[^"]*"' | head -1 | cut -d'"' -f4)
    echo "Task ID: $FIRST_TASK_ID"
    echo ""
    echo "Video details:"
    curl -s "http://127.0.0.1:8080/api/v1/tasks/$FIRST_TASK_ID" | python3 -m json.tool
    echo ""
fi

# Test 4: List all video files on disk
echo "Test 4: Listing all video files on disk..."
echo "Final videos:"
find api/storage/tasks -name "final-*.mp4" -type f
echo ""
echo "Combined videos:"
find api/storage/tasks -name "combined-*.mp4" -type f
echo ""

echo "======================================"
echo "Test completed!"
echo "======================================"
echo ""
echo "To view videos in browser:"
echo "1. Make sure frontend is running: cd frontend && npm run dev"
echo "2. Navigate to: http://localhost:3000/dashboard/videos"
echo ""
echo "To download a video directly, use the URL from the API response above"
