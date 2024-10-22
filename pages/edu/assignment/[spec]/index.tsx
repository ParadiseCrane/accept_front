import { ReactNode, useState } from 'react';
import { GetServerSideProps } from 'next';
import { useUser } from '@hooks/useUser';
import { useWidth } from '@hooks/useWidth';
import { DefaultLayout } from '@layouts/DefaultLayout';
import Sticky from '@ui/Sticky/Sticky';
import DeleteModal from '@components/Assignment/DeleteModal/DeleteModal';
import Description from '@components/Assignment/Description/Description';
import { Dashboard, Pencil, Trash } from 'tabler-icons-react';
import { STICKY_SIZES } from '@constants/Sizes';
import {
  IAssignment,
  IAssignmentDisplay,
} from '@custom-types/data/IAssignment';
import ChatSticky from '@ui/ChatSticky/ChatSticky';
import Timer from '@ui/Timer/Timer';
import Title from '@ui/Title/Title';
import { useLocale } from '@hooks/useLocale';
import { IStickyAction } from '@ui/Sticky/Sticky';
import { fetchWrapperStatic } from '@utils/fetchWrapper';

function Assignment(props: { assignment: IAssignment }) {
  const assignment = props.assignment;
  const [activeModal, setActiveModal] = useState(false);
  const { locale } = useLocale();

  const { user, isTeacher } = useUser();
  const { width } = useWidth();

  const actions: IStickyAction[] = [
    {
      color: 'grape',
      icon: (
        <Dashboard
          width={STICKY_SIZES[width] / 3}
          height={STICKY_SIZES[width] / 3}
        />
      ),
      href: `/dashboard/assignment/${assignment.spec}`,
      description: locale.tip.sticky.assignment.dashboard,
    },
    {
      color: 'green',
      icon: (
        <Pencil
          width={STICKY_SIZES[width] / 3}
          height={STICKY_SIZES[width] / 3}
        />
      ),
      href: `/edu/assignment/edit/${assignment.spec}`,
      description: locale.tip.sticky.assignment.edit,
    },
    {
      color: 'red',
      icon: (
        <Trash
          width={STICKY_SIZES[width] / 3}
          height={STICKY_SIZES[width] / 3}
        />
      ),
      onClick: () => setActiveModal(true),
      description: locale.tip.sticky.assignment.delete,
    },
  ];

  return (
    <>
      <Title title={`${locale.titles.assignment.spec} ${assignment.title}`} />
      <DeleteModal
        active={activeModal}
        setActive={setActiveModal}
        assignment={
          {
            ...assignment,
            taskNumber: assignment.tasks.length,
          } as IAssignmentDisplay
        }
      />
      {isTeacher && <Sticky actions={actions} />}
      {user && <ChatSticky spec={assignment.spec} host={user.login} />}
      <Timer url={`assignment/info/${assignment.spec}`} />
      <Description assignment={assignment} />
    </>
  );
}

Assignment.getLayout = (page: ReactNode) => {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export default Assignment;

export const getServerSideProps: GetServerSideProps = async ({
  query,
  req,
}) => {
  if (!query.spec) {
    return {
      redirect: {
        permanent: false,
        destination: '/',
      },
    };
  }
  const response = await fetchWrapperStatic({
    url: `assignment/${query.spec}`,
    req,
  });

  if (response.status === 200) {
    const assignment = await response.json();
    return {
      props: {
        assignment,
      },
    };
  }
  return {
    redirect: {
      permanent: false,
      destination: '/404',
    },
  };
};
