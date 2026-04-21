"use client";
import { ILesson } from "@custom-types/data/ICourse";
import { FC, memo } from "react";

import styles from "./styles.module.css";
import { TipTapEditor } from "@ui/basics/TipTapEditor/TipTapEditor";
import { useLocale } from "@hooks/useLocale";
import PrimitiveTaskTable from "@ui/PrimitiveTaskTable/PrimitiveTaskTable";
import { useCourse } from "@hooks/useCourse";
import { Title } from "@mantine/core";

interface Props {
  lesson: ILesson;
}

const Lesson: FC<Props> = ({ lesson }) => {
  const { locale } = useLocale();
  const { course } = useCourse();

  if (!course) return null;

  return (
    <div className={styles.wrapper}>
      <div className={styles.titleWrapper}>
        <Title
          order={1}
          ta={"center"}
          mt={"md"}
          mb={"md"}
          className={styles.title}
        >
          {lesson.title}
        </Title>
      </div>
      <div className={styles.description}>
        <TipTapEditor editorMode={false} content={lesson.description} />
      </div>

      <div className={styles.tasksWrapper}>
        <PrimitiveTaskTable
          tasks={lesson.tasks}
          linkQuery={`course=${course.spec}&lesson=${lesson.spec}`}
          empty={
            <Title order={2} ta={"center"} className={styles.empty}>
              {locale.tournament.emptyTasks}
            </Title>
          }
        />
      </div>
    </div>
  );
};

export default memo(Lesson);
