import { describe, expect, it } from "vitest";

import { pickVideoFullscreen, shouldResumeAfterExit } from "./video-fullscreen";

const noop = () => {};

describe("pickVideoFullscreen", () => {
  it("falls back to the overlay without a video element", () => {
    expect(pickVideoFullscreen(null, true)).toBe("overlay");
  });

  it("prefers the webkit video fullscreen when the element supports it", () => {
    const video = {
      webkitSupportsFullscreen: true,
      webkitEnterFullscreen: noop,
      requestFullscreen: noop,
    };
    expect(pickVideoFullscreen(video, true)).toBe("webkit");
  });

  it("ignores webkitEnterFullscreen when the element reports no support yet", () => {
    const video = {
      webkitSupportsFullscreen: false,
      webkitEnterFullscreen: noop,
      requestFullscreen: noop,
    };
    expect(pickVideoFullscreen(video, true)).toBe("standard");
  });

  it("uses the standard API when the document allows it", () => {
    const video = { requestFullscreen: noop };
    expect(pickVideoFullscreen(video, true)).toBe("standard");
  });

  it("falls back to the overlay when the document forbids fullscreen", () => {
    const video = { requestFullscreen: noop };
    expect(pickVideoFullscreen(video, false)).toBe("overlay");
  });

  it("falls back to the overlay when no fullscreen API exists", () => {
    expect(pickVideoFullscreen({}, true)).toBe("overlay");
  });
});

describe("shouldResumeAfterExit", () => {
  it("resumes when the clip was playing and the platform paused it", () => {
    expect(shouldResumeAfterExit(true, true)).toBe(true);
  });

  it("leaves a clip alone that was already paused before fullscreen", () => {
    expect(shouldResumeAfterExit(false, true)).toBe(false);
  });

  it("does nothing when playback survived the exit", () => {
    expect(shouldResumeAfterExit(true, false)).toBe(false);
  });
});
