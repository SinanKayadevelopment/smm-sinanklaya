"use client";

import React from "react";

interface LogoProps {
  className?: string;
  size?: number;
}

export function YouTubeLogo({ className = "", size = 24 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="YouTube"
    >
      <path
        d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z"
        fill="#FF0000"
      />
      <polygon points="9.545,15.568 15.818,12 9.545,8.432" fill="#FFFFFF" />
    </svg>
  );
}

export function TwitchLogo({ className = "", size = 24 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Twitch"
    >
      <rect width="24" height="24" rx="5" fill="#9146FF" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.5 4.5H19.5V14.5L15.5 18.5H12L9.5 21V18.5H4.5V4.5ZM6.2 6.2V16.8H9.5V19.2L11.9 16.8H15L17.8 14V6.2H6.2ZM14.5 8.5H16V13.2H14.5V8.5ZM10.5 8.5H12V13.2H10.5V8.5Z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

export function KickLogo({ className = "", size = 24 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Kick"
    >
      <rect width="24" height="24" rx="5" fill="#0B0E14" />
      <path
        d="M5 4.5h4v6.2l4.6-6.2h4.9l-5.8 7.6 6.3 7.4h-5.1l-4.9-6.2v6.2H5V4.5z"
        fill="#53FC18"
      />
    </svg>
  );
}

export function TikTokLogo({ className = "", size = 24 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="TikTok"
    >
      <rect width="24" height="24" rx="5" fill="#010101" />
      {/* Cyan shadow */}
      <path
        d="M17.5 7.2a4.4 4.4 0 0 1-3-1.3v7.3a4.2 4.2 0 1 1-3.6-4.15v2.3a2 2 0 1 0 1.5 1.9V3.5h2.2c.2 1.4 1.3 2.5 2.9 2.7v1z"
        fill="#25F4EE"
        transform="translate(-0.7, -0.5)"
      />
      {/* Red/Magenta shadow */}
      <path
        d="M17.5 7.2a4.4 4.4 0 0 1-3-1.3v7.3a4.2 4.2 0 1 1-3.6-4.15v2.3a2 2 0 1 0 1.5 1.9V3.5h2.2c.2 1.4 1.3 2.5 2.9 2.7v1z"
        fill="#FE2C55"
        transform="translate(0.7, 0.5)"
      />
      {/* White main layer */}
      <path
        d="M17.5 7.2a4.4 4.4 0 0 1-3-1.3v7.3a4.2 4.2 0 1 1-3.6-4.15v2.3a2 2 0 1 0 1.5 1.9V3.5h2.2c.2 1.4 1.3 2.5 2.9 2.7v1z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

export function InstagramLogo({ className = "", size = 24 }: LogoProps) {
  const id = React.useId();
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Instagram"
    >
      <defs>
        <radialGradient id={`ig-radial-${id}`} cx="20%" cy="110%" r="130%">
          <stop offset="0%" stopColor="#FFDD55" />
          <stop offset="15%" stopColor="#FFDD55" />
          <stop offset="50%" stopColor="#FF543E" />
          <stop offset="70%" stopColor="#C837AB" />
          <stop offset="100%" stopColor="#405DE6" />
        </radialGradient>
      </defs>
      <rect width="24" height="24" rx="6" fill={`url(#ig-radial-${id})`} />
      <rect x="5.2" y="5.2" width="13.6" height="13.6" rx="3.8" stroke="#FFFFFF" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="3.4" stroke="#FFFFFF" strokeWidth="1.8" />
      <circle cx="15.8" cy="8.2" r="0.9" fill="#FFFFFF" />
    </svg>
  );
}

export function TwitterXLogo({ className = "", size = 24 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="X (Twitter)"
    >
      <rect width="24" height="24" rx="5" fill="#000000" />
      <path
        d="M16.99 4.5h2.55l-5.57 6.37 6.55 8.63h-5.13l-4.02-5.26-4.6 5.26H4.22l5.96-6.81L3.85 4.5h5.26l3.63 4.8 4.25-4.8zm-.89 13.48h1.41L7.96 5.94H6.44l9.66 12.04z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

export function DiscordLogo({ className = "", size = 24 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Discord"
    >
      <rect width="24" height="24" rx="5" fill="#5865F2" />
      <path
        d="M18.8 6.5A13.8 13.8 0 0 0 15.3 5.4a.2.2 0 0 0-.2.1c-.2.4-.4.8-.5 1.2-1.3-.2-2.6-.2-3.9 0-.2-.4-.4-.8-.6-1.2a.2.2 0 0 0-.2-.1 13.8 13.8 0 0 0-3.5 1.1.2.2 0 0 0-.1.1C4 10.3 3.4 14 3.7 17.6a.2.2 0 0 0 .1.1 14 14 0 0 0 4.2 2.1.2.2 0 0 0 .2-.1c.3-.5.7-.9 1-1.4a.2.2 0 0 0-.1-.3 9.2 9.2 0 0 1-1.3-.6.2.2 0 0 1 0-.3c.1-.1.2-.2.3-.2 2.7 1.2 5.6 1.2 8.3 0 .1.1.2.2.3.2a.2.2 0 0 1 0 .3c-.4.2-.9.4-1.3.6a.2.2 0 0 0-.1.3c.3.5.7.9 1 1.4a.2.2 0 0 0 .2.1 14 14 0 0 0 4.2-2.1.2.2 0 0 0 .1-.1c.4-4.2-.6-7.8-2.6-11a.2.2 0 0 0-.1-.1zM8.5 15.3c-.8 0-1.5-.7-1.5-1.6 0-.9.7-1.6 1.5-1.6.8 0 1.5.7 1.5 1.6 0 .9-.7 1.6-1.5 1.6zm7 0c-.8 0-1.5-.7-1.5-1.6 0-.9.7-1.6 1.5-1.6.8 0 1.5.7 1.5 1.6 0 .9-.7 1.6-1.5 1.6z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

export function TelegramLogo({ className = "", size = 24 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Telegram"
    >
      <circle cx="12" cy="12" r="11" fill="#2AABEE" />
      <path
        d="M5.5 11.8l11.4-4.5c.5-.2 1 .1.8.7l-2 9.3c-.1.6-.5.7-1 .4l-3-2.2-1.4 1.4c-.2.2-.3.3-.6.3l.2-2.9 5.3-4.8c.2-.2 0-.3-.3-.1l-6.6 4.1-2.8-.9c-.6-.2-.6-.6.1-.9z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

export function SpotifyLogo({ className = "", size = 24 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Spotify"
    >
      <circle cx="12" cy="12" r="11" fill="#1ED760" />
      <path
        d="M16.9 16.2c-.2.3-.5.4-.8.2-2.3-1.4-5.2-1.7-8.6-.9-.3.1-.7-.1-.7-.4-.1-.3.1-.7.4-.7 3.7-.8 6.9-.5 9.5 1.1.3.2.4.5.2.7zm1.3-2.8c-.3.4-.8.5-1.2.3-2.6-1.6-6.6-2.1-9.7-1.1-.4.1-.9-.1-1-.5-.1-.4.1-.9.5-1 3.5-1.1 7.9-.5 11 1.4.4.2.5.7.4.9zm.1-3C15.2 8.5 10.1 8.3 7.1 9.2c-.5.2-1-.1-1.2-.6-.2-.5.1-1 .6-1.2 3.5-1.1 9.1-.8 12.7 1.3.4.3.6.9.3 1.3-.2.4-.7.6-1.2.3z"
        fill="#000000"
      />
    </svg>
  );
}

interface PlatformLogoProps {
  platform?: string | null;
  className?: string;
  size?: number;
}

export default function PlatformLogo({
  platform,
  className = "",
  size = 24,
}: PlatformLogoProps) {
  const norm = (platform || "").toLowerCase().trim();

  if (norm.includes("youtube") || norm === "yt") {
    return <YouTubeLogo className={className} size={size} />;
  }

  if (norm.includes("twitch") || norm === "tw") {
    return <TwitchLogo className={className} size={size} />;
  }

  if (norm.includes("kick") || norm === "tv") {
    return <KickLogo className={className} size={size} />;
  }

  if (norm.includes("tiktok") || norm === "tt") {
    return <TikTokLogo className={className} size={size} />;
  }

  if (norm.includes("instagram") || norm === "ig") {
    return <InstagramLogo className={className} size={size} />;
  }

  if (
    norm.includes("twitter") ||
    norm.includes("x") ||
    norm === "twitter-x" ||
    norm === "x-takipci"
  ) {
    return <TwitterXLogo className={className} size={size} />;
  }

  if (norm.includes("discord")) {
    return <DiscordLogo className={className} size={size} />;
  }

  if (norm.includes("telegram")) {
    return <TelegramLogo className={className} size={size} />;
  }

  if (norm.includes("spotify")) {
    return <SpotifyLogo className={className} size={size} />;
  }

  // Fallback: Elegant generic orb
  return (
    <div
      style={{ width: size, height: size }}
      className={`rounded-lg bg-gradient-to-br from-[#7C1CF5] to-[#49028F] flex items-center justify-center text-white font-black text-xs shadow-sm ${className}`}
    >
      {(platform || "S")[0].toUpperCase()}
    </div>
  );
}
