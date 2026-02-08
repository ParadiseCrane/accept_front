"use client";

import { useLocale } from "@hooks/useLocale";
import { useUser } from "@hooks/useUser";
import CourseList from "@ui/CourseList/CourseList";
import SingularSticky from "@ui/Sticky/SingularSticky";
import { FC } from "react";
import { IconPlus } from "@tabler/icons-react";

interface ClientPageProps {}

const ClientPage: FC<ClientPageProps> = () => {
  const { locale } = useLocale();
  const { isTeacher } = useUser();

  return (
    <>
      <CourseList url={"/course"} />
      {isTeacher && (
        <SingularSticky
          color="var(--positive)"
          href={`/course/add`}
          icon={<IconPlus height={25} width={25} />}
          description={locale.tip.sticky.course.add}
        />
      )}
    </>
  );
};

export default ClientPage;
