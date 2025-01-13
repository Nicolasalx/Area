"use client";

import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import AnimatedBackground from "@/components/three/AnimatedBackground";
import WorkflowVisualization from "@/components/three/WorkflowVisualization";
import { useInView } from "@/hooks/useInView";
import Image from "next/image";
import { DownloadIcon } from "lucide-react";
import { useState } from "react";

const GoogleIcon = () => (
  <svg className="h-full w-full" viewBox="0 0 24 24">
    <path
      fill="currentColor"
      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
    />
  </svg>
);

const GitHubIcon = () => (
  <svg className="h-full w-full" viewBox="0 0 24 24">
    <path
      fill="currentColor"
      d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
    />
  </svg>
);

const DiscordIcon = () => (
  <svg className="h-full w-full" viewBox="0 0 24 24">
    <path
      fill="currentColor"
      d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"
    />
  </svg>
);

const SlackIcon = () => (
  <svg className="h-full w-full" viewBox="0 0 24 24">
    <path
      fill="currentColor"
      d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"
    />
  </svg>
);

const SpotifyIcon = () => (
  <svg className="h-full w-full" viewBox="0 0 24 24">
    <path
      fill="currentColor"
      d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"
    />
  </svg>
);

const services = [
  { name: "Google", icon: <GoogleIcon /> },
  { name: "GitHub", icon: <GitHubIcon /> },
  { name: "Discord", icon: <DiscordIcon /> },
  { name: "Slack", icon: <SlackIcon /> },
  { name: "Spotify", icon: <SpotifyIcon /> },
  { name: "Google", icon: <GoogleIcon /> },
  { name: "GitHub", icon: <GitHubIcon /> },
  { name: "Discord", icon: <DiscordIcon /> },
  { name: "Slack", icon: <SlackIcon /> },
  { name: "Spotify", icon: <SpotifyIcon /> },
];

const features = [
  {
    title: "Easy to Use",
    description:
      " Create easily automations in only some clicks, accessible from any web browser or smartphone.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="h-6 w-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z"
        />
      </svg>
    ),
  },
  {
    title: "Powerful Integrations",
    description:
      "Connect with popular services like Google, GitHub, Discord, and more.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="h-6 w-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 002.25-2.25V6a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 6v2.25A2.25 2.25 0 006 10.5zm0 9.75h2.25A2.25 2.25 0 0010.5 18v-2.25a2.25 2.25 0 00-2.25-2.25H6a2.25 2.25 0 00-2.25 2.25V18A2.25 2.25 0 006 20.25zm9.75-9.75H18a2.25 2.25 0 002.25-2.25V6A2.25 2.25 0 0018 3.75h-2.25A2.25 2.25 0 0013.5 6v2.25a2.25 2.25 0 002.25 2.25z"
        />
      </svg>
    ),
  },
  {
    title: "Real-time Automation",
    description:
      "Your workflows run in real-time, ensuring you never miss an important event.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="h-6 w-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
];

