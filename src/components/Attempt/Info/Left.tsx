"use client";
import { FC, memo, useEffect, useState } from "react";
import styles from "./styles.module.css";
import { IAttempt } from "@custom-types/data/IAttempt";
import { useLocale } from "@hooks/useLocale";
import { getLocalDate } from "@utils/datetime";
import Link from "next/link";
import { Divider } from "@mantine/core";
import PlagiarismButton from "../PlagiarismButton/PlagiarismButton";

interface Props {
  attempt: IAttempt;
  hint: string;
  hintLoading: boolean;
  opened: boolean;
  toggle: () => void;
  requestAIHint: () => void;
}

const Left: FC<Props> = ({ attempt }) => {
  const { locale } = useLocale();
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  return (
    <div className={styles.left}>
      <div>{isBrowser && getLocalDate(attempt.date)}</div>
      <div>
        {locale.attempt.task}{" "}
        <Link href={`/task/${attempt.task.spec}`} className={styles.link}>
          {attempt.task.title}
        </Link>
      </div>
      <div>
        {locale.attempt.author}{" "}
        <Link href={`/profile/${attempt.author.login}`} className={styles.link}>
          {attempt.author.shortName}
        </Link>
      </div>
      <div>
        {locale.attempt.language}
        {": "}
        <span>{attempt.language.name}</span>
      </div>
      <div>
        {locale.attempt.status}
        {": "}
        <span>
          <b>{locale.attempt.statuses[attempt.status.spec]}</b>
        </span>
      </div>
      {attempt.status.spec == 3 && attempt.banInfo && (
        <div>
          {locale.attempt.banReason}
          {": "}
          <span>{attempt.banInfo.reason}</span>
        </div>
      )}
      <div>
        {locale.attempt.constraints.time}
        {": "}
        <span
          style={{
            fontSize: "var(--font-size-m)",
          }}
        >
          {attempt.constraints?.time || 0}
          {"s"}
        </span>
      </div>
      <div>
        {locale.attempt.constraints.memory}
        {": "}
        <span>
          {attempt.constraints?.memory || 0}
          {"MB"}
        </span>
      </div>
      {/* AI-FEATURE FLAG */}
      {/* {attempt.ai_generated && (
        <>
          <Divider size={"sm"} />
          <div>
            {locale.attempt.aiProbability}
            {": "}
            <span>
              {attempt.ai_generated}
              {"%"}
            </span>
          </div>
          <PlagiarismButton
            attempt={attempt}
            customStyle={styles.smallButton}
          />
        </>
      )} */}
    </div>
  );
};

export const LeftComponent = memo<Props>(Left);
