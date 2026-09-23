"use client";

import { useEffect, type RefObject } from "react";
import { timelineLoaders, type TimelineId } from "./timelines";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

/** A scene plays once this share of it is in view. */
export const PLAY_AT = 0.35;

type PlaybackOptions = {
  /** Wait until the page colour matches this band before playing (dark hero and closing bands). */
  band?: "dark";
  threshold?: number;
};

/**
 * Plays a scene's timeline once over the elements inside `ref`. The DOM
 * already shows the final pose; when the scene nears the viewport its
 * script loads and the tracks are built paused at the opening pose, then
 * they play once it is in view, pause while the tab is hidden, and never
 * replay. Under reduced motion nothing loads, so the final pose stays.
 */
export function useTimelinePlayback(
  ref: RefObject<HTMLElement | null>,
  timelineId: TimelineId,
  { band, threshold = PLAY_AT }: PlaybackOptions = {},
) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const reveal = () => root.removeAttribute("data-scene-pending");
    const motion = window.matchMedia(REDUCED_MOTION);
    if (motion.matches || typeof root.animate !== "function") {
      reveal();
      return;
    }

    const html = document.documentElement;
    let animations: Animation[] = [];
    let isInView = false;
    let hasPlayed = false;

    const bandMatches = () => !band || !html.classList.contains("has-page-theme") || html.dataset.pageTheme === band;

    let isCancelled = false;
    let isLoading = false;

    const build = () => {
      if (animations.length > 0 || isLoading) return;
      isLoading = true;
      timelineLoaders[timelineId]()
        .then((timeline) => {
          if (isCancelled) return;
          animations = timeline.channels.flatMap(({ selector, keyframes }) =>
            Array.from(root.querySelectorAll(selector), (element) => {
              const animation = element.animate(keyframes, { duration: timeline.duration, fill: "backwards" });
              animation.pause();
              return animation;
            }),
          );
          reveal();
          play();
        })
        .catch(reveal);
    };

    const play = () => {
      if (hasPlayed || !isInView || document.hidden || !bandMatches()) return;
      if (animations.length === 0) {
        build();
        return;
      }
      hasPlayed = true;
      animations.forEach((animation) => animation.play());
    };

    const near = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        build();
        near.disconnect();
      },
      { rootMargin: "50% 0px" },
    );

    const view = new IntersectionObserver(
      ([entry]) => {
        isInView = Boolean(entry?.isIntersecting) && entry.intersectionRatio >= threshold - 0.01;
        play();
        if (hasPlayed) view.disconnect();
      },
      { threshold: [0, threshold] },
    );

    const onVisibility = () => {
      if (document.hidden) {
        animations.forEach((animation) => animation.playState === "running" && animation.pause());
        return;
      }
      if (hasPlayed) animations.forEach((animation) => animation.playState === "paused" && animation.play());
      play();
    };

    const onMotionChange = () => {
      if (!motion.matches) return;
      animations.forEach((animation) => animation.finish());
      reveal();
    };

    const theme = band ? new MutationObserver(play) : undefined;
    theme?.observe(html, { attributes: true, attributeFilter: ["class", "data-page-theme"] });

    near.observe(root);
    view.observe(root);
    document.addEventListener("visibilitychange", onVisibility);
    motion.addEventListener("change", onMotionChange);

    return () => {
      isCancelled = true;
      near.disconnect();
      view.disconnect();
      theme?.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      motion.removeEventListener("change", onMotionChange);
      animations.forEach((animation) => animation.cancel());
    };
  }, [ref, timelineId, band, threshold]);
}
