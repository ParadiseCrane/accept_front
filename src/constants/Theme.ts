"use client";
import { ActionIcon, Badge, colorsTuple, createTheme, em } from "@mantine/core";
import actionIconStyles from "@styles/ui/actionIcon.module.css";

export const theme = createTheme({
  autoContrast: true,
  luminanceThreshold: 0.6,
  defaultRadius: "sm",
  primaryColor: "primary",
  focusRing: "auto",
  fontFamily: "Roboto",
  breakpoints: {
    xs: em(480),
    sm: em(768),
    md: em(1280),
    lg: em(1440),
    xl: em(1920),
  },
  fontSizes: {
    xs: "0.7rem",
    sm: "0.9rem",
    md: "1rem",
    lg: "1.1rem",
    xl: "1.3rem",
  },
  headings: {
    fontWeight: "400",
  },
  components: {
    Badge: Badge.extend({
      defaultProps: {
        variant: "outline",
      },
    }),
    ActionIcon: ActionIcon.extend({
      defaultProps: {
        variant: "transparent",
        className: actionIconStyles.button,
      },
    }),
    // Input: Input.extend({
    //   defaultProps: {
    //     size: 'md',
    //   },
    // }),
  },
  colors: {
    primary: [
      "#e1f8ff",
      "#cdecff",
      "#9ed6fc",
      "#6bbff7",
      "#41acf3",
      "#259ff1",
      "#0c99f2",
      "#0085d8",
      "#0076c3",
      "#0066ad",
    ],
    white: colorsTuple("#ffffff"),
    "old-accept": colorsTuple("#87ceeb"),
    future: colorsTuple("#f880fe"),
  },
});
