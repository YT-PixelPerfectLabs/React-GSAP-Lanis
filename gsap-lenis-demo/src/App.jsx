import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";
import "./styles.css";

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  // Lenis + GSAP ticker wiring
  useEffect(() => {
    const lenis = new Lenis({
      duration: 0.95,
      lerp: 0.12,
      smoothWheel: true,
      smoothTouch: true,
      touchMultiplier: 1.05,
      syncTouch: true,
    });

    const onTick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    lenis.on("scroll", ScrollTrigger.update);
    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      gsap.ticker.remove(onTick);
      lenis.destroy();
    };
  }, []);

  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const boxRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const box = boxRef.current;

    // Ensure ST knows about sizes
    ScrollTrigger.refresh();

    // Compute insets so the box rides inside the stage
    const boxSize = 120;
    const inset = 24;

    // place box at top-left initially
    gsap.set(box, {
      x: inset,
      y: inset,
      rotation: 0,
      scale: 1,
    });

    // Square path around the stage edges, with pinning
    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "+=200%",
        scrub: true,
        pin: true,
        anticipatePin: 1,
        markers: true,
        pinSpacing: true,
      },
    });

    // Keyframes around the rectangle: TL -> TR -> BR -> BL -> back to TL
    tl.to(box, {
      x: () => stage.clientWidth - boxSize - inset,
      y: inset,
      rotation: 90,
      duration: 1,
    })
      .to(box, {
        x: () => stage.clientWidth - boxSize - inset,
        y: () => stage.clientHeight - boxSize - inset,
        rotation: 180,
        duration: 1,
      })
      .to(box, {
        x: inset,
        y: () => stage.clientHeight - boxSize - inset,
        rotation: 270,
        duration: 1,
      })
      .to(box, {
        x: inset,
        y: inset,
        rotation: 360,
        duration: 1,
      })
      // add a flourish: scale and color pulse on the last leg
      .to(box, { scale: 1.15, duration: 0.5, ease: "power2.inOut" }, "-=0.6")
      .to(box, { scale: 1, duration: 0.5, ease: "power2.inOut" }, ">-0.1");

    // optional: resize handler to keep path aligned
    const onResize = () => {
      ScrollTrigger.refresh();
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      tl.kill();
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <>
      <section className="section section--intro">
        <h1 className="headline">Scroll down to pin and animate.</h1>
        <p className="subtle">Box will ride the edges while rotating.</p>
      </section>

      <section className="section section--pin" ref={sectionRef}>
        <div className="stage" ref={stageRef}>
          <div className="box" ref={boxRef}>
            BOX
          </div>
        </div>
      </section>
    </>
  );
}
