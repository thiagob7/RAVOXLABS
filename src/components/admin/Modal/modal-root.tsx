"use client";

import React, { useEffect, useRef } from "react";
import { twMerge } from "tailwind-merge";

import { ModalProps } from ".";
import { modalVariant } from "./variant";

interface ModalRootProps extends ModalProps {
  className?: string;
}

export const ModalRoot: React.FC<ModalRootProps> = ({
  isOpen,
  children,
  className,
  onRequestClose,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const pointerStartedOutsideRef = useRef(false);

  const isInteractivePortalLayer = (target: EventTarget | null) => {
    if (!(target instanceof Element)) return false;
    return Boolean(target.closest('[data-modal-interactive-layer="true"]'));
  };

  // trava scroll do body
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  // fecha com ESC
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onRequestClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onRequestClose]);

  return (
    <div
      className={twMerge(
        modalVariant({ variant: isOpen ? "opened" : "closed" }),
        "fixed inset-0 flex items-center justify-center"
      )}
      onPointerDown={(event) => {
        if (isInteractivePortalLayer(event.target)) {
          pointerStartedOutsideRef.current = false;
          return;
        }

        pointerStartedOutsideRef.current =
          event.target instanceof Node
            ? !contentRef.current?.contains(event.target)
            : false;
      }}
      onClick={(event) => {
        if (isInteractivePortalLayer(event.target)) {
          pointerStartedOutsideRef.current = false;
          return;
        }

        const clickedOutside =
          event.target instanceof Node
            ? !contentRef.current?.contains(event.target)
            : false;

        if (pointerStartedOutsideRef.current && clickedOutside) {
          onRequestClose();
        }

        pointerStartedOutsideRef.current = false;
      }}
      role="dialog"
      aria-modal="true"
    >
      <div
        ref={contentRef}
        className={twMerge(
          "flex flex-col border border-gray-700 bg-gray-850 rounded-lg w-[560px] relative max-h-[calc(100vh-32px)] overflow-clip",
          className
        )}
      >
        {isOpen && children}
      </div>
    </div>
  );
};
