import { useLocale } from '@hooks/useLocale';
import { Icon, TextInput } from '@ui/basics';
import { requestWithNotify } from '@utils/requestWithNotify';
import { useRouter } from 'next/router';
import { FC, memo, useCallback, useState } from 'react';
import { Check, Pencil, X } from 'tabler-icons-react';

import styles from './titleInput.module.css';

const TitleInput: FC<{
  spec: string;
  title: string;
  special?: boolean;
}> = ({ spec, title, special }) => {
  const { locale, lang } = useLocale();
  const router = useRouter();

  const [editTitle, setEditTitle] = useState(false);
  const [error, setError] = useState<string>(null!);
  const [newTitle, setNewTitle] = useState(title);

  const validate = useCallback(
    (new_title: string) => {
      let new_team_name = new_title.trim().replace(/\s+/, ' ');
      let error =
        new_team_name.length == 0
          ? locale.tournament.registration.form.validation.teamName.empty
          : new_team_name.length < 4
            ? locale.tournament.registration.form.validation.teamName.minLength(
                4
              )
            : new_team_name.length > 20
              ? locale.tournament.registration.form.validation.teamName.maxLength(
                  20
                )
              : !new_team_name.match(/^[a-zA-Zа-яА-ЯЁё][a-zA-Zа-яА-ЯЁё_ ]+$/)
                ? locale.tournament.registration.form.validation.teamName
                    .invalid
                : null;
      if (error !== null) {
        setError(error);
        return false;
      }
      setError(null!);
      return true;
    },
    [locale]
  );

  const sendTitle = useCallback(() => {
    if (!validate(newTitle)) {
      return;
    }
    // to requestWithError
    requestWithNotify(
      'team/edit',
      'PUT',
      locale.notify.team.edit,
      lang,
      () => '',
      {
        name: newTitle,
        spec: spec,
      }
    ).then((res) => {
      if (!res.error) {
        router.reload();
      }
      setEditTitle(false);
    });
  }, [locale, lang, validate, newTitle, spec, router]);

  const openEdit = useCallback(() => {
    setEditTitle(true);
  }, []);

  const closeEdit = useCallback(() => {
    setEditTitle(false);
    setNewTitle(title);
    setError(null!);
  }, [title]);

  const onChange = useCallback(
    (e: any) => {
      setNewTitle(e.target.value);
      validate(e.target.value);
    },
    [validate]
  );

  return (
    <div className={styles.teamName}>
      <span
        className={styles.title}
        style={{ display: editTitle ? 'none' : 'block' }}
      >
        {title}
      </span>
      {special && (
        <>
          <TextInput
            classNames={{ input: styles.titleInput }}
            inputWrapperProps={{
              style: {
                width: editTitle ? 'unset' : '0',
                visibility: editTitle ? 'visible' : 'hidden',
              },
            }}
            value={newTitle}
            onChange={onChange}
            error={error}
            size="xl"
          />
          <div className={styles.icons}>
            {editTitle ? (
              <>
                <Icon size="sm" color="green" onClick={sendTitle}>
                  <Check />
                </Icon>
                <Icon size="sm" color="red" onClick={closeEdit}>
                  <X />
                </Icon>
              </>
            ) : (
              <Icon size="sm" color="var(--primary)" onClick={openEdit}>
                <Pencil />
              </Icon>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default memo(TitleInput);
