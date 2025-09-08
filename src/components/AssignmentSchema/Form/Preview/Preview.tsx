"use client";
import Description from "@components/AssignmentSchema/Description/Description";
import { FC, memo } from "react";

const Preview: FC<{ form: any }> = ({ form }) => {
  return (
    <div style={{ zoom: "80%" }}>
      <Description assignment={form.values} preview />
    </div>
  );
};

export default memo(Preview);
