"use client";
import {
  ActionIcon,
  Badge,
  Checkbox,
  colorsTuple,
  createTheme,
  em,
  LoadingOverlay,
  Modal,
  MultiSelect,
  NumberInput,
  Overlay,
  PasswordInput,
  PinInput,
  SegmentedControl,
  Switch,
  Tabs,
  TabsList,
  TabsPanel,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { PIN_LENGTH } from "./TournamentSecurity";
import actionIconStyles from "@styles/ui/actionIcon.module.css";
import inputStyles from "@styles/ui/input.module.css";
import segmentedControlStyles from "@styles/ui/segmentedControl.module.css";
import switchStyles from "@styles/ui/switch.module.css";

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
    Checkbox: Checkbox.extend({
      styles: { input: { cursor: "pointer" } },
    }),
    LoadingOverlay: LoadingOverlay.extend({
      defaultProps: {
        zIndex: 100,
      },
    }),
    Modal: Modal.extend({
      defaultProps: {
        padding: "xl",
      },
    }),
    NumberInput: NumberInput.extend({
      defaultProps: {
        classNames: {
          error: inputStyles.error,
        },
        label: undefined,
      },
    }),
    Overlay: Overlay.extend({
      defaultProps: {
        blur: 1.5,
        color: "#fff",
        opacity: 0.6,
      },
    }),
    PasswordInput: PasswordInput.extend({
      defaultProps: {
        size: "lg",
        label: undefined,
      },
    }),
    PinInput: PinInput.extend({
      defaultProps: {
        length: PIN_LENGTH,
        size: "xl",
      },
    }),
    SegmentedControl: SegmentedControl.extend({
      defaultProps: {
        classNames: {
          root: segmentedControlStyles.root,
          label: segmentedControlStyles.label,
        },
        color: "primary",
      },
    }),
    MultiSelect: MultiSelect.extend({
      defaultProps: {
        clearable: false,
        classNames: {
          error: inputStyles.error,
          input: inputStyles.selectInput,
          root: inputStyles.root,
        },
      },
    }),
    Switch: Switch.extend({
      defaultProps: {
        classNames: {
          input: switchStyles.input,
          root: switchStyles.switchWrapper,
          body: switchStyles.switchBody,
        },
      },
    }),
    Tabs: Tabs.extend({
      styles: {
        root: {
          width: "100%",
          height: "100%",
        },
        tabLabel: { fontSize: "var(--font-size-s)" },
      },
    }),
    TabsList: TabsList.extend({
      defaultProps: {
        grow: true,
      },
    }),
    TabsPanel: TabsPanel.extend({
      defaultProps: {
        pt: "xs",
      },
    }),
    TextInput: TextInput.extend({
      defaultProps: {
        classNames: {
          error: inputStyles.error,
        },
        label: undefined,
      },
    }),
    Tooltip: Tooltip.extend({
      defaultProps: {
        withArrow: true,
        inline: true,
        arrowSize: 7,
        styles: {
          tooltip: {
            backgroundColor: "white",
            color: "black",
            outline: "1px solid var(--dark5)",
          },
          arrow: {
            border: "1px solid var(--dark5)",
          },
        },
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
