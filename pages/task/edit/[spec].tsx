"use client";
import Form from "@components/Task/Form/Form";
import {
  IHintAlarmType,
  ITaskCheckType,
  ITaskType,
} from "@custom-types/data/atomic";
import { ITaskEdit } from "@custom-types/data/ITask";
import { Item } from "@custom-types/ui/atomic";
import { useLocale } from "@hooks/useLocale";
import { DefaultLayout } from "@layouts/DefaultLayout";
import { UseFormReturnType } from "@mantine/form";
import Title from "@ui/Title/Title";
import { fetchWrapperStatic } from "@utils/fetchWrapper";
import {
  errorNotification,
  newNotification,
} from "@utils/notificationFunctions";
import { requestWithNotify } from "@utils/requestWithNotify";
import { GetServerSideProps } from "next";
import { ReactNode, useCallback, useMemo } from "react";

function EditTask(props: {
  task: ITaskEdit;
  taskTypes: ITaskType[];
  taskCheckTypes: ITaskCheckType[];
  hintAlarmTypes: IHintAlarmType[];
}) {
  const { locale, lang } = useLocale();
  const { task, taskTypes, taskCheckTypes, hintAlarmTypes } = props;

  const formValues = useMemo(
    () => ({
      ...task,
      author: task.author,

      checkType: task.checkType?.spec.toString() || "0",
      checkerCode: task.checker?.sourceCode || "",
      checkerLang: task.checker?.language.toString() || "0",

      hasHint: task.hint ? true : false,
      hintContent: task.hint?.content || "",
      hintAlarmType: task.hint?.alarmType.spec.toString() || "0",
      hintAlarm: task.hint?.alarm || 0,
      shouldRestrictLanguages:
        task.allowedLanguages.length > 0 || task.forbiddenLanguages.length > 0,

      taskType: task.taskType.spec.toString(),

      tags: task.tags.map((tag) => ({
        value: tag.spec,
        label: tag.title,
      })),

      constraintsTime: task.constraints.time,
      constraintsMemory: task.constraints.memory,
      allowedLanguages: task.allowedLanguages.map((lang) => ({
        value: lang.spec.toString(),
        name: lang.name,
      })),
      forbiddenLanguages: task.forbiddenLanguages.map((lang) => ({
        value: lang.spec.toString(),
        name: lang.name,
      })),

      remark: task.remark || "",
    }),
    [task],
  );

  const handleSubmit = useCallback(
    (form: UseFormReturnType<any>) => {
      if (form.validate().hasErrors) {
        const id = newNotification({});
        errorNotification({
          id,
          title: locale.validationError,
          autoClose: 5000,
        });
        return;
      }
      const {
        checkerCode,
        checkerLang,
        hintContent,
        hintAlarmType,
        hintAlarm,
        constraintsMemory,
        constraintsTime,
        allowedLanguages,
        forbiddenLanguages,
        tags,
        ...values
      } = form.values;
      let task: any = {
        ...values,
        checkType: +form.values["checkType"],
        taskType: +form.values["taskType"],
        constraints: {
          time: constraintsTime,
          memory: constraintsMemory,
        },
        allowedLanguages: allowedLanguages.map((lang: Item) => lang.value),
        forbiddenLanguages: forbiddenLanguages.map((lang: Item) => lang.value),
        tags: tags.map((tag: Item) => tag.value),
      };
      if (!form.values.shouldRestrictLanguages) {
        task.allowedLanguages = [];
        task.forbiddenLanguages = [];
      }
      if (form.values["checkType"] === "1") {
        task.checker = {
          sourceCode: checkerCode,
          language: +checkerLang,
        };
      }
      if (form.values["remark"].trim() === "") {
        task.remark = undefined;
      }
      if (form.values["hasHint"]) {
        task.hint = {
          content: hintContent,
          alarmType: +hintAlarmType,
          alarm: hintAlarm,
        };
      }
      requestWithNotify(
        `task/edit`,
        "POST",
        locale.notify.task.edit,
        lang,
        (_response: boolean) => "",
        task,
      );
    },
    [locale.notify.task.edit, locale.validationError, lang],
  );
  return (
    <>
      <Title title={locale.titles.task.edit} />
      <Form
        handleSubmit={handleSubmit}
        initialValues={formValues}
        buttonLabel={locale.form.update}
        taskTypes={taskTypes}
        taskCheckTypes={taskCheckTypes}
        hintAlarmTypes={hintAlarmTypes}
      />
    </>
  );
}

EditTask.getLayout = (page: ReactNode) => {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export default EditTask;

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
}) => {
  if (!query.spec) {
    return {
      notFound: true,
    };
  }

  const response = await fetchWrapperStatic({
    url: `bundle/task-edit/${query.spec}`,
    req,
  });

  if (response.status === 200) {
    const taskBundle = await response.json();
    return {
      props: {
        task: taskBundle.task,
        taskCheckTypes: taskBundle.task_check_types,
        taskTypes: taskBundle.task_types,
        hintAlarmTypes: taskBundle.hint_alarm_types,
      },
    };
  }
  return {
    notFound: true,
  };
};
