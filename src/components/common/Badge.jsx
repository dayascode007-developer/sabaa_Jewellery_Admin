export default function Badge({ children, variant = "default" }) {
  const variants = {
    default: "bg-purple-100 text-purple-900",
    success: "bg-green-100 text-green-900",
    warning: "bg-yellow-100 text-yellow-900",
    error: "bg-red-100 text-red-900",
    info: "bg-blue-100 text-blue-900",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
}
