import { useLocale } from '@hooks/useLocale';
import { FC, memo, useCallback, useMemo } from 'react';
import { CustomEditor, NumberInput, TextInput } from '@ui/basics';
import { TagSelector } from '@ui/selectors';
import { Item } from '@ui/CustomTransferList/CustomTransferList';

const MainInfo: FC<{
  form: any;
  initialMaxTeamSize: number;
}> = ({ form, initialMaxTeamSize }) => {
  const { locale } = useLocale();

  const initialTags = useMemo(
    () => {
      return form.values.tags;
    },
    [form.values.tags.length] // eslint-disable-line
  );

  const setUsed = useCallback(
    (value: Item[]) => form.setFieldValue('tags', value),
    [form.setFieldValue] // eslint-disable-line
  );

  return (
    <>
      <TextInput
        size="lg"
        label={locale.tournament.form.title}
        required
        {...form.getInputProps('title')}
      />
      <CustomEditor
        label={locale.tournament.form.description}
        form={form}
        name={'description'}
      />
      <NumberInput
        helperContent={locale.helpers.tournament.maxTeamSize}
        label={locale.tournament.form.maxTeamSize}
        min={initialMaxTeamSize}
        {...form.getInputProps('maxTeamSize')}
      />
      <TagSelector
        initialTags={initialTags}
        setUsed={setUsed}
        fetchURL={'tournament_tag/list'}
        addURL={'tournament_tag/add'}
        updateURL={'tournament_tag/edit'}
        deleteURL={'tournament_tag/delete'}
        form={form}
        field={'tags'}
      />
    </>
  );
};

export default memo(MainInfo);
