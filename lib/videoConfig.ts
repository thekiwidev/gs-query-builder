export interface Video {
  id: string;
  title: string;
  description: string;
  filename: string;
  category: string;
  order: number;
}

export interface VideoCategory {
  id: string;
  name: string;
  description: string;
  videos: Video[];
}

export const videoCategories: VideoCategory[] = [
  {
    id: "search-blocks",
    name: "Search Blocks",
    description: "Learn how to create and manage search blocks",
    videos: [
      {
        id: "searchblocks-intro",
        title: "How to Use Search Blocks",
        description:
          "A comprehensive guide on creating and configuring search blocks in the Query Builder",
        filename: "searchblocks.mp4",
        category: "search-blocks",
        order: 1,
      },
    ],
  },
  {
    id: "journals",
    name: "Journals",
    description: "Tutorials on journal filtering and selection",
    videos: [
      {
        id: "journals-intro",
        title: "How to Use Journal Filters",
        description:
          "A comprehensive guide on filtering and selecting journals by field and rating in the Query Builder",
        filename: "journals.mp4",
        category: "journals",
        order: 1,
      },
    ],
  },
  {
    id: "operators",
    name: "Operators",
    description: "Learn how to use AND, OR, and EXCLUDE operators",
    videos: [
      {
        id: "operators-intro",
        title: "How to Use Operators",
        description:
          "A comprehensive guide on using AND, OR, and Does Not Include operators to combine search blocks",
        filename: "operators.mp4",
        category: "operators",
        order: 1,
      },
    ],
  },
];

// Helper function to get all videos
export function getAllVideos(): Video[] {
  return videoCategories.flatMap((category) => category.videos);
}

// Helper function to get videos by category
export function getVideosByCategory(categoryId: string): Video[] {
  const category = videoCategories.find((cat) => cat.id === categoryId);
  return category?.videos || [];
}

// Helper function to get video by ID
export function getVideoById(videoId: string): Video | undefined {
  return getAllVideos().find((video) => video.id === videoId);
}
