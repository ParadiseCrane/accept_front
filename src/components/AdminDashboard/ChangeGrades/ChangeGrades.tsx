import {
  IGradeChange,
  IGradeChangeResponse,
} from '@custom-types/data/IStudent';
import { ILocale } from '@custom-types/ui/ILocale';
import { ITableColumn } from '@custom-types/ui/ITable';
import { useLocale } from '@hooks/useLocale';
import { sendRequest } from '@requests/request';
import { Button, Dropzone, Helper, SegmentedControl } from '@ui/basics';
import ChangeGradeErrorList, {
  IGradeChangeResponseTable,
} from '@ui/ChangeGradeErrorList/ChangeGradeErrorList';
import ChangeGradeList from '@ui/ChangeGradeList/ChangeGradeList';
import {
  errorNotification,
  newNotification,
  successNotification,
  warningNotification,
} from '@utils/notificationFunctions';
import { getAddUserData } from '@utils/readExcel';
import { FC, memo, useCallback, useState } from 'react';
import { AlertCircle } from 'tabler-icons-react';

import styles from './changeGrades.module.css';

const USERS_AT_ONCE = 50;

const usersInitialColumns = (locale: ILocale): ITableColumn[] => [
  {
    label: locale.users.list.login,
    key: 'login',
    sortable: true,
    sortFunction: (a: any, b: any) =>
      a.login > b.login ? 1 : a.login == b.login ? 0 : -1,
    sorted: 0,
    allowMiddleState: true,
    hidable: false,
    hidden: false,
    size: 2,
  },
  {
    label: locale.users.list.grade,
    key: 'grade',
    sortable: true,
    sortFunction: (a: any, b: any) =>
      +a.grade.slice(0, -1) > +b.grade.slice(0, -1)
        ? 1
        : +a.grade.slice(0, -1) == +b.grade.slice(0, -1)
          ? a.grade[-1] > b.grade[-1]
            ? 1
            : 0
          : -1,
    sorted: 0,
    allowMiddleState: true,
    hidable: true,
    hidden: false,
    size: 1,
  },
];

const compKind = (a: any, b: any) =>
  a.error.value === 'error' && b.error.value !== 'error'
    ? 1
    : a.error.value !== 'error' && b.error.value === 'error'
      ? -1
      : 0;

const errorsInitialColumns = (locale: ILocale): ITableColumn[] => [
  {
    label: locale.users.list.login,
    key: 'login',
    sortable: true,
    sortFunction: (a: any, b: any) =>
      a.login > b.login ? 1 : a.login == b.login ? 0 : -1,
    sorted: 0,
    allowMiddleState: true,
    hidable: false,
    hidden: false,
    size: 2,
  },
  {
    label: locale.users.list.grade,
    key: 'grade',
    sortable: true,
    sortFunction: (a: any, b: any) =>
      +a.grade.slice(0, -1) > +b.grade.slice(0, -1)
        ? 1
        : +a.grade.slice(0, -1) == +b.grade.slice(0, -1)
          ? a.grade[-1] > b.grade[-1]
            ? 1
            : 0
          : -1,
    sorted: 0,
    allowMiddleState: true,
    hidable: true,
    hidden: false,
    size: 1,
  },
  {
    label: locale.users.list.error,
    key: 'error',
    sortable: true,
    sortFunction: compKind,
    sorted: -1,
    allowMiddleState: true,
    hidable: false,
    hidden: false,
    size: 2,
  },
];

const ACCEPTED = [
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
];

