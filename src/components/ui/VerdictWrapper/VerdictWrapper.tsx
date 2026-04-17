"use client";
import { IAttemptStatus, IVerdict } from "@custom-types/data/atomic";
import { useLocale } from "@hooks/useLocale";
import { Tip } from "@ui/basics";
import { FC, memo, useMemo } from "react";

import styles from "./verdictWrapper.module.css";

const VerdictWrapper: FC<{
  status?: IAttemptStatus;
  verdict?: IVerdict;
  test?: number;
  full?: boolean;
}> = ({ status, verdict, test, full }) => {
  const { locale } = useLocale();

  // verdict
  const IS_VERDICT_EMPTY = !verdict;
  const IS_ACCEPTED = verdict && verdict.spec === 0;
  const IS_NOT_TESTED = verdict && verdict.spec === 6;

  // status
  const IS_PENDING = status && status.spec === 0;
  const IS_TESTING = status && status.spec === 1;
  // const IS_FINISHED = status && status.spec === 2;
  const IS_BANNED = status && status.spec === 3;
  const IS_NOT_FINISHED = IS_PENDING || IS_TESTING;

  const HAS_NO_DATA = !status && !verdict;

  const getVerdictColor = () => {
    if (IS_NOT_FINISHED || HAS_NO_DATA) {
      return "black";
    }

    if (IS_BANNED) {
      return "var(--accent)";
    }

    if (IS_ACCEPTED) {
      return "var(--positive)";
    }

    if (!IS_ACCEPTED || IS_NOT_TESTED) {
      return "var(--negative)";
    }

    return "black";
  };

  const verdictTestString = test === undefined ? "" : ` #${test + 1}`;

  const getTipFullText = () => {
    if (status && (IS_NOT_TESTED || IS_NOT_FINISHED)) {
      return locale.attempt.statuses[status.spec];
    }

    return `${verdict?.fullText}${verdictTestString}`;
  };

  const getTipShortText = () => {
    if (status && (IS_NOT_TESTED || IS_NOT_FINISHED)) {
      return locale.attempt.statuses[status.spec];
    }

    return `${verdict?.shortText || "-"}${verdictTestString}`;
  };

  return (
    <div
      style={{
        color: getVerdictColor(),
      }}
      className={
        styles.wrapper +
        " " +
        (IS_VERDICT_EMPTY || full ? styles.emptyVerdict : "")
      }
    >
      {full ? (
        <Tip
          label={
            <span style={{ color: getVerdictColor() }}>{getTipFullText()}</span>
          }
          openDelay={200}
          position="bottom"
          disabled={IS_VERDICT_EMPTY}
        >
          {getTipFullText()}
        </Tip>
      ) : (
        <Tip
          label={
            <span style={{ color: getVerdictColor() }}>
              {getTipShortText()}
            </span>
          }
          openDelay={200}
          position="bottom"
          disabled={IS_VERDICT_EMPTY}
        >
          {getTipShortText()}
        </Tip>
      )}
    </div>
  );
};

export default memo(VerdictWrapper);
