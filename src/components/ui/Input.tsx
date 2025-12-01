import React, { type InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  errorClassName?: string;
}

export const Input = React.forwardRef<HTMLInputElement, Props>(
  ({ error, className = "", errorClassName = "", ...props }, ref) => (
    <div className="relative">
      <input ref={ref} className={className} {...props} />
      {error && (
        <span
          className={`absolute bottom-[-1.5rem] left-0 text-[#883935] font-normal text-[0.875rem] ${errorClassName ? errorClassName : ""}`}
        >
          {error}
        </span>
      )}
    </div>
  )
);
