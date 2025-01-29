import DeleteModal from '@components/AssignmentSchema/DeleteModal/DeleteModal';
import Description from '@components/AssignmentSchema/Description/Description';
import { IAssignmentSchema } from '@custom-types/data/IAssignmentSchema';
import { useLocale } from '@hooks/useLocale';
import { DefaultLayout } from '@layouts/DefaultLayout';
import Sticky, { IStickyAction } from '@ui/Sticky/Sticky';
import Title from '@ui/Title/Title';
import { fetchWrapperStatic } from '@utils/fetchWrapper';
import { GetServerSideProps } from 'next';
import { ReactNode, useMemo, useState } from 'react';
import { Pencil, Trash } from 'tabler-icons-react';

function AssignmentSchema(props: {
  schema: IAssignmentSchema;
  has_write_rights: boolean;
}) {
  const assignmentSchema = props.schema;
  const hasWriteRights = props.has_write_rights;

  const [openModal, setOpenModal] = useState(false);
  const { locale } = useLocale();

  const actions: IStickyAction[] = useMemo(
    () =>
      hasWriteRights
        ? [
            {
              color: 'green',
              href: `/assignment_schema/edit/${assignmentSchema.spec}`,
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
          ]
        : [],

    [hasWriteRights]
  );

  return (
    <>
      <Title
        title={`${locale.titles.assignment_schema.spec} ${assignmentSchema.title}`}
      />
      <Description assignment={assignmentSchema} />
      <DeleteModal
        active={openModal}
        setActive={setOpenModal}
        assignment={assignmentSchema}
      />
      {actions.length > 0 && <Sticky actions={actions} />}
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

  const response = await fetchWrapperStatic({
    url: `bundle/assignment_schema_page/${query.spec}`,
    req,
  });

  if (response.status === 200) {
    const response_json = await response.json();

    return {
      props: {
        schema: response_json.assignment_schema,
        has_write_rights: response_json.has_write_rights,
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
