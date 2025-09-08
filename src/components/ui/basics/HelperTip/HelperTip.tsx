"use client";
import { MyHelperTipProps } from "@custom-types/ui/basics/helper";
import { Icon, Tip } from "@ui/basics";
import { FC, memo } from "react";
import { IconHelp } from "@tabler/icons-react";

const HelperTip: FC<MyHelperTipProps> = ({
  customIcon,
  iconColor,
  size,
  ...props
}) => {
  return (
    <Tip {...props}>
      <Icon size={size || "xs"}>
        {customIcon || <IconHelp color={iconColor || "var(--dark4)"} />}
      </Icon>
    </Tip>
  );
};

export default memo(HelperTip);
