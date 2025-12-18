"use client";
import { IAttempt } from "@custom-types/data/IAttempt";
import React, { FC, memo, useEffect } from "react";

import styles from "./styles.module.css";
import AIHintMarkdown from "../AIHintCollapse/AIHintMarkdown";
import { useDisclosure } from "@mantine/hooks";
import { LeftComponent } from "./Left";
import { RightComponent } from "./Right";
import { useStream } from "@hooks/useStream";
import AIHintButton from "../AIHintCollapse/AIHintButton";
import { Divider, Grid, GridCol } from "@mantine/core";
import {
  errorNotification,
  newNotification,
} from "@utils/notificationFunctions";

const Info: FC<{ attempt: IAttempt }> = ({ attempt }) => {
  const [opened, { toggle }] = useDisclosure(false);

  const {
    loading,
    streaming,
    data: hint,
    error,
    startStream,
  } = useStream(`attempt-hint/${attempt.spec}`);

  useEffect(() => {
    if (error !== null) {
      const id = newNotification({
        title: "Error",
        message: error,
        autoClose: 5000,
      });
      errorNotification({ id });
    }
  }, [error]);

  return (
    <Grid grow gutter="md" m={"xl"}>
      <GridCol span={2}>
        <LeftComponent
          attempt={attempt}
          requestAIHint={startStream}
          hintLoading={loading || streaming}
          hint={hint}
          opened={opened}
          toggle={toggle}
        />
      </GridCol>
      <Divider orientation="vertical" />
      <GridCol span={4} mx={"xl"}>
        <AIHintButton
          customStyle={styles.smallButton}
          onClick={startStream}
          loading={loading || streaming}
        />
        <AIHintMarkdown key={hint.length} hint={hint} />
      </GridCol>
      <Divider orientation="vertical" />
      <GridCol span="auto" my={"xl"}>
        <RightComponent attempt={attempt} syncScroll={false} />
      </GridCol>
    </Grid>
  );
};

export default memo(Info);
