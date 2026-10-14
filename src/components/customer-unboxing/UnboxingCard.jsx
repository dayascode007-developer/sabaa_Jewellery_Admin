"use client";

import { MdEdit, MdDelete } from "react-icons/md";

export default function UnboxingCard({ unboxing, onEdit, onDelete }) {

  // Extract YouTube video ID from URL
  const getYoutubeId = (url) => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
      /(?:youtube\.com\/shorts\/)([^&\n?#]+)/,
    ];
    for (let pattern of patterns) {
      const match = url?.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const isYouTubeShorts = (url) => {
    return /youtube\.com\/shorts\//.test(url);
  };

  const youtubeUrl = unboxing.youtubeLink || unboxing.youtube_link;
  const videoId = getYoutubeId(youtubeUrl);
  const isShorts = isYouTubeShorts(youtubeUrl);

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full">
      {/* YouTube Video Embed */}
      <div className="relative w-full aspect-video bg-gray-900 overflow-hidden flex items-center justify-center">
        {videoId ? (
          isShorts ? (
            <>
              <a
                href={youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-full h-full flex items-center justify-center"
              >
                {/* Thumbnail */}
                <img
                  src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                  alt={unboxing.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:brightness-110 transition-all"
                />

                {/* Dark overlay */}
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />

                {/* Play button */}
                <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-red-600 group-hover:bg-red-700 transition-colors shadow-lg">
                  <svg viewBox="0 0 24 24" className="ml-0.5 h-6 w-6 fill-white" aria-hidden="true">
                    <path d="M8 5.5v13l11-6.5-11-6.5Z" />
                  </svg>
                </div>
              </a>

              {/* Shorts Badge */}
              <div className="absolute top-2 right-2 bg-red-600 text-white px-2.5 py-1 rounded-full text-xs font-semibold shadow-lg">
                Shorts
              </div>
            </>
          ) : (
            <>
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${videoId}`}
                title={unboxing.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0"
              />
              {/* Regular YouTube Badge */}
              <div className="absolute top-2 right-2 bg-blue-600 text-white px-2.5 py-1 rounded-full text-xs font-semibold shadow-lg">
                Video
              </div>
            </>
          )
        ) : (
          <p className="text-gray-400 text-sm">No video</p>
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
