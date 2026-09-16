/**
 * Which fullscreen API the gallery pill should use for a clip.
 * webkit: native player on iOS/macOS and the only option inside the
 * Companion apps. standard: requestFullscreen elsewhere. overlay: the
 * card's own CSS overlay, same as images.
 */
export type VideoFullscreenMode = "webkit" | "standard" | "overlay";

export interface FullscreenCapableVideo {
  webkitSupportsFullscreen?: boolean;
  webkitEnterFullscreen?: unknown;
  requestFullscreen?: unknown;
}

export function pickVideoFullscreen(
  video: FullscreenCapableVideo | null | undefined,
  fullscreenEnabled: boolean
): VideoFullscreenMode {
  if (!video) return "overlay";
  if (video.webkitSupportsFullscreen && typeof video.webkitEnterFullscreen === "function") {
    return "webkit";
  }
  if (fullscreenEnabled && typeof video.requestFullscreen === "function") return "standard";
  return "overlay";
}

/** iPhone WebKit pauses the clip when leaving native fullscreen. */
export function shouldResumeAfterExit(wasPlaying: boolean, pausedNow: boolean): boolean {
  return wasPlaying && pausedNow;
}
