import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

const rootElement = document.getElementById("root");

// Cinematic background layer for the Login / Sign Up experience.
// The MP4 is intentionally served from /public so it can be cached independently.
const authVideo = document.createElement("video");
authVideo.className = "auth-background-video";
authVideo.setAttribute("aria-hidden", "true");
authVideo.autoplay = true;
authVideo.muted = true;
authVideo.loop = true;
authVideo.playsInline = true;
authVideo.preload = "metadata";

authVideo.innerHTML = '<source src="/campus-sahayak-bg.mp4" type="video/mp4" />';

document.body.prepend(authVideo);

const authOverlay = document.createElement("div");
authOverlay.className = "auth-background-overlay";
authOverlay.setAttribute("aria-hidden", "true");
document.body.prepend(authOverlay);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
