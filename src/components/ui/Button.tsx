import { type ButtonHTMLAttributes, type ReactNode } from "react";
import type { IconType } from "react-icons";
import { twMerge } from "tailwind-merge";

type rootProps = {
  children: ReactNode;
  className?: string;
};

export function Root({ children, className }: rootProps) {
  return <div className={className}>{children}</div>;
}

const variants = {
  primary:
    "bg-base hover:bg-base-dark text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105 hover:shadow-lg flex items-center gap-2",
  secondary:
    "bg-transparent hover:bg-gray-200 font-medium rounded-lg text-sm text-center inline-flex items-center gap-2 py-1 px-2",
  danger:
    "bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105 hover:shadow-lg flex items-center gap-2",
};

type ButtonComponentProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: keyof typeof variants;
};

export function ButtonComponent({
  children,
  variant = "primary",
  ...props
}: ButtonComponentProps) {
  return (
    <button {...props} className={twMerge(variants[variant], props.className)}>
      {children}
    </button>
  );
}

type IconProps = {
  icon: IconType;
  className?: string;
};

export function Icon({ icon: IconComponent, className }: IconProps) {
  return <IconComponent className={twMerge("h-4 w-4 ", className)} />;
}
