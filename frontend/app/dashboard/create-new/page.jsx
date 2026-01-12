"use client"
import React, { useContext, useEffect, useState } from 'react'
import SelectTopic from './_components/SelectTopic'
import SelectStyle from './_components/SelectStyle'
import SelectVideoAspect from './_components/SelectVideoAspect'
import SelectVoice from './_components/SelectVoice'
import SelectVideoSource from './_components/SelectVideoSource'
import {Outfit} from 'next/font/google'
import SelectDuration from './_components/SelectDuration'
import { Button } from '@/components/ui/button'
import axios from 'axios'
import CustomLoading from './_components/Loading'
import {v4 as uuidv4} from 'uuid'
import { VideoDataContext } from '@/app/_context/VideoDataContext'
import PlayerDialog from '../_components/PlayerDialog'
import { UserDetailContext } from '@/app/_context/UserDetailContext'
import { toast } from 'sonner'

const outfit = Outfit({subsets: ["latin-ext"],weight: "600"});

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8080";

function CreateNew() {

  const [formData, setFormData] = useState({
    video_subject: '',
    video_aspect: '9:16',
    voice_name: 'en-US-AriaNeural',
    video_source: 'pixabay',
    duration: '30 Seconds',
    imageStyle: 'Use Videos Online'
  });
  const [loading,setLoading]=useState(false);
  const [videoScript,setVideoScript]=useState();
  const [audioFileUrl,setAudioFileUrl]=useState();
  const [caption,setCaption]=useState();
  const [imageList,setImageList]=useState();
  const {videoData,setVideoData} = useContext(VideoDataContext);
  const [playVideo,setPlayVideo]=useState();
  const [videoid,setVideoid]=useState();
  const {userDetail,setUserDetail}=useContext(UserDetailContext);



  const onHandleChange=(fieldName,fieldValue)=>{
    setFormData(
      prev=>({
        ...prev,
        [fieldName]:fieldValue
      })
    )
  }

  const onCreateClickHandler=()=>{
    if (!userDetail?.credits || userDetail?.credits <= 0)
    {
      toast('You do not have enough credits to create a video.');
      return;
    }
    
    if (!formData.video_subject || formData.video_subject.trim() === '') {
      toast('Please enter a video topic or select a content type.');
      return;
    }
    
    // Check if style is Use Videos Online (currently available)
    if (formData.imageStyle && formData.imageStyle !== 'Use Videos Online') {
      toast.error('Only "Use Videos Online" style is available now. Other styles coming soon!');
      return;
    }
    
    GenerateVideoWithAPI();
  }

  const GenerateVideoWithAPI = async () => {
    setLoading(true);
    
    try {
      // Prepare the API payload
      const videoParams = {
        video_subject: formData.topic || formData.video_subject,
        video_aspect: formData.video_aspect || '9:16',
        voice_name: formData.voice_name || 'en-US-AriaNeural',
        video_source: formData.video_source || 'pixabay',
        video_language: 'en-US',
        video_clip_duration: getDurationInSeconds(formData.duration),
        video_count: 1,
        subtitle_enabled: true,
        subtitle_position: 'bottom',
        font_size: 60,
        text_fore_color: '#FFFFFF',
        stroke_color: '#000000',
        stroke_width: 1.5,
        bgm_type: 'random',
        bgm_volume: 0.2,
        voice_volume: 1.0,
        voice_rate: 1.0
      };
      
      // Add custom script if provided
      if (formData.video_script) {
        videoParams.video_script = formData.video_script;
      }

      console.log('Sending request to API:', videoParams);

      // Call the Aeterna API
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/videos`,
        videoParams,
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 300000 // 5 minutes timeout
        }
      );

      console.log('API Response:', response.data);

      // Extract task_id from the response (API returns {status, data: {task_id, ...}})
      const taskId = response.data.data?.task_id || response.data.task_id;
      
      if (!taskId) {
        throw new Error('No task ID received from API');
      }
      
      toast('Video generation started! Task ID: ' + taskId);

      // Poll for task completion
      await pollTaskStatus(taskId);

    } catch (error) {
      console.error('Error generating video:', error);
      toast.error('Failed to generate video: ' + (error.response?.data?.message || error.message));
      setLoading(false);
    }
  };

  const getDurationInSeconds = (durationText) => {
    // Convert "30 Seconds" -> 30
    const match = durationText?.match(/(\d+)/);
    return match ? parseInt(match[1]) : 30;
  };

  const pollTaskStatus = async (taskId) => {
    const maxRetries = 120; // 10 minutes with 5 second intervals
    let retryCount = 0;

    const pollInterval = setInterval(async () => {
      try {
        const statusResponse = await axios.get(
          `${API_BASE_URL}/api/v1/tasks/${taskId}`
        );

        // API returns {status, data: {state, videos, ...}}
        const responseData = statusResponse.data.data || statusResponse.data;
        const taskStatus = responseData.state;

        console.log('Task status:', taskStatus, 'Full response:', responseData);

        if (taskStatus === 'complete') {
          clearInterval(pollInterval);
          
          // Save video data
          const videoId = uuidv4();
          const savedVideo = {
            id: videoId,
            taskId: taskId,
            videos: responseData.videos || [],
            createdAt: new Date().toISOString(),
            subject: formData.topic || formData.video_subject
          };

          // Store in localStorage
          const existingVideos = JSON.parse(localStorage.getItem('videos') || '[]');
          existingVideos.push(savedVideo);
          localStorage.setItem('videos', JSON.stringify(existingVideos));

          // Update credits
          UpdateUserCredits();
          
          setVideoid(videoId);
          setPlayVideo(true);
          setLoading(false);
          
          toast.success('Video generated successfully!');
          
        } else if (taskStatus === 'error' || taskStatus === 'failed') {
          clearInterval(pollInterval);
          const errorMsg = responseData.message || responseData.error || 'Unknown error';
          toast.error('Video generation failed: ' + errorMsg);
          setLoading(false);
        } else {
          // Still processing
          toast('Processing... Status: ' + taskStatus);
        }

        retryCount++;
        if (retryCount >= maxRetries) {
          clearInterval(pollInterval);
          toast.error('Task timeout - please check status later');
          setLoading(false);
        }
        
      } catch (error) {
        console.error('Error polling task status:', error);
      }
    }, 5000); // Poll every 5 seconds
  };

  const UpdateUserCredits=async()=>{
    // Deduct 10 credits for video generation
    const newCredits = (userDetail?.credits || 100) - 10;
    setUserDetail(prev=>({
      ...prev,
      "credits": newCredits
    }))
    // Store credits in localStorage
    localStorage.setItem('userCredits', newCredits.toString());
  }
  
  return (
    <div className='md:px-20'>
      <h2 className={`text-4xl text-primary text-center ${outfit.className}`}>Create A New Video</h2>

      <div className='mt-7 shadow-md p-10'>
        {/* Select Topic */}
        <SelectTopic onUserSelect={onHandleChange}/>

        {/* Select Style */}
        <SelectStyle onUserSelect={onHandleChange}/>

        {/* Video Aspect Ratio */}
        <SelectVideoAspect onUserSelect={onHandleChange}/>

        {/* Voice Selection */}
        <SelectVoice onUserSelect={onHandleChange}/>

        {/* Video Source */}
        <SelectVideoSource onUserSelect={onHandleChange}/>
        
        {/* Duration */}
        <SelectDuration onUserSelect={onHandleChange}/>

        {/* Create Button */}
        <Button className='mt-10 w-full h-10' onClick={onCreateClickHandler}>
          Generate The Video
        </Button>

      </div>

      <CustomLoading loading={loading}/>
      <PlayerDialog playVideo={playVideo} videoid={videoid}/>
    </div>
  )
}

export default CreateNew