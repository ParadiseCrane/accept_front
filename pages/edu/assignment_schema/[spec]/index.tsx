import { ReactNode, useState } from 'react';
import { GetServerSideProps } from 'next';
import { IAssignmentSchema } from '@custom-types/data/IAssignmentSchema';
import Description from '@components/AssignmentSchema/Description/Description';
import { DefaultLayout } from '@layouts/DefaultLayout';
import Sticky from '@ui/Sticky/Sticky';
import { Pencil, Trash } from 'tabler-icons-react';
import DeleteModal from '@components/AssignmentSchema/DeleteModal/DeleteModal';
import { useLocale } from '@hooks/useLocale';
import Title from '@ui/Title/Title';
import { fetchWrapperStatic } from '@utils/fetchWrapper';

function AssignmentSchema(props: { assignment: IAssignmentSchema }) {
  const assignment = props.assignment;
  const [openModal, setOpenModal] = useState(false);
  const { locale } = useLocale();

  return (
    <>
      <Title
        title={`${locale.titles.assignment_schema.spec} ${assignment.title}`}
      />
      <Description assignment={assignment} />
      <DeleteModal
        active={openModal}
        setActive={setOpenModal}
        assignment={assignment}
      />
      <Sticky
        actions={[
          {
            color: 'green',
            href: `/edu/assignment_schema/edit/${assignment.spec}`,
            icon: <Pencil height={20} width={20} />,
            description: locale.tip.sticky.assignmentSchema.edit,
          },
          {
            color: 'red',
            onClick: () => {
              setOpenModal(true);
            },
            icon: <Trash height={20} width={20} />,
            description: locale.tip.sticky.assignmentSchema.delete,
          },
        ]}
      />
    </>
  );
}

AssignmentSchema.getLayout = (page: ReactNode) => {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export default AssignmentSchema;

export const getServerSideProps: GetServerSideProps = async ({
  query,
  req,
}) => {
  if (!query?.spec) {
    return {
      redirect: {
        permanent: false,
        destination: '/',
      },
    };
  }

  // TODO: Rewrite all using this
  const assignmentSchema = await fetchWrapperStatic({
    url: `api/assignment_schema/${query.spec}`,
    req,
  });

  if (assignmentSchema.status === 200) {
    return {
      props: {
        assignment: await assignmentSchema.json(),
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
