"use client";
import { useLocale } from "@hooks/useLocale";
import { DefaultLayout } from "@layouts/DefaultLayout";
import { Button } from "@ui/basics";
import { getCookieValue } from "@utils/cookies";
import { fetchWrapperStatic } from "@utils/fetchWrapper";
import { getApiUrl } from "@utils/getServerUrl";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { ReactNode } from "react";
import styles from "@styles/error.module.css";
import Link from "next/link";

interface InvitePageProps {
  success: boolean;
  unauthorized?: boolean;
  entity_type: string;
  entity_spec: string;
}

function InvitePage(props: InvitePageProps) {
  const { locale } = useLocale();
  if (props.unauthorized)
    return (
      <div
        style={{
          paddingTop: "100px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Head>
          <title>{locale.link.invitePage}</title>
        </Head>
        <div className={styles.description}>
          {locale.link.authorizationRequired}
        </div>
        <Link href="/" className={styles.returnReversed}>
          {locale.link.goToMain}
        </Link>
      </div>
    );
  if (!props.success)
    return (
      <div
        style={{
          paddingTop: "100px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Head>
          <title>{locale.link.invitePage}</title>
        </Head>
        <div className={styles.description}>
          {locale.link.alreadyGroupMember}
        </div>
        <Link href="/" className={styles.returnReversed}>
          {locale.link.goToMain}
        </Link>
      </div>
    );
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: "150px",
      }}
    >
      <Head>
        <title>{locale.link.invitePage}</title>
      </Head>
      <div className={styles.description}>{locale.link.groupJoinSuccess}</div>
      <Link
        href={`/course/${props.entity_spec}`}
        className={styles.returnReversed}
      >
        {locale.link.goToCourse}
      </Link>
    </div>
  );
}

InvitePage.getLayout = (page: ReactNode) => {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export default InvitePage;

export const getServerSideProps: GetServerSideProps = async ({
  query,
  req,
}) => {
  if (!query.spec) {
    return {
      notFound: true,
    };
  }
  const spec = query.spec;
  const response = await fetchWrapperStatic({ url: `invite/${spec}`, req });
  switch (response.status) {
    case 200: {
      const response_json = await response.json();
      return {
        props: {
          success: true,
          entity_type: response_json["entity_type"],
          entity_spec: response_json["entity_spec"],
        } as InvitePageProps,
      };
    }
    case 304:
      return {
        props: {
          success: false,
        } as InvitePageProps,
      };
    case 401: {
      return {
        props: {
          unauthorized: true,
        } as InvitePageProps,
      };
    }
    default:
      return {
        notFound: true,
      };
  }
};
