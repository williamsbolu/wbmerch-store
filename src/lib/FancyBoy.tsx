"use client";

import React, { useRef, useEffect } from "react";
import { Fancybox as NativeFancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
interface FancyBoxProps {
  delegate?: string;
  options?: any;
  children: React.ReactNode;
}

function FancyBox({ delegate, options, children }: FancyBoxProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;

    if (container) {
      NativeFancybox.bind(container, delegate || "[data-fancybox]", options);
      return () => {
        NativeFancybox.unbind(container);
        NativeFancybox.close();
      };
    }
  }, [delegate, options]);

  return <div ref={containerRef}>{children}</div>;
}

export default FancyBox;
