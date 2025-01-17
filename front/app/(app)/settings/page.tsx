"use client";

import Text from "@/components/ui/Text";
import axios from "axios";
import { useEffect, useState } from "react";
import { config } from "@/config";

interface Service {
  id: number;
  name: string;
  description: string;
  isSet: boolean;
  oauthNeed: boolean;
}

interface UserData {
  id: string;
  email: string;
  name: string;
}

const getServices = async (userId: string) => {
  const response = await axios.get(`${config.BACKEND_URL}/auth/${userId}`);
  return response;
};

const handleOAuthConnect = (service: string) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const state = user.id;

  let authUrl = "";
  switch (service) {
    case "github":
      authUrl = `https://github.com/login/oauth/authorize?client_id=${config.GITHUB_CLIENT_ID}&redirect_uri=${config.GITHUB_REDIRECT_URI}&scope=read:user user:email&state=${state}`;
      break;
    case "google":
      authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${config.GOOGLE_CLIENT_ID}&redirect_uri=${config.GOOGLE_REDIRECT_URI}&response_type=code&scope=https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://mail.google.com/ https://www.googleapis.com/auth/tasks https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar.events.readonly https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.apps.readonly https://www.googleapis.com/auth/youtube&prompt=select_account&state=${state}`;
      break;
    case "discord":
      authUrl = `https://discord.com/oauth2/authorize?client_id=${config.DISCORD_CLIENT_ID}&redirect_uri=${config.DISCORD_REDIRECT_URI}&response_type=code&scope=identify email&state=${state}`;
      break;
    case "spotify":
      console.log(config)
      authUrl = `https://accounts.spotify.com/authorize?client_id=${config.SPOTIFY_CLIENT_ID}&redirect_uri=${config.SPOTIFY_REDIRECT_URI}&response_type=code&scope=user-library-read playlist-read-private user-top-read user-read-playback-state playlist-modify-private playlist-modify-public&state=${state}`;
      break;
    default:
      break;
  }

  if (authUrl) {
    const width = 600;
    const height = 800;
    const left = window.innerWidth / 2 - width / 2;
    const top = window.innerHeight / 2 - height / 2;

    const popup = window.open(
      authUrl,
      "OAuth",
      `width=${width},height=${height},left=${left},top=${top}`,
    );

    const messageHandler = (event: MessageEvent) => {
      if (event.data.type === `${service.toUpperCase()}_LOGIN_SUCCESS`) {
        window.removeEventListener("message", messageHandler);
        popup?.close();
        window.location.reload();
      }
    };

    window.addEventListener("message", messageHandler);
  }
};

const handleOAuthDisconnect = async (userId: string, serviceId: number) => {
  try {
    await axios.delete(`${config.BACKEND_URL}/auth/service/delete`, {
      data: { userId, serviceId },
    });
    window.location.reload();
  } catch (error) {
    console.error("Error disconnecting service:", error);
  }
};

const handleApiKeySubmit = async (serviceId: number, apiKey: string) => {
  try {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    await axios.post(`${config.BACKEND_URL}/auth/service/apikey`, {
      userId: userData.id,
      serviceId,
      apiKey,
    });
    window.location.reload();
  } catch (error) {
    console.error("Error setting API key:", error);
  }
};

export default function ProfilePage() {
  const [services, setServices] = useState<Service[]>([]);
  const [apiKeys, setApiKeys] = useState<{ [key: number]: string }>({});
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setUserData(user);
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      if (!userData?.id) return;
      try {
        const response = await getServices(userData.id);
        setServices(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchServices();
  }, [userData]);

  if (!userData) {
    return (
      <div className="p-4">
        <Text>Loading...</Text>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      <Text className="mb-6 text-2xl font-bold">Services Configuration</Text>
      {services.map((service) => (
        <div key={service.id} className="rounded-lg bg-gray-100 p-6 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <Text className="text-xl font-semibold">{service.name}</Text>
              <Text className="mt-1 text-gray-600 dark:text-gray-400">
                {service.description}
              </Text>
            </div>
            <div className="flex items-center gap-4">
              <Text
                className={`${service.isSet ? "text-green-500" : "text-red-500"}`}
              >
                {service.isSet ? "Connected" : "Not Connected"}
              </Text>
              {service.isSet ? (
                <button
                  onClick={() => handleOAuthDisconnect(userData.id, service.id)}
                  className="rounded-md bg-red-500 px-4 py-2 text-white transition-colors hover:bg-red-600"
                >
                  Disconnect
                </button>
              ) : service.oauthNeed ? (
                <button
                  onClick={() => handleOAuthConnect(service.name)}
                  className="flex items-center gap-2 rounded-md bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
                >
                  <span>Connect with {service.name}</span>
                </button>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="password"
                    placeholder="Enter API Key"
                    value={apiKeys[service.id] || ""}
                    onChange={(e) =>
                      setApiKeys({
                        ...apiKeys,
                        [service.id]: e.target.value,
                      })
                    }
                    className="rounded-md border px-3 py-2 focus:border-blue-500 focus:outline-none"
                  />
                  <button
                    onClick={() =>
                      handleApiKeySubmit(service.id, apiKeys[service.id] || "")
                    }
                    className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                  >
                    Validate
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
