"use client";
import { ICourseAddEdit, IUnitAddEdit } from "@custom-types/data/ICourse";
import { callback } from "@custom-types/ui/atomic";
import { useLocale } from "@hooks/useLocale";
import { Group, Stack } from "@mantine/core";
import { UseFormReturnType, useForm } from "@mantine/form";
import { Button, CustomEditor } from "@ui/basics";
import { CourseTree } from "@ui/CourseTree/CourseTree";
import { FC, memo } from "react";

import styles from "./styles.module.css";

const LessonForm: FC<{}> = () => {
  return <></>;
  // const { locale } = useLocale();
  // const form = useForm<ICourseAddEdit | IUnitAddEdit>({
  //   initialValues: initialValues,
  // });
  // return (
  //   <Stack m={'xl'} className={styles.form}>
  //     <Group grow align="flex-start">
  //       <CourseTree
  //         initialUnits={form.values.children}
  //         form={
  //           form as UseFormReturnType<
  //             ICourseAddEdit,
  //             (values: ICourseAddEdit) => ICourseAddEdit
  //           >
  //         }
  //         depth={depth}
  //       />
  //     </Group>
  //     <CustomEditor
  //       label={locale.course.description}
  //       form={form}
  //       name="description"
  //       editorMinHeight="60px"
  //     />
  //     <Button
  //       onClick={() => {
  //         handleSubmit(form);
  //       }}
  //     >
  //       {editMode ? locale.edit : locale.create}
  //     </Button>
  //   </Stack>
  // );
};

export default memo(LessonForm);
