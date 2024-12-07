import { User } from "lucide-react";
import Image from "next/image";
interface AvatarProps {
  src?: string;
  alt?: string;
  size?: "sm" | "md" | "lg";
}

const Avatar = ({ src, alt = "Avatar", size = "md" }: AvatarProps) => {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  };

  return (
    <div
      className={`relative overflow-hidden rounded-full ${sizeClasses[size]}`}
    >
      <div className="h-full w-full overflow-hidden rounded-full">
        {src ? (
          <Image
            src={src}
            alt={alt}
            width={64}
            height={64}
            className="h-full w-full object-cover"
            onError={(e) => {
              console.error("Image failed to load:", src);
              e.currentTarget.onerror = null;
              e.currentTarget.src = "";
            }}
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-200">
            <User className="h-6 w-6 text-gray-500" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Avatar;
