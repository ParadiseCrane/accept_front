"use client";
import { FC } from "react";
import styles from "./styles.module.css";
import { Container } from "@mantine/core";

export const Title: FC<{ title: string }> = ({ title }) => {
  return (
    <div className={styles.wrapper}>
      {/* <Container bd={''}>{title}</Container> */}
      <div className={styles.title}>{title}</div>
    </div>
  );
};
