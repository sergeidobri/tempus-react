import type { RefObject } from "react";

export const togglePopover = (
  divRef: RefObject<HTMLDivElement | null>,
  isPopoverOpen: boolean,
  setIsPopoverOpen: (value: boolean) => void,
  setPopoverPosition: (value: { top: number; left: number }) => void,
  position: "top" | "bottom" = "bottom"
) => {
  const container = divRef.current;
  if (container) {
    const rect = container.getBoundingClientRect();
    setPopoverPosition({
      top: position == "bottom" ? rect.bottom : rect.top,
      left: rect.left,
    });
  }
  setIsPopoverOpen(!isPopoverOpen);
};
