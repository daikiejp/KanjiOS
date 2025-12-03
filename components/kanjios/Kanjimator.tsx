"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PlayIcon, PauseIcon } from "lucide-react";

export default function Kanjimator({ kanji }: { kanji: string }) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentStroke, setCurrentStroke] = useState(0);
  const [totalStrokes, setTotalStrokes] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRefs = useRef<SVGPathElement[]>([]);
  const animationRef = useRef<number | null>(null);

  const getKanjiHex = (char: string) => {
    return char.charCodeAt(0).toString(16).padStart(5, "0");
  };

  useEffect(() => {
    const hexCode = getKanjiHex(kanji);
    if (svgRef.current) {
      pathRefs.current = Array.from(
        svgRef.current.querySelectorAll("path"),
      ).filter((p) => p.id.includes(`${hexCode}-s`));
    }
    setTotalStrokes(pathRefs.current.length);
  }, [kanji]);

  useEffect(() => {
    let cancelled = false;
    const loadSvg = async () => {
      try {
        const hexCode = getKanjiHex(kanji);
        const url = `https://raw.githubusercontent.com/KanjiVG/kanjivg/master/kanji/${hexCode}.svg`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const svgText = await res.text();
        if (cancelled || !svgRef.current) return;

        const parser = new DOMParser();
        const doc = parser.parseFromString(svgText, "image/svg+xml");
        const svgEl = doc.documentElement;

        const nums = svgEl.querySelectorAll('[id^="kvg:StrokeNumbers"]');
        nums.forEach((n) => n.remove());

        const paths = svgEl.querySelectorAll("path");
        paths.forEach((p) => {
          p.removeAttribute("stroke");
          p.setAttribute("stroke", "#29ABE2");
        });

        const serializer = new XMLSerializer();
        const inner = Array.from(svgEl.childNodes)
          .map((n) => serializer.serializeToString(n))
          .join("");

        const background = `
        <rect x="5" y="5" width="99" height="99" fill="none" stroke="#CCCCCC" stroke-width="1"/>
        <line x1="5" y1="54.5" x2="104" y2="54.5" stroke="#CCCCCC" stroke-width="1" stroke-dasharray="4 4"/>
        <line x1="54.5" y1="5" x2="54.5" y2="104" stroke="#CCCCCC" stroke-width="1" stroke-dasharray="4 4"/>
      `;

        svgRef.current.innerHTML = background + inner;

        pathRefs.current = Array.from(
          svgRef.current.querySelectorAll("path"),
        ).filter((p) => p.id.includes(`${hexCode}-s`));

        setTotalStrokes(pathRefs.current.length);
      } catch (err) {
        console.error("Error loading/parsing SVG:", err);
      }
    };

    loadSvg();
    return () => {
      cancelled = true;
    };
  }, [kanji]);

  const animateStroke = (index: number) => {
    if (index >= pathRefs.current.length) {
      setIsAnimating(false);
      setCurrentStroke(0);
      return;
    }

    const path = pathRefs.current[index];
    path.style.transition = "stroke-dashoffset 1s ease-in-out";
    path.style.strokeDashoffset = "0";

    setCurrentStroke(index + 1);

    animationRef.current = window.setTimeout(() => {
      animateStroke(index + 1);
    }, 1200);
  };

  const toggleAnimation = () => {
    if (isAnimating) {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
      setIsAnimating(false);
    } else {
      setIsAnimating(true);

      pathRefs.current.forEach((path) => {
        const length = path.getTotalLength();
        path.style.transition = "none";
        path.style.strokeDasharray = length.toString();
        path.style.strokeDashoffset = length.toString();
      });

      setCurrentStroke(0);

      setTimeout(() => {
        animateStroke(0);
      }, 50);
    }
  };

  return (
    <div className="flex flex-col items-center w-32">
      <svg
        ref={svgRef}
        xmlns="http://www.w3.org/2000/svg"
        width="200"
        height="200"
        viewBox="0 0 109 109"
        style={{ maxWidth: "100%", height: "auto" }}
      >
        <rect
          x="5"
          y="5"
          width="99"
          height="99"
          fill="none"
          stroke="#CCCCCC"
          strokeWidth="1"
        />
        <line
          x1="5"
          y1="54.5"
          x2="104"
          y2="54.5"
          stroke="#CCCCCC"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
        <line
          x1="54.5"
          y1="5"
          x2="54.5"
          y2="104"
          stroke="#CCCCCC"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
      </svg>

      <div className="flex justify-between items-center w-32 mt-2">
        <Button
          onClick={toggleAnimation}
          className="bg-[#FF7BAC] hover:bg-[#29ABE2] text-white font-bold h-10 w-10 rounded-full transition-colors duration-300"
        >
          {isAnimating ? (
            <PauseIcon className="h-4 w-4" />
          ) : (
            <PlayIcon className="h-4 w-4" />
          )}
        </Button>
        <span className="text-md">
          {currentStroke} / {totalStrokes}
        </span>
      </div>
    </div>
  );
}
