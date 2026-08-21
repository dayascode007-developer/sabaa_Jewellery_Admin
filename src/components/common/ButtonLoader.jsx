"use client";

export default function ButtonLoader({ isLoading = false, children, disabled = false, ...props }) {
  return (
    <button disabled={isLoading || disabled} {...props}>
      {isLoading ? (
        <span className="flex items-center gap-2">
          <span
            className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"
          />
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
}
