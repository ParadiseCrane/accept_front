"use client";
import { IAssignmentSchema } from "@custom-types/data/IAssignmentSchema";
import { useLocale } from "@hooks/useLocale";
import { TipTapEditor } from "@ui/basics/TipTapEditor/TipTapEditor";
import PrimitiveTaskTable from "@ui/PrimitiveTaskTable/PrimitiveTaskTable";
import TagList from "@ui/TagList/TagList";
import { FC } from "react";

import styles from "./description.module.css";
import { LoadingOverlay } from "@mantine/core";

const Description: FC<{
  assignment: IAssignmentSchema;
  preview?: boolean;
}> = ({ assignment, preview }) => {
  const { locale } = useLocale();

  const tasks = preview ? [] : assignment.tasks;
  const loading = false;

  return (
    <div className={styles.wrapper}>
      <div className={styles.titleWrapper}>
        <div className={styles.title}>{assignment.title}</div>
        <div className={styles.info}>
          <div
            className={styles.author}
          >{`${locale.assignment.form.author}: ${assignment.author}`}</div>
        </div>
      </div>
      <div className={styles.tags}>
        <TagList tags={assignment.tags} locale={locale} />
      </div>
      <div className={styles.description}>
        <TipTapEditor
          editorMode={false}
          content={assignment.description}
          onUpdate={() => {}}
        />
      </div>
      <div
        style={{
          position: "relative",
          paddingBottom: "var(--spacer-l)",
        }}
      >
        <LoadingOverlay visible={loading} />
        <PrimitiveTaskTable tasks={tasks} linkQuery={``} />
      </div>
    </div>
  );
};

export default Description;
