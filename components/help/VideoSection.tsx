"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, Play } from "lucide-react";
import { videoCategories, type VideoCategory, type Video } from "@/lib/videoConfig";
import { VideoPlayer } from "./VideoPlayer";

interface VideoCardProps {
  video: Video;
  onPlay?: () => void;
}

function VideoCard({ video, onPlay }: VideoCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const videoPath = `/videos/${video.filename}`;

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left"
      >
        <div className="flex items-center gap-3 flex-1">
          <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Play className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-gray-900 truncate">
              {video.title}
            </h4>
            {video.description && (
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {video.description}
              </p>
            )}
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-600 flex-shrink-0 ml-2" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-600 flex-shrink-0 ml-2" />
        )}
      </button>
      {isExpanded && (
        <div className="px-4 pb-4">
          <VideoPlayer src={videoPath} title={video.title} />
        </div>
      )}
    </div>
  );
}

interface VideoCategorySectionProps {
  category: VideoCategory;
  categoryIndex: number;
}

function VideoCategorySection({
  category,
  categoryIndex,
}: VideoCategorySectionProps) {
  const [isExpanded, setIsExpanded] = useState(categoryIndex === 0);

  // Don't render categories with no videos
  if (category.videos.length === 0) {
    return null;
  }

  return (
    <div
      id={`video-category-${category.id}`}
      className="scroll-mt-32 border border-gray-200 rounded-lg overflow-hidden bg-gray-50"
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors"
      >
        <div className="text-left">
          <h3 className="text-xl font-bold text-gray-900">{category.name}</h3>
          {category.description && (
            <p className="text-sm text-gray-600 mt-1">{category.description}</p>
          )}
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-600" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-600" />
        )}
      </button>
      {isExpanded && (
        <div className="p-4 space-y-4">
          {category.videos
            .sort((a, b) => a.order - b.order)
            .map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
        </div>
      )}
    </div>
  );
}

export function VideoSection() {
  const categoriesWithVideos = videoCategories.filter(
    (category) => category.videos.length > 0
  );

  if (categoriesWithVideos.length === 0) {
    return null;
  }

  return (
    <section id="video-tutorials" className="scroll-mt-32">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        🎥 Video Tutorials
      </h2>
      <p className="text-gray-700 mb-6">
        Watch step-by-step video guides to master the Query Builder. Click on
        any video to play it inline.
      </p>
      <div className="space-y-6">
        {categoriesWithVideos.map((category, index) => (
          <VideoCategorySection
            key={category.id}
            category={category}
            categoryIndex={index}
          />
        ))}
      </div>
    </section>
  );
}

