"use client";
import { IAttemptInfo, IRatingInfo } from "@custom-types/data/IProfileInfo";
import { useLocale } from "@hooks/useLocale";
import { FC, memo, useMemo } from "react";

import styles from "./shortStatistics.module.css";

const ShortStatistics: FC<{
  ratingInfo?: IRatingInfo;
  attemptInfo: IAttemptInfo;
}> = ({ ratingInfo, attemptInfo }) => {
  const { locale } = useLocale();

  const okAttempts = useMemo(
    () =>
      attemptInfo.verdict_distribution.find((item) => item.name === "OK")
        ?.amount || 0,
    [attemptInfo],
  );

  return (
    <div className={styles.wrapper}>
      <div className={styles.attemptInfo}>
        <div>
          {locale.profile.info.shortStatistics.allAttempts}
          {" - "}
          <span className={styles.value}>{attemptInfo.total}</span>
        </div>
        <div className={styles.successfulTotal}>
          {locale.profile.info.shortStatistics.okAttempts}
          {" - "}
          <span className={styles.value}>{okAttempts}</span>
        </div>
      </div>
      {ratingInfo && (
        <div className={styles.ratingInfo}>
          <div>
            {locale.profile.info.shortStatistics.totalScore}
            {" - "}
            <span className={styles.value}>{ratingInfo.score}</span>
          </div>
          <div>
            {locale.profile.info.shortStatistics.ratingPlace}
            {" - "}
            <span className={styles.value}>{ratingInfo.place}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(ShortStatistics);
