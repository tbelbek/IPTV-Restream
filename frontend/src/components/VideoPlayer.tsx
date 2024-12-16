import React, { useContext, useEffect, useRef } from 'react';
import Hls from 'hls.js';
import { Channel } from '../types';
import { ToastContext } from './notifications/ToastContext';

interface VideoPlayerProps {
  channel: Channel | null;
  syncEnabled: boolean;
}

function VideoPlayer({ channel, syncEnabled }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const { addToast, removeToast } = useContext(ToastContext);

  useEffect(() => {
    if (!videoRef.current || !channel?.url) return;
    const video = videoRef.current;

    if (Hls.isSupported()) {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }

      let toastStartId = null;
      if (channel.restream) {
        toastStartId = addToast({
          type: 'loading',
          title: 'Starting Restream',
          message: 'This may take a few moments...',
          duration: 0,
        });
      }

      const hls = new Hls({
        autoStartLoad: syncEnabled ? false : true,
        liveDurationInfinity: true,
        manifestLoadPolicy: {
          default: {
            maxTimeToFirstByteMs: Infinity,
            maxLoadTimeMs: 20000,
            timeoutRetry: {
              maxNumRetry: 3,
              retryDelayMs: 0,
              maxRetryDelayMs: 0,
            },
            errorRetry: {
              maxNumRetry: 12,
              retryDelayMs: 1000,
              maxRetryDelayMs: 8000,
              backoff: 'linear',
              shouldRetry: (
                retryConfig,
                retryCount,
                _isTimeout,
                _loaderResponse,
              ) => retryCount < retryConfig!.maxNumRetry
            },
          },
        },
      });
      

      hlsRef.current = hls;
      hls.loadSource(
        channel.restream ? 
          //e.g. http://backend:3000/streams/1/1.m3u8
          import.meta.env.VITE_BACKEND_URL + import.meta.env.VITE_BACKEND_STREAMS_PATH + channel.id + "/" + channel.id + ".m3u8" 
          : channel.url
      );
      hls.attachMedia(video);

      if(!syncEnabled) return;

      const tolerance = import.meta.env.VITE_SYNCHRONIZATION_TOLERANCE || 0.8;
      const maxDeviation = import.meta.env.VITE_SYNCHRONIZATION_MAX_DEVIATION || 4;

  
      hls.on(Hls.Events.MANIFEST_PARSED, (_event, _data) => {
        if (channel.restream) {
          const now = new Date().getTime();
      
          const fragments = hls.levels[0]?.details?.fragments;
          const lastFragment = fragments?.[fragments.length - 1];
          if (!lastFragment || !lastFragment.programDateTime) {
            console.warn("No program date time found in fragment. Cannot synchronize.");
            return;
          }
      
          const timeDiff = (now - lastFragment.programDateTime) / 1000;
          const videoLength = fragments.reduce((acc, fragment) => acc + fragment.duration, 0);
          const targetDelay = import.meta.env.VITE_STREAM_DELAY;
      
          //Load stream if it is close to the target delay
          const timeTolerance = tolerance + 1;
      
          if (videoLength + timeDiff + timeTolerance >= targetDelay) {
            hls.startLoad();
            video.play();
            console.log("Starting stream");
            if (toastStartId) {
              removeToast(toastStartId);
            }
          } else {
            console.log("Waiting for stream to load: ", videoLength + timeDiff + timeTolerance, " < ", targetDelay);
      
            // Reload manifest
            setTimeout(() => {
              hls.loadSource(import.meta.env.VITE_BACKEND_URL + import.meta.env.VITE_BACKEND_STREAMS_PATH + channel.id + "/" + channel.id + ".m3u8");
            }, 1000); 
          }
        } else {
          hls.startLoad();
          video.play();
        }
      });
      
      

      hls.on(Hls.Events.FRAG_LOADED, (_event, data) => {

        const now = new Date().getTime();
        const newFrag = data.frag;

        if(!newFrag.programDateTime) return;
        const timeDiff = (now - newFrag.programDateTime) / 1000;
        const videoDiff = newFrag.end - video.currentTime;
        //console.log("Time Diff: ", timeDiff, "Video Diff: ", videoDiff);
        const delay = timeDiff + videoDiff;
        
        const targetDelay = import.meta.env.VITE_STREAM_DELAY;
        //console.log("Delay: ", delay, "Target Delay: ", targetDelay);

        const deviation = delay - targetDelay;

        if (Math.abs(deviation) > maxDeviation) {
          video.currentTime += deviation;
          video.playbackRate = 1.0;
          console.log("Significant deviation detected. Adjusting current time.");
        } else if (Math.abs(deviation) > tolerance) {
          const adjustmentFactor = import.meta.env.VITE_SYNCHRONIZATION_ADJUSTMENT || 0.06;
          const speedAdjustment = 1 +  Math.sign(deviation) * Math.min(Math.abs(adjustmentFactor * deviation), import.meta.env.VITE_SYNCHRONIZATION_MAX_ADJUSTMENT || 0.16);
          video.playbackRate = speedAdjustment;
        } else {
          video.playbackRate = 1.0;
        }
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {

          if (toastStartId) {
            removeToast(toastStartId);
          }
          
          const is403 = data.response?.code === 403;
          addToast({
            type: 'error',
            title: 'Stream Error',
            message: is403 && !channel.restream
              ? 'Access denied. Try with restream option for this channel.'
              : `The stream is not working. Check the source. ${data.response?.text}`,
            duration: 5000,
          });
          return;
          
        }
      });
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, [channel?.url, channel?.restream, syncEnabled]);

  const handleVideoClick = (event: React.MouseEvent<HTMLVideoElement>) => {
    if (videoRef.current?.muted) {
      event.preventDefault();

      videoRef.current.muted = false;
      videoRef.current.play();
    }
  };

  return (
    <div className="relative bg-gray-800 rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        className="w-full aspect-video bg-black"
        muted
        autoPlay
        playsInline
        controls
        onClick={handleVideoClick}
      />
      <div className="flex items-center p-4 bg-gray-900 text-white">
        <img 
          src={channel?.avatar} 
          alt={`${channel?.name} avatar`} 
          className="w-10 h-10 object-contain mr-3" 
        />
        <span className="font-medium">{channel?.name}</span>
      </div>
    </div>
  );
}

export default VideoPlayer;