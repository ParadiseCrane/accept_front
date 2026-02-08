"use client";
import { IDropdownContent } from "@custom-types/ui/basics/helper";
import { Switch as MantineSwitch, SwitchProps } from "@mantine/core";
import inputStyles from "@styles/ui/input.module.css";
import { Helper } from "@ui/basics";
import { FC, memo } from "react";

import switchStyles from "@styles/ui/switch.module.css";

interface Props extends SwitchProps {
  helperContent?: IDropdownContent;
  shrink?: boolean;
}

const Switch: FC<Props> = ({ helperContent, shrink, ...props }) => {
  return (
    <div
      className={`${switchStyles.wrapper} ${shrink ? inputStyles.shrink : ""}`}
    >
      <MantineSwitch size={shrink ? "sm" : "md"} {...props} label={undefined} />
      <div className={inputStyles.labelWrapper}>
        <div className={inputStyles.label}>{props.label}</div>
        {helperContent && <Helper dropdownContent={helperContent} />}
      </div>
    </div>
  );
};

export default memo(Switch);
