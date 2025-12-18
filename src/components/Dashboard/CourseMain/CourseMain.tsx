"use client";
import { FC, memo } from "react";
import { Center, Title, Image, Box } from "@mantine/core";
import { TipTapEditor } from "@ui/basics/TipTapEditor/TipTapEditor";
import { ICourse } from "@custom-types/data/ICourse";
import { CourseInviteLink } from "./CourseInviteLink/CourseInviteLink";

const CourseMain: FC<{
  course: ICourse;
}> = ({ course }) => {
  return (
    <>
      {course.image.length > 0 && (
        <Image
          src={`/api/image/${course.image}`}
          alt="Picture of the course"
          width={600}
          height={200}
          radius={"md"}
          style={{
            width: "100%",
            height: "auto",
            maxHeight: 200,
            objectFit: "cover",
          }}
        />
      )}
      <Center mt={"md"} mb={"md"}>
        <Title order={1} ta={"center"}>
          {course.title}
        </Title>
      </Center>
      <CourseInviteLink courseSpec={course.spec} />
      <Box ml={"xl"} mr={"xl"}>
        <TipTapEditor
          editorMode={false}
          content={course.description}
          onUpdate={() => {}}
        />
      </Box>
    </>
  );
};

export default memo(CourseMain);
