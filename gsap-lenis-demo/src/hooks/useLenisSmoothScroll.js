import { useEffect, useRef } from "react";
import Lenis from "@studio-freight/lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

export default function useLenisSmoothScroll({
  duration = 0.95,
  lerp = 0.12,
  smoothWheel = true,
  smoothTouch = true,
  touchMultiplier = 1.1,
  syncTouch = true,
} = {}) {
  const lenisRef = useRef(null);
  const tickerRef = useRef(null);

  useEffect(() => {
    if (lenisRef.current) return;

    const lenis = new Lenis({
      duration,
      lerp,
      smoothWheel,
      smoothTouch,
      touchMultiplier,
      syncTouch,
    });
    lenisRef.current = lenis;

    // Drive Lenis from GSAP’s ticker (prevents nested/dupe RAFs)
    const onTick = (time) => lenis.raf(time * 1000);
    tickerRef.current = onTick;
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    // Keep ScrollTrigger in sync with Lenis
    lenis.on("scroll", ScrollTrigger.update);

    // Refresh ScrollTrigger after first frame
    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      if (tickerRef.current) gsap.ticker.remove(tickerRef.current);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [duration, lerp, smoothWheel, smoothTouch, touchMultiplier, syncTouch]);

  return lenisRef;
}
