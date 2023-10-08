import { FC, memo, useCallback } from 'react';
import { ITournament } from '@custom-types/data/ITournament';
import { useForm } from '@mantine/form';
import { Button, TextInput } from '@ui/basics';
import { requestWithNotify } from '@utils/requestWithNotify';
import { useLocale } from '@hooks/useLocale';
// import styles from './createAssignment.module.css'

const CreateAssignment: FC<{ tournament: ITournament }> = ({
  tournament,
}) => {
  const { locale, lang } = useLocale();
  const form = useForm({
    initialValues: {
      title: tournament.title,
    },
    validate: {
      title: (value) =>
        value.length < 5
          ? locale.assignmentSchema.form.validation.title
          : null,
    },
  });

  const createAssignmentSchema = useCallback(() => {
    if (!form.isValid()) return;
    requestWithNotify<
      { title: string; tournament_spec: string },
      boolean
    >(
      `assignment_schema/from-tournament`,
      'POST',
      locale.notify.assignmentSchema.create,
      lang,
      () => '',
      { title: form.values.title, tournament_spec: tournament.spec }
    );
  }, [
    form,
    locale.notify.assignmentSchema.create,
    lang,
    tournament.spec,
  ]);

  return (
    <>
      <TextInput {...form.getInputProps('title')} />
      <Button
        variant="outline"
        onClick={createAssignmentSchema}
        disabled={!form.isValid()}
        dropdownContent={locale.tip.tournament.createAssignmentSchema}
      >
        {locale.dashboard.tournament.settings.createAssignmentButton}
      </Button>
    </>
  );
};

export default memo(CreateAssignment);
