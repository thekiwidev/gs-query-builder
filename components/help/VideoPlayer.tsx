"use client";

import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize2, X } from "lucide-react";

interface VideoPlayerProps {
  src: string;
  title: string;
  className?: string;
}

export function VideoPlayer({ src, title, className = "" }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const expandedVideoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    const handleError = () => {
      setIsLoading(false);
      setHasError(true);
    };
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener("loadstart", handleLoadStart);
    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("error", handleError);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);

    // Set initial muted state
    video.muted = isMuted;

    return () => {
      video.removeEventListener("loadstart", handleLoadStart);
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("error", handleError);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
    };
  }, [isMuted]);

  // Sync expanded video with main video
  useEffect(() => {
    const mainVideo = videoRef.current;
    const expandedVideo = expandedVideoRef.current;
    if (!mainVideo || !expandedVideo || !isExpanded) return;

    // Sync playback state
    if (isPlaying) {
      expandedVideo.play().catch(() => {});
    } else {
      expandedVideo.pause();
    }

    // Sync muted state
    expandedVideo.muted = isMuted;

    // Sync current time
    expandedVideo.currentTime = mainVideo.currentTime;

    // Sync when main video time updates
    const handleTimeUpdate = () => {
      if (Math.abs(expandedVideo.currentTime - mainVideo.currentTime) > 0.5) {
        expandedVideo.currentTime = mainVideo.currentTime;
      }
    };

    mainVideo.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      mainVideo.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [isExpanded, isPlaying, isMuted]);

  // Sync expanded video playback back to main video
  useEffect(() => {
    const mainVideo = videoRef.current;
    const expandedVideo = expandedVideoRef.current;
    if (!mainVideo || !expandedVideo || !isExpanded) return;

    const handleExpandedPlay = () => {
      if (mainVideo.paused) {
        mainVideo.play().catch(() => {});
      }
    };

    const handleExpandedPause = () => {
      if (!mainVideo.paused) {
        mainVideo.pause();
      }
    };

    const handleExpandedTimeUpdate = () => {
      if (Math.abs(mainVideo.currentTime - expandedVideo.currentTime) > 0.5) {
        mainVideo.currentTime = expandedVideo.currentTime;
      }
    };

    expandedVideo.addEventListener("play", handleExpandedPlay);
    expandedVideo.addEventListener("pause", handleExpandedPause);
    expandedVideo.addEventListener("timeupdate", handleExpandedTimeUpdate);

    return () => {
      expandedVideo.removeEventListener("play", handleExpandedPlay);
      expandedVideo.removeEventListener("pause", handleExpandedPause);
      expandedVideo.removeEventListener("timeupdate", handleExpandedTimeUpdate);
    };
  }, [isExpanded]);

  // Handle escape key to close expanded view
  useEffect(() => {
    if (!isExpanded) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsExpanded(false);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isExpanded]);

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    const expandedVideo = expandedVideoRef.current;
    if (!video) return;

    const newMutedState = !isMuted;
    video.muted = newMutedState;
    if (expandedVideo) {
      expandedVideo.muted = newMutedState;
    }
    setIsMuted(newMutedState);
  };

  const openExpanded = () => {
    setIsExpanded(true);
  };

  const closeExpanded = () => {
    setIsExpanded(false);
  };

  if (hasError) {
    return (
      <div
        className={`bg-red-50 border border-red-200 rounded-lg p-6 text-center ${className}`}
      >
        <p className="text-red-700 font-medium mb-2">Unable to load video</p>
        <p className="text-sm text-red-600">
          The video file could not be loaded. Please check that the file exists
          and try again.
        </p>
      </div>
    );
  }

  return (
    <div className={`relative group ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg z-10">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
            <p className="text-sm text-gray-600">Loading video...</p>
          </div>
        </div>
      )}
      <div
        className="relative w-full rounded-lg shadow-lg overflow-hidden bg-black"
        style={{ aspectRatio: "16/9" }}
      >
        <video
          ref={videoRef}
          src={src}
          className="w-full h-full object-contain"
          aria-label={title}
          preload="metadata"
          onClick={togglePlayPause}
        >
          Your browser does not support the video tag.
        </video>

        {/* Custom Controls Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/70 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              {/* Play/Pause Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlayPause();
                }}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-colors"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 text-white" fill="white" />
                ) : (
                  <Play className="w-5 h-5 text-white" fill="white" />
                )}
              </button>

              {/* Volume Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMute();
                }}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-colors"
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5 text-white" />
                ) : (
                  <Volume2 className="w-5 h-5 text-white" />
                )}
              </button>
            </div>

            {/* Expand Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                openExpanded();
              }}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-colors"
              aria-label="Expand video"
            >
              <Maximize2 className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Center Play Button (shown when paused) */}
        {!isPlaying && !isLoading && (
          <button
            onClick={togglePlayPause}
            className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors z-20"
            aria-label="Play video"
          >
            <div className="w-16 h-16 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-lg transition-colors">
              <Play
                className="w-8 h-8 text-gray-900 ml-1"
                fill="currentColor"
              />
            </div>
          </button>
        )}
      </div>

      {/* Expanded Video Modal */}
      {isExpanded && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={closeExpanded}
        >
          <div
            className="relative w-full h-full max-w-7xl max-h-[90vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeExpanded}
              className="absolute top-4 right-4 z-50 flex items-center justify-center w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-colors"
              aria-label="Close expanded view"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Expanded Video */}
            <div className="relative w-full h-full flex items-center justify-center">
              <video
                ref={expandedVideoRef}
                src={src}
                className="max-w-full max-h-full object-contain"
                aria-label={title}
                onClick={togglePlayPause}
              >
                Your browser does not support the video tag.
              </video>

              {/* Expanded Controls Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 to-transparent p-6">
                <div className="flex items-center justify-center gap-4">
                  {/* Play/Pause Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePlayPause();
                    }}
                    className="flex items-center justify-center w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-colors"
                    aria-label={isPlaying ? "Pause" : "Play"}
                  >
                    {isPlaying ? (
                      <Pause className="w-6 h-6 text-white" fill="white" />
                    ) : (
                      <Play className="w-6 h-6 text-white" fill="white" />
                    )}
                  </button>

                  {/* Volume Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMute();
                    }}
                    className="flex items-center justify-center w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-colors"
                    aria-label={isMuted ? "Unmute" : "Mute"}
                  >
                    {isMuted ? (
                      <VolumeX className="w-6 h-6 text-white" />
                    ) : (
                      <Volume2 className="w-6 h-6 text-white" />
                    )}
                  </button>
                </div>
              </div>

              {/* Center Play Button (shown when paused in expanded view) */}
              {!isPlaying && (
                <button
                  onClick={togglePlayPause}
                  className="absolute inset-0 flex items-center justify-center bg-black/10 hover:bg-black/20 transition-colors z-20"
                  aria-label="Play video"
                >
                  <div className="w-20 h-20 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-lg transition-colors">
                    <Play
                      className="w-10 h-10 text-gray-900 ml-1"
                      fill="currentColor"
                    />
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
