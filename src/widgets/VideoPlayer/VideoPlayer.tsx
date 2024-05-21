import React, { useEffect, useRef, useState } from 'react';

interface VideoPlayerProps {
  src: string;
  setVideoViewed: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, setVideoViewed }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasHalfWatched, setHasHalfWatched] = useState(false);

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;

    // Учитываем случаи, когда видео короче 10 секунд
    const shortVideoThreshold = 10;
    const threshold =
      video.duration < shortVideoThreshold ? video.duration * 0.5 : video.duration / 2 + 5;

    if (video.currentTime > threshold && !hasHalfWatched) {
      setVideoViewed();
      setHasHalfWatched(true);
    }
  };

  const handleSeeked = () => {
    const video = videoRef.current;
    if (!video) return;

    // Сброс состояния при перемотке, позволяя повторный учёт просмотра
    if (video.currentTime <= video.duration / 2) {
      setHasHalfWatched(false);
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    video?.addEventListener('timeupdate', handleTimeUpdate);
    video?.addEventListener('seeked', handleSeeked);

    return () => {
      video?.removeEventListener('timeupdate', handleTimeUpdate);
      video?.removeEventListener('seeked', handleSeeked);
    };
  }, [hasHalfWatched, setVideoViewed]);

  // Сброс состояния при смене источника видео
  useEffect(() => {
    setHasHalfWatched(false);
  }, [src]);

  return (
    <>
      <video ref={videoRef} src={src} controls className="rounded-3xl" />
    </>
  );
};

export default VideoPlayer;
