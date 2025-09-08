"use client";
import { IBarTask } from "@custom-types/data/ITask";
import { ActionIcon } from "@mantine/core";
import { letterFromIndex } from "@utils/letterFromIndex";
import Link from "next/link";
import { FC, memo } from "react";
import { IconHome } from "@tabler/icons-react";

import styles from "./tasksBar.module.css";

const TasksBar: FC<{
  tasks: IBarTask[];
  homeHref: string | null;
  taskQuery: string;
  currentTask: string;
}> = ({ tasks, homeHref, taskQuery, currentTask }) => {
  return (
    <>
      {tasks.length > 0 && (
        <div className={styles.wrapper}>
          {homeHref && (
            <ActionIcon
              className={styles.taskStatus}
              style={{
                backgroundColor: "var(--primary)",
              }}
              component={Link}
              href={homeHref}
            >
              <IconHome color="white" />
            </ActionIcon>
          )}
          {tasks.map((task, index) => (
            <Link
              href={`/task/${task.spec}?${taskQuery}`}
              key={index}
              className={`${styles.taskStatus} ${
                task.status && task.status.spec < 2
                  ? styles.testing
                  : !task.verdict
                    ? styles.null
                    : task.verdict.shortText == "OK"
                      ? styles.ok
                      : styles.err
              } ${currentTask == task.spec ? styles.current : ""}`}
            >
              {letterFromIndex(index)}
            </Link>
          ))}
        </div>
      )}
    </>
  );
};

export default memo(TasksBar);
