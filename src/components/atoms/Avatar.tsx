interface AvatarProps {
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const Avatar = ({ name, size = "md", className = "" }: AvatarProps) => {
  const initials = name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const sizes = {
    sm: "h-8 w-8 text-xs",
    md: "h-12 w-12 text-base",
    lg: "h-16 w-16 text-lg",
  };

  const colors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-teal-500",
  ];

  const colorIndex = name.charCodeAt(0) % colors.length;

  return (
    <div
      className={`flex items-center justify-center rounded-full font-semibold text-white ${sizes[size]} ${colors[colorIndex]} ${className}`}
      aria-label={`Avatar for ${name}`}
    >
      {initials}
    </div>
  );
};
