import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';
import { Channel } from '../types';

interface VideoPlayerProps {
  channel: Channel | null;
}

function VideoPlayer({ channel }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  useEffect(() => {
    if (!videoRef.current || !channel?.url) return;
    const video = videoRef.current;

    if (Hls.isSupported()) {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }

      const hls = new Hls({
        autoStartLoad: false,
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
              maxNumRetry: 20,
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

      const tolerance = import.meta.env.VITE_SYNCHRONIZATION_TOLERANCE || 0.8;
      const maxDeviation = import.meta.env.VITE_SYNCHRONIZATION_MAX_DEVIATION || 4;
      
  
      hls.on(Hls.Events.MANIFEST_PARSED, (_event, _data) => {
        
        if(channel.restream) {
          // Wait for the stream to load and play
          const interval = setInterval(() => {
            const now = new Date().getTime();
  
            const fragments = hls.levels[0]?.details?.fragments;
            const lastFragment = fragments?.[fragments.length - 1];
            if (!lastFragment || !lastFragment.programDateTime) {
              console.warn("No program date time found in fragment. Cannot synchronize.");
              return;
            }
      
            const timeDiff = (now - lastFragment.programDateTime) / 1000;
            const videoLength = fragments.reduce((acc, fragment) => {
              return acc + fragment.duration;
            }, 0);
            const targetDelay = import.meta.env.VITE_STREAM_DELAY;
  
            // It takes some time for the stream to load and play. Estimated here: 0.5s
            const timeTolerance = tolerance + 0.5; 
            console.log("Time Diff: ", timeDiff, "Video Length: ", videoLength, "Target Delay: ", targetDelay, "Time Tolerance: ", timeTolerance);
            if (videoLength + timeDiff + timeTolerance >= targetDelay) {
              hls.startLoad();
              video.play();
              clearInterval(interval);
              console.log("Starting stream");
            } else {
              console.log("Waiting for stream to load: ", videoLength + timeDiff + timeTolerance, " < ", targetDelay);
            }
          }, 1000);
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
        console.log("Time Diff: ", timeDiff, "Video Diff: ", videoDiff);
        const delay = timeDiff + videoDiff;
        
        const targetDelay = import.meta.env.VITE_STREAM_DELAY;
        console.log("Delay: ", delay, "Target Delay: ", targetDelay);

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
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, [channel?.url]);

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
    </div>
  );
}

export default VideoPlayer;