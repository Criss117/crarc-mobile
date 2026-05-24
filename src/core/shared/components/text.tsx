import { cn } from "heroui-native";
import type { ComponentProps } from "react";
import { Text as RNText } from "react-native";
import { tv, type VariantProps } from "tailwind-variants";

import { type GeistVariants } from "@/integrations/fonts";

export const textVariants = tv({
  base: "font-medium",
  variants: {
    size: {
      h1: "text-5xl font-black",
      h2: "text-4xl font-bold",
      h3: "text-3xl font-bold",
      h4: "text-2xl font-semibold",
      h5: "text-xl font-semibold",
      h6: "text-lg font-semibold",
      p: "text-base",
      muted: "text-sm text-muted",
    },
  },
  defaultVariants: {
    size: "p",
  },
});

interface Props extends ComponentProps<typeof RNText> {
  variants?: VariantProps<typeof textVariants>;
  ignoreVariants?: boolean;
  fontFamily?: GeistVariants;
}

export function Text({
  className,
  variants,
  ignoreVariants = false,
  fontFamily,
  ...props
}: Props) {
  return (
    <RNText
      className={cn(ignoreVariants ? "" : textVariants(variants), className)}
      {...props}
    />
  );
}
