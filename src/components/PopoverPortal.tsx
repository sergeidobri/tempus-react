import { type ReactNode } from "react";
import { createPortal } from "react-dom";

interface PopoverPortalProps {
  children: ReactNode;
  isOpen: boolean;
}

export const PopoverPortal = ({ children, isOpen }: PopoverPortalProps) => {
  if (!isOpen) return null;

  const portalRoot = document.getElementById("popover-root");
  if (!portalRoot) return null;

  return createPortal(children, portalRoot);
};
