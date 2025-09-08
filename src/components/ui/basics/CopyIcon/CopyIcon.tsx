"use client";
import { MyIconProps } from "@custom-types/ui/basics/icon";
import {
  CopyButton as MantineCopyButton,
  CopyButtonProps as MantineCopyButtonProps,
} from "@mantine/core";
import { FC, memo } from "react";
import { IconCheck, IconCopy } from "@tabler/icons-react";

import Icon from "../Icon/Icon";

interface Props extends Omit<MantineCopyButtonProps, "children"> {
  iconProps?: MyIconProps;
}

const CopyIcon: FC<Props> = ({ iconProps, ...props }) => {
  return (
    <MantineCopyButton {...props}>
      {({ copy, copied }) => (
        <Icon {...iconProps} onClick={copy}>
          {copied ? <IconCheck color="var(--positive)" /> : <IconCopy />}
        </Icon>
      )}
    </MantineCopyButton>
  );
};

export default memo(CopyIcon);
