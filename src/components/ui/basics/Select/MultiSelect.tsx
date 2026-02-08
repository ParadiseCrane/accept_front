"use client";
import { IDropdownContent } from "@custom-types/ui/basics/helper";
import {
  MultiSelect as MantineMultiSelect,
  MultiSelectProps,
} from "@mantine/core";
import inputStyles from "@styles/ui/input.module.css";
import { FC, memo, useEffect } from "react";

import InputLabel from "../InputLabel/InputLabel";
import clsx from "clsx";

interface Props extends MultiSelectProps {
  helperContent?: IDropdownContent;
  shrink?: boolean;
  // TODO: remove any
  classNames?: any;
}

const MultiSelect: FC<Props> = ({
  helperContent,
  shrink,
  label,
  required,
  ...props
}) => {
  return (
    <div
      className={`${clsx(inputStyles.wrapper, props.classNames?.wrapper)} ${
        shrink ? inputStyles.shrink : ""
      }`}
    >
      <InputLabel
        label={label}
        helperContent={helperContent}
        required={required}
      />
      <MantineMultiSelect
        size={shrink ? "sm" : "md"}
        {...props}
        placeholder={props.placeholder}
        classNames={{
          ...props.classNames,
          value: props.classNames?.value || inputStyles.selectValue,
        }}
        label={undefined}
      />
    </div>
  );
};

export default memo(MultiSelect);
