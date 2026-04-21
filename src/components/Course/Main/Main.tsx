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

interface Props {
  units: IBaseTreeUnit[];
  courseSpec: string;
  select: (_: IBaseTreeUnit) => void;
  closeNavbar: () => void;
}

const Main: FC<Props> = ({ units, courseSpec, select, closeNavbar }) => {
  const [entity, setEntity] = useState<ICourse | IUnit | ILesson | null>(null);
  const searchParams = useSearchParams();
  const spec = searchParams?.get("item");

  useEffect(() => {
    if (spec && entity?.spec !== spec) {
      sendRequest<any, any>(`course/${spec}`, "GET", undefined, undefined).then(
        (res) => {
          setEntity(res.response as ICourse | IUnit | ILesson);
          closeNavbar();
        },
      );
    }
  }, [spec, entity]);

  if (!entity || !spec || (spec && entity.spec !== spec)) return null;

  return (
    <AppShell.Main classNames={{ main: styles.main }}>
      <div className={styles.content}>
        {"tasks" in entity ? (
          <Lesson lesson={entity} />
        ) : (
          <>
            {entity.kind === "course" && (
              <ImageComponent
                index={0}
                item={entity.image}
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
              <Title order={1} ta={"center"} className={styles.title}>
                {entity.title}
              </Title>
            </Center>
            <TipTapEditor
              key={entity.spec}
              editorMode={false}
              content={entity.description}
            />
            {units.length > 0 && (
              <Contents
                units={units}
                currentUnit={entity}
                courseSpec={courseSpec}
                select={select}
              />
            )}
          </>
        )}
      </div>
    </AppShell.Main>
  );
};

export default memo(Main);
