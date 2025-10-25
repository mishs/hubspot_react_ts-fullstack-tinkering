import type { HTMLAttributes, ReactNode } from "react";

interface TextProps extends HTMLAttributes<HTMLElement> {
  as?: "p" | "span" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  size?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl";
  weight?: "normal" | "medium" | "semibold" | "bold";
  color?: "primary" | "secondary" | "muted";
  children: ReactNode;
}

export const Text = ({
  as: Component = "p",
  size = "base",
  weight = "normal",
  color = "primary",
  className = "",
  children,
  ...props
}: TextProps) => {
  const sizes = {
    xs: "text-xs",
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
  };

  const weights = {
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
  };

  const colors = {
    primary: "text-neutral-900",
    secondary: "text-neutral-700",
    muted: "text-neutral-500",
  };

  return (
    <Component
      className={`${sizes[size]} ${weights[weight]} ${colors[color]} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};
