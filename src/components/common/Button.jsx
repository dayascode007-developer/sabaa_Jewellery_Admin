"use client";

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) {
  const getVariantStyle = (variant) => {
    switch (variant) {
      case "primary":
        return {
          backgroundColor: "var(--primary)",
          color: "white",
        };
      case "secondary":
        return {
          backgroundColor: "white",
          color: "var(--primary)",
          border: "2px solid var(--primary)",
        };
      case "danger":
        return {
          backgroundColor: "#EF4444",
          color: "white",
        };
      case "ghost":
        return {
          color: "#374151",
        };
      default:
        return {};
    }
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      style={getVariantStyle(variant)}
      className={`rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${sizes[size]} ${className}`}
      onMouseEnter={(e) => {
        if (variant === "primary") {
          e.target.style.backgroundColor = "var(--primary-dark)";
        } else if (variant === "secondary") {
          e.target.style.backgroundColor = "#FFF5F5";
        } else if (variant === "danger") {
          e.target.style.backgroundColor = "#DC2626";
        } else if (variant === "ghost") {
          e.target.style.backgroundColor = "#F3F4F6";
        }
      }}
      onMouseLeave={(e) => {
        if (variant === "primary") {
          e.target.style.backgroundColor = "var(--primary)";
        } else if (variant === "secondary") {
          e.target.style.backgroundColor = "white";
        } else if (variant === "danger") {
          e.target.style.backgroundColor = "#EF4444";
        } else if (variant === "ghost") {
          e.target.style.backgroundColor = "transparent";
        }
      }}
      {...props}
    >
      {children}
    </button>
  );
}