export default function LandingPage() {
  const router = useRouter();
  const { ref: heroRef, isInView: heroInView } = useInView({ threshold: 0.3 });
  const { ref: featuresRef, isInView: featuresInView } = useInView({
    threshold: 0.5,
  });
  const { ref: statsRef, isInView: statsInView } = useInView({
    threshold: 0.5,
  });
  const { ref: servicesRef, isInView: servicesInView } = useInView({
    threshold: 0.5,
  });
  const { ref: ctaRef, isInView: ctaInView } = useInView({ threshold: 0.5 });

  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async () => {
    try {
      setIsLoading(true);

      const response = await fetch("/api/download/android");

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Download failed");
      }

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "area-android.apk";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err: unknown) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative overflow-hidden bg-transparent py-16 text-white sm:py-24"
      >
        <div className="mx-auto mt-16 max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedBackground />
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-24">
            <div
              className={`relative z-10 mx-auto max-w-2xl lg:mx-0 ${
                heroInView ? "animate-fadeInUp" : "opacity-0"
              }`}
            >
              <h1 className="animate-gradient-text select-none pb-1 text-4xl font-bold tracking-tight sm:text-6xl">
                Automate Your Digital World
              </h1>
              <p className="mt-6 text-lg leading-8">
                Connect your favorite services and create powerful automated
                workflows. Save time and boost productivity with our easy-to-use
                automation platform.
              </p>
              <div className="mt-8 flex gap-4">
                <Button
                  className="animate-shine bg-white text-black focus-visible:ring-white"
                  onClick={() => router.push("/auth")}
                >
                  Get Started
                </Button>
                <Button
                  className="bg-white text-black focus-visible:ring-0"
                  onClick={handleDownload}
                  leftIcon={<DownloadIcon />}
                  isLoading={isLoading}
                >
                  Get the Android App
                </Button>
              </div>
            </div>
            <div
              className={`relative lg:mt-0 ${
                heroInView ? "animate-fadeInUp-delay-1" : "opacity-0"
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-black to-transparent lg:bg-none" />
              <div className="animate-float relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-transparent shadow-xl">
                <Image
                  src="/giphy.webp"
                  alt="Leonardo"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        ref={featuresRef}
        className="relative overflow-hidden py-20 sm:py-32"
      >
        <WorkflowVisualization />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div
            className={`mx-auto max-w-2xl text-center ${
              featuresInView ? "animate-fadeInUp" : "opacity-0"
            }`}
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything You Need to Automate
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Create powerful workflows with our extensive collection of
              integrations and features.
            </p>
          </div>
          <div className="mt-24 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className={`hover:animate-pulse-border group rounded-2xl border border-gray-200 bg-white/80 p-8 backdrop-blur-sm transition-all duration-300 hover:border-indigo-500 hover:shadow-lg ${
                  featuresInView
                    ? `animate-fadeInUp${index > 0 ? `-delay-${index}` : ""}`
                    : "opacity-0"
                }`}
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-black text-white transition-transform duration-300 group-hover:scale-110">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="mt-4 text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section
        ref={statsRef}
        className="relative -mt-12 bg-gradient-to-b from-transparent to-gray-50 py-12 pt-0 sm:py-24 sm:pt-0"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-16 lg:mx-0 lg:max-w-none lg:grid-cols-4">
            <div
              className={`flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white/80 p-8 backdrop-blur-sm transition-colors duration-300 hover:border-indigo-500 ${
                statsInView ? "animate-fadeInUp" : "opacity-0"
              }`}
            >
              <div
                className={`text-4xl font-bold text-indigo-600 ${
                  statsInView ? "animate-scaleIn" : "opacity-0"
                }`}
              >
                15+
              </div>
              <div className="mt-2 text-center text-base text-gray-600">
                Integrated Services
              </div>
            </div>
            <div
              className={`flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white/80 p-8 backdrop-blur-sm transition-colors duration-300 hover:border-pink-500 ${
                statsInView ? "animate-fadeInUp-delay-1" : "opacity-0"
              }`}
            >
              <div
                className={`text-4xl font-bold text-pink-600 ${
                  statsInView ? "animate-scaleIn" : "opacity-0"
                }`}
              >
                100+
              </div>
              <div className="mt-2 text-center text-base text-gray-600">
                Available AREAs
              </div>
            </div>
            <div
              className={`flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white/80 p-8 backdrop-blur-sm transition-colors duration-300 hover:border-blue-500 ${
                statsInView ? "animate-fadeInUp-delay-2" : "opacity-0"
              }`}
            >
              <div
                className={`text-4xl font-bold text-indigo-600 ${
                  statsInView ? "animate-scaleIn" : "opacity-0"
                }`}
              >
                30+
              </div>
              <div className="mt-2 text-center text-base text-gray-600">
                Available Reactions
              </div>
            </div>
            <div
              className={`flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white/80 p-8 backdrop-blur-sm transition-colors duration-300 hover:border-pink-500 ${
                statsInView ? "animate-fadeInUp-delay-3" : "opacity-0"
              }`}
            >
              <div
                className={`text-4xl font-bold text-pink-600 ${
                  statsInView ? "animate-scaleIn" : "opacity-0"
                }`}
              >
                25+
              </div>
              <div className="mt-2 text-center text-base text-gray-600">
                Available Actions
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section
        ref={servicesRef}
        className="bg-gray-50 py-8 pt-8 sm:py-16 sm:pt-8"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div
            className={`mx-auto max-w-2xl text-center ${
              servicesInView ? "animate-fadeInUp" : "opacity-0"
            }`}
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Integrate with Your Favorite Services
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Connect and automate across multiple platforms seamlessly.
            </p>
          </div>
          <div
            className={`relative mt-8 overflow-hidden ${
              servicesInView ? "animate-fadeInUp-delay-1" : "opacity-0"
            }`}
          >
            <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-32 bg-gradient-to-r from-gray-50" />
            <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-32 bg-gradient-to-l from-gray-50" />
            <div className="animate-scroll my-4 flex gap-8">
              {services.map((service, index) => (
                <div
                  key={`${service.name}-${index}`}
                  className="group flex min-w-[200px] flex-col items-center justify-center rounded-2xl border border-gray-200 p-6 transition-all duration-300 hover:border-indigo-500 hover:shadow-lg"
                >
                  <div className="mb-4 h-12 w-12 transition-transform duration-300 group-hover:scale-110">
                    {service.icon}
                  </div>
                  <h3 className="text-center text-sm font-medium">
                    {service.name}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        ref={ctaRef}
        className="relative overflow-hidden bg-black py-16 text-white sm:py-32"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div
            className={`mx-auto max-w-2xl text-center ${
              ctaInView ? "animate-fadeInUp" : "opacity-0"
            }`}
          >
            <h2 className="animate-gradient-text text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to Get Started?
            </h2>
            <p className="mt-4 text-lg">
              Join thousands of users who are already automating their work with
              our platform.
            </p>
            <div className="mt-8">
              <Button
                className="animate-shine bg-white text-black focus-visible:ring-white"
                onClick={() => router.push("/auth")}
              >
                Create Your First Workflow
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
