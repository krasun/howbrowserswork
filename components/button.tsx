"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ExampleButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    children: ReactNode;
};

export default function Button({
    className,
    type = "button",
    children,
    disabled,
    ...props
}: ExampleButtonProps) {
    return (
        <button
            type={type}
            className={cn(
                "hover:cursor-pointer rounded-md bg-blue-500 px-3 py-1 text-sm font-bold text-white ring-0 disabled:opacity-60 transition-transform duration-150 active:scale-95",
                disabled && "opacity-60",
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
}
