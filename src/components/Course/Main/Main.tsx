"use client";
import {
  IUnit,
  ILesson,
  ICourse,
  IBaseTreeUnit,
} from "@custom-types/data/ICourse";
import { AppShell, Box, Center, Title } from "@mantine/core";
import { sendRequest } from "@requests/request";
import { ImageComponent } from "@ui/ImageSelector/ImageComponent/ImageComponent";
import { FC, memo, useEffect, useState } from "react";
import { TipTapEditor } from "@ui/basics/TipTapEditor/TipTapEditor";
import Lesson from "../Lesson/Lesson";
import { useSearchParams } from "next/navigation";

import styles from "./main.module.css";
import { Contents } from "../Contents/Contents";

// TODO mocked method
const defaultLesson = (lesson: ILesson): ILesson => {
  return {
    ...lesson,
    allowedLanguages: [],
    forbiddenLanguages: [],
  };
};

const Main: FC<{ item: ICourse | IUnit | ILesson }> = ({ item }) => {
  const [entity, setEntity] = useState<ICourse | IUnit | ILesson>(null!);
  const searchParams = useSearchParams();
  const spec = searchParams?.get("item");

  useEffect(() => {
    if (spec && entity?.spec !== spec && item.spec !== spec) {
      sendRequest<any, any>(`course/${spec}`, "GET", undefined, undefined).then(
        (res) => {
          setEntity(
            res.response.kind === "lesson"
              ? defaultLesson(res.response)
              : (res.response as ICourse | IUnit | ILesson),
          );
        },
      );
    }
  }, [spec, entity, item]);

  if (!spec || spec == item.spec) {
    return <Content item={item} />;
  }

  if (!entity || !spec || (spec && entity.spec !== spec)) return null;

  return <Content item={entity} />;
};

const Content: FC<{ item: ICourse | IUnit | ILesson }> = ({ item }) => {
  return (
    <AppShell.Main>
      {"tasks" in item ? (
        <Lesson lesson={item} />
      ) : (
        <>
          {item.kind === "course" && (
            <ImageComponent
              index={0}
              item={item.image}
              active={false}
              animate
              height={240}
              radius="md"
              imageStyle={{
                width: "100%",
                height: "auto",
                maxHeight: 240,
                objectFit: "cover",
              }}
              cover
            />
          )}
          <Center mt={"md"} mb={"md"}>
            <Title order={1} ta={"center"}>
              {item.title}
            </Title>
          </Center>
          <Box ml={"xl"} mr={"xl"}>
            <TipTapEditor
              key={item.spec}
              editorMode={false}
              content={item.description}
              onUpdate={() => {}}
            />
          </Box>
        </>
      )}
    </AppShell.Main>
  );
};

export default memo(Main);
