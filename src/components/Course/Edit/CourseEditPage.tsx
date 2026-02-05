"use client";
import CourseForm from "@components/Course/Form/CourseForm";
import { Wrapper } from "@components/Course/Wrapper/Wrapper";
import {
  ICourseAddEdit,
  ICourse,
  IBaseTreeUnit,
} from "@custom-types/data/ICourse";
import { useLocale } from "@hooks/useLocale";
import { UseFormReturnType } from "@mantine/form/lib/types";
import { courseFormUtils } from "@utils/courseFormUtils";
import { requestWithNotify } from "@utils/requestWithNotify";
import { useRouter } from "next/navigation";
import { memo, useCallback } from "react";

function CourseEditPage(props: { course: ICourse; depth: number }) {
  const { locale, lang } = useLocale();
  const initialValues = courseFormUtils.getInitialValuesEditCourse({
    title: props.course.title,
    description: props.course.description,
    children: props.course.children ?? [],
    image: props.course.image,
    kind: props.course.kind,
    is_public: props.course.public,
  });

  const router = useRouter();

  const handleSubmit = useCallback(
    (form: UseFormReturnType<typeof initialValues>) => {
      if (
        courseFormUtils.checkCourseImageInvalidInput({
          image: form.values.image,
          locale,
        }) ||
        courseFormUtils.checkCourseTitleInvalidInput({
          title: form.values.title.trim(),
          locale,
        }) ||
        courseFormUtils.checkCourseDescriptionInvalidInput({
          description: form.values.description,
          locale,
        }) ||
        courseFormUtils.checkChildrenInvalidInput({
          children: form.values.children,
          locale,
        }) ||
        courseFormUtils.checkFormValidation({
          value: form.validate().hasErrors,
          locale,
        })
      )
        return;

      const course: ICourseAddEdit = {
        ...form.values,
      };

      const children: IBaseTreeUnit[] = course.children;
      const emptyChildren: IBaseTreeUnit[] = [];
      for (let i = 0; i < children.length; i++) {
        if (children[i].spec.includes("newElement")) {
          emptyChildren.push({ ...children[i], spec: "" });
        } else {
          emptyChildren.push(children[i]);
        }
      }

      const courseToSend: ICourseAddEdit = {
        ...course,
        children: emptyChildren,
        kind: props.course.kind,
      };

      debugger;

      console.log("courseToSend", courseToSend);

      requestWithNotify<ICourseAddEdit, string>(
        `course/put/${props.course.spec}`,
        "PUT",
        locale.notify.course.edit,
        lang,
        (response) => response,
        courseToSend,
      ).then((res) => {
        if (!res.error) {
          router.push("/course/list");
        }
      });
    },
    [lang, locale, router, props],
  );

  return (
    <Wrapper>
      <CourseForm
        handleSubmit={handleSubmit}
        initialValues={initialValues}
        editMode={true}
        {...props}
      />
    </Wrapper>
  );
}

export default memo(CourseEditPage);
