"use client";
import BanModal from "@components/Attempt/BanModals/BanModal";
import UnbanModal from "@components/Attempt/BanModals/UnbanModal";
import Code from "@components/Attempt/Code/Code";
import Info from "@components/Attempt/Info/Info";
import TextAnswer from "@components/Attempt/TextAnswer/TextAnswer";
import { IAttempt } from "@custom-types/data/IAttempt";
import { IRightsPayload } from "@custom-types/data/rights";
import { setter } from "@custom-types/ui/atomic";
import { useLocale } from "@hooks/useLocale";
import { useRequest } from "@hooks/useRequest";
import { DefaultLayout } from "@layouts/DefaultLayout";
import styles from "@styles/attempt.module.css";
import { IconRefresh } from "@tabler/icons-react";
import { Tabs } from "@ui/basics";
import SingularSticky from "@ui/Sticky/SingularSticky";
import Title from "@ui/Title/Title";
import { fetchWrapperStatic } from "@utils/fetchWrapper";
import { requestWithNotify } from "@utils/requestWithNotify";
import { GetServerSideProps } from "next";
import { ReactNode, useCallback, useMemo } from "react";

function uuidToNumber(uuid: string): number {
  const clean = uuid.replace(/-/g, "");
  const hashInt = parseInt(clean.slice(0, 12), 16);

  return (hashInt % 14) + 3;
}

function Attempt(props: { attempt: IAttempt }) {
  const attempt = props.attempt;

  const { locale, lang } = useLocale();

  const {
    data: canBan,
    loading,
    error,
  } = useRequest<{}, boolean>(`rights`, "POST", {
    entity: "attempt",
    entity_spec: "",
    action: "ban",
  } as IRightsPayload);

  const pages = useMemo(
    () => [
      {
        value: "info",
        title: locale.attempt.pages.info,
        page: (_: string | null, __: setter<string | null>) => (
          <Info attempt={attempt} />
        ),
      },
      {
        value: "code",
        title: locale.attempt.pages.code,
        page: (_: string | null, __: setter<string | null>) => (
          <>
            {attempt.textAnswers.length == 0 ? (
              <Code attempt={attempt} />
            ) : (
              <TextAnswer attempt={attempt} />
            )}
          </>
        ),
      },
    ],
    [attempt, locale],
  );

  const retestAction = useCallback(() => {
    requestWithNotify(
      `/attempt-status/${attempt.spec}`,
      "PUT",
      locale.attempt.retest,
      lang,
      (response: string) => response,
    );
  }, [attempt.spec, lang, locale.attempt]);

  return (
    <div className={styles.wrapper}>
      <Title title={`${locale.titles.attempt} ${attempt.author.login}`} />

      {!loading && !error && canBan && (
        <>
          {attempt.status.spec != 3 ? (
            <BanModal attempt={attempt} />
          ) : (
            <UnbanModal attempt={attempt} />
          )}
          <SingularSticky
            position={{ bottom: 100, right: 20 }}
            icon={<IconRefresh width={32} height={32} />}
            color="yellow"
            onClick={retestAction}
            description={locale.tip.sticky.attempt.retest}
          />
          ,
        </>
      )}

      <Tabs pages={pages} defaultPage={"info"} />
    </div>
  );
}

Attempt.getLayout = (page: ReactNode) => {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export default Attempt;

export const getServerSideProps: GetServerSideProps = async ({
  query,
  req,
}) => {
  if (!query.spec) {
    return {
      notFound: true,
    };
  }
  const response = await fetchWrapperStatic({
    url: `attempt/${query.spec}`,
    req,
  });

  if (response.status === 200) {
    const res: IAttempt = await response.json();
    return {
      props: {
        attempt: {
          ...res,
          // TODO mocked method убрать после привязки бэка
          ai_generated: uuidToNumber(res.spec),
          training: true,
        } as IAttempt,
      },
    };
  }
  if (response.status && response.status !== 404) {
    return {
      redirect: {
        permanent: false,
        destination: `/${response.status}`,
      },
    };
  }
  return {
    notFound: true,
  };
};
