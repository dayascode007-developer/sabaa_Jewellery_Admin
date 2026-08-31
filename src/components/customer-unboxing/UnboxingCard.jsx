"use client";

import { MdEdit, MdDelete } from "react-icons/md";

export default function UnboxingCard({ unboxing, onEdit, onDelete }) {

  // Extract YouTube video ID from URL
  const getYoutubeId = (url) => {
    const match = url?.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/
    );
    return match ? match[1] : null;
  };

  const youtubeUrl = unboxing.youtubeLink || unboxing.youtube_link;
  const videoId = getYoutubeId(youtubeUrl);

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full">
      {/* YouTube Video Embed */}
      <div className="relative w-full aspect-video bg-gray-900 overflow-hidden">
        {videoId && (
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${videoId}`}
            title={unboxing.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0"
          />
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex-grow flex flex-col">
        {/* Title */}
        <h3 className="font-medium text-gray-900 text-sm line-clamp-2 mb-2">
          {unboxing.title}
        </h3>

        {/* Date */}
        <div className="mb-3">
          <p className="text-xs text-gray-500">
            {unboxing.created_at
              ? new Date(unboxing.created_at).toLocaleDateString()
              : ""}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-auto">
          <button
            onClick={onEdit}
            className="flex-1 flex items-center justify-center gap-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-full text-sm font-medium transition-colors cursor-pointer"
          >
            <MdEdit size={16} /> Edit
          </button>
          <button
            onClick={onDelete}
            className="flex-1 flex items-center justify-center gap-1 bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-full text-sm font-medium transition-colors cursor-pointer"
          >
            <MdDelete size={16} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}
