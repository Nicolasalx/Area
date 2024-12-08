import { Mail, Settings } from "lucide-react";

export const getServiceIcon = (serviceName: string) => {
  switch (serviceName.toLowerCase()) {
    case "google":
      return <Mail className="h-4 w-4 text-gray-500" />;
    default:
      return <Settings className="h-4 w-4 text-gray-500" />;
  }
};

export const getRandomGradient = () => {
  const colors = [
    "from-blue-50",
    "from-green-50",
    "from-purple-50",
    "from-pink-50",
    "from-yellow-50",
    "from-indigo-50",
    "from-red-50",
    "from-teal-50",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};