const ChangeGrades: FC<{}> = () => {
  const { locale, lang } = useLocale();
  const [users, setUsers] = useState<IGradeChange[]>([]);
  const [errors, setErrors] = useState<IGradeChangeResponseTable[]>([]);
  const [table, setTable] = useState<'users' | 'errors'>('users');

  const onDrop = useCallback(async (files: any[]) => {
    const file = await files[0].arrayBuffer();
    const data = getAddUserData(file);
    setUsers(data as IGradeChange[]);
    setErrors([]);
    setTable('users');
  }, []);

  const sendUsers = useCallback(async (users: IGradeChange[]) => {
    return await sendRequest<IGradeChange[], IGradeChangeResponse[]>(
      'grades/change',
      'POST',
      users
    );
  }, []);

  const handleSend = useCallback(async () => {
    const id = newNotification({
      title: locale.loading,
      autoClose: false,
    });

    await sendRequest<{}, {}>('grades/start-change', 'GET');
    for (let idx = 0; idx < users.length / USERS_AT_ONCE; idx++) {
      await sendUsers(
        users.slice(
          idx * USERS_AT_ONCE,
          Math.min((idx + 1) * USERS_AT_ONCE, users.length)
        )
      ).then((res) => {
        return res;
      });
    }
    let wrong_grades: IGradeChangeResponse[] = [];

    await sendRequest<{}, IGradeChangeResponse[]>(
      'grades/end-change',
      'GET'
    ).then((res) => {
      if (res.error) {
        errorNotification({
          id,
          title: `${locale.student.add.error} (${wrong_grades.length})`,
          autoClose: 20000,
        });
        return;
      }
      wrong_grades = res.response;
    });

    setErrors(
      wrong_grades.map((item) => ({
        ...item,
        error: {
          value: item.message.kind,
          display: (
            <div className={styles.errorWrapper}>
              <div
                className={styles.error}
                style={{
                  color:
                    item.message.kind == 'error'
                      ? 'var(--negative)'
                      : 'var(--neutral)',
                }}
              >
                {locale.student.errors[item.message.kind]}
              </div>
              <Helper
                hoverCardProps={{ arrowSize: 15 }}
                dropdownContent={item.message.text[lang]}
                iconColor={
                  item.message.kind == 'error'
                    ? 'var(--negative)'
                    : 'var(--neutral)'
                }
              />
            </div>
          ),
        },
      }))
    );
    setTable('errors');

    if (wrong_grades.length != 0) {
      warningNotification({
        id,
        title: `${locale.grade.change.warning} (${wrong_grades.length})`,
        autoClose: 20000,
      });
      return;
    }
    successNotification({
      id,
      title: locale.grade.change.success,
      autoClose: 30000,
    });
  }, [locale, users, sendUsers, lang]);

  return (
    <>
      <Dropzone
        onDrop={onDrop}
        title={''}
        description={''}
        accept={ACCEPTED}
        showButton
        additionalButtons={
          <>
            {users.length > 0 && (
              <Button onClick={handleSend} color={'var(--positive)'}>
                {locale.edit}
              </Button>
            )}
            <Helper dropdownContent={locale.helpers.grade.tableFormat} />
            <Helper
              dropdownContent={locale.helpers.grade.attention}
              customIcon={<AlertCircle color={'var(--negative)'} />}
            />
          </>
        }
      >
        <div className={styles.tableWrapper}>
          {errors.length > 0 && (
            <div className={styles.segmentControl}>
              <SegmentedControl
                value={table}
                onChange={(value) => setTable(value as 'users' | 'errors')}
                data={[
                  {
                    label: locale.student.segments.users,
                    value: 'users',
                  },
                  {
                    label: locale.student.segments.errors,
                    value: 'errors',
                  },
                ]}
              />
              <Helper
                hoverCardProps={{ arrowSize: 15 }}
                dropdownContent={locale.helpers.grade.errors}
              />
            </div>
          )}
          {table != 'errors' && (
            <ChangeGradeList
              data={users}
              initialColumns={usersInitialColumns}
              empty={<div>{locale.ui.codeArea.dragFile}</div>}
              noDefault
            />
          )}
          {table == 'errors' && (
            <ChangeGradeErrorList
              data={errors}
              initialColumns={errorsInitialColumns}
              empty={<div>{locale.ui.codeArea.dragFile}</div>}
              noDefault
            />
          )}
        </div>
      </Dropzone>
    </>
  );
};

export default memo(ChangeGrades);
