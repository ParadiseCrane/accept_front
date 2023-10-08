import { FC, memo, useCallback, useMemo, useState } from 'react';
import { useLocale } from '@hooks/useLocale';
import { ITeamDisplayWithBanned } from '@custom-types/data/ITeam';
import { pureCallback } from '@custom-types/ui/atomic';
import { requestWithNotify } from '@utils/requestWithNotify';
import { Button, TextInput } from '@ui/basics';
import SimpleButtonGroup from '@ui/SimpleButtonGroup/SimpleButtonGroup';
import SimpleModal from '@ui/SimpleModal/SimpleModal';
import { useForm } from '@mantine/form';
// import styles from './BunButton.module.css'

const BunButton: FC<{
  team: ITeamDisplayWithBanned;
  spec: string;
  onSuccess: pureCallback<void>;
}> = ({ team, spec, onSuccess }) => {
  const { locale, lang } = useLocale();
  const [opened, setOpened] = useState(false);

  const ban = useMemo(() => !team.banned, [team.banned]);

  const form = useForm({
    initialValues: {
      banReason: '',
    },
    validate: {
      banReason: (value) =>
        value.length < 4 && ban
          ? locale.user.ban.form.validate.reason
          : null,
    },
    validateInputOnBlur: true,
  });

  const openModal = useCallback(() => setOpened(true), []);
  const closeModal = useCallback(() => setOpened(false), []);

  const handleBan = useCallback(() => {
    if (!form.isValid()) {
      return;
    }
    requestWithNotify<{ spec: string; banReason: string }, boolean>(
      `team/${ban ? 'ban' : 'unban'}/${spec}`,
      'DELETE',
      ban ? locale.notify.team.ban : locale.notify.team.unban,
      lang,
      () => '',
      { spec: team.spec, banReason: form.values.banReason },
      () => {
        closeModal();
        onSuccess();
      }
    );
  }, [team, form, spec, locale, lang, onSuccess, closeModal, ban]);

  return (
    <>
      <Button
        onClick={openModal}
        variant="outline"
        kind={ban ? 'negative' : 'positive'}
      >
        {ban ? locale.ban : locale.unban}
      </Button>
      <SimpleModal
        close={closeModal}
        title={locale.sure}
        opened={opened}
      >
        {ban && <TextInput {...form.getInputProps('banReason')} />}
        <SimpleButtonGroup
          reversePositive
          actionButton={{
            onClick: handleBan,
            label: ban ? locale.ban : locale.unban,
            props: { disabled: !form.isValid() },
          }}
          cancelButton={{ onClick: closeModal }}
        />
      </SimpleModal>
    </>
  );
};

export default memo(BunButton);
