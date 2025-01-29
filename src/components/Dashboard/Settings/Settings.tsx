import {
  ITournament,
  ITournamentSettingsBundle,
} from '@custom-types/data/ITournament';
import {
  ICustomTransferListData,
  ICustomTransferListItemComponent,
} from '@custom-types/ui/basics/customTransferList';
import { useLocale } from '@hooks/useLocale';
import { sendRequest } from '@requests/request';
import { Button, Helper, Switch } from '@ui/basics';
import CustomTransferList from '@ui/basics/CustomTransferList/CustomTransferList';
import PinCode from '@ui/PinCode/PinCode';
import { TaskItem } from '@ui/selectors/TaskSelector/TaskItem/TaskItem';
import { requestWithNotify } from '@utils/requestWithNotify';
import { ChangeEvent, FC, memo, useCallback, useEffect, useState } from 'react';

import CreateAssignment from './CreateAssignment/CreateAssignment';
import styles from './settings.module.css';

const Settings: FC<{ tournament: ITournament }> = ({ tournament }) => {
  const { locale, lang } = useLocale();

  const [tasks, setTasks] = useState<ICustomTransferListData>(undefined);
  const [settings, setSettings] = useState<ITournamentSettingsBundle>(null!);

  const [allowRegistrationAfterStart, setAllowRegistrationAfterStart] =
    useState(tournament.allowRegistrationAfterStart);

  useEffect(() => {
    let cleanUp = false;
    if (tournament.spec) {
      sendRequest<undefined, ITournamentSettingsBundle>(
        `tournament/settings/${tournament.spec}`,
        'GET'
      ).then((res) => {
        if (!cleanUp && !res.error) {
          setSettings(res.response);
          setTasks([
            res.response.tasks
              .filter((item) => !item.public)
              .map((item) => ({
                ...item,
                value: item.spec,
                sortValue: item.title,
              })),
            res.response.tasks
              .filter((item) => item.public)
              .map((item) => ({
                ...item,
                value: item.spec,
                sortValue: item.title,
              })),
          ] as ICustomTransferListData);
        }
      });
    }
    return () => {
      cleanUp = true;
    };
  }, [tournament.spec]);

  const updateTasksPublic = useCallback(() => {
    if (!tasks) return;
    requestWithNotify<string[], boolean>(
      `tournament/settings/changePublic/${tournament.spec}`,
      'POST',
      locale.notify.tournament.settings.changePublic,
      lang,
      (_: boolean) => '',
      tasks[1].map((item) => item.spec)
    );
  }, [lang, locale, tasks, tournament.spec]);

  const updateRegistration = useCallback(
    (newValue: boolean) => {
      requestWithNotify<{ allowRegistrationAfterStart: boolean }, boolean>(
        `tournament/settings/allowRegistrationAfterStart/${tournament.spec}`,
        'POST',
        locale.notify.tournament.settings.allowRegistrationAfterStart,
        lang,
        (_: boolean) => '',
        { allowRegistrationAfterStart: newValue }
      );
    },
    [lang, locale, tournament.spec]
  );

  const itemComponent: ICustomTransferListItemComponent = useCallback(
    ({ item, onClick, index }) => {
      return <TaskItem key={index} item={item} onSelect={onClick} />;
    },
    []
  );

  const changeRegistration = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      let value = e.currentTarget.checked;
      setAllowRegistrationAfterStart(value);
      updateRegistration(value);
    },
    [updateRegistration]
  );

  if (!settings) return <></>;

  return (
    <div className={styles.wrapper}>
      <div className={styles.section}>
        {tournament.security == 1 && (
          <>
            <div className={styles.sectionTitle}>
              {locale.dashboard.tournament.settings.sections.pin}
            </div>
            <PinCode
              origin={tournament.spec}
              classNames={{ wrapper: styles.pinCodeWrapper }}
            />
          </>
        )}
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>
          {locale.dashboard.tournament.settings.sections.tasks}
          <Helper dropdownContent={locale.helpers.tournament.settings.tasks} />
        </div>
        <CustomTransferList
          titles={[
            locale.ui.taskSelector.unselected,
            locale.ui.taskSelector.selected,
          ]}
          itemComponent={itemComponent}
          value={tasks}
          onChange={setTasks}
          searchKeys={['title']}
          height="400px"
          width="70%"
        />
        <Button onClick={updateTasksPublic}>{locale.save}</Button>
      </div>
      <div className={styles.section}>
        <div className={styles.sectionTitle}>
          {locale.dashboard.tournament.settings.sections.others}
        </div>
        <Switch
          label={locale.tournament.form.allowRegistrationAfterStart}
          checked={allowRegistrationAfterStart}
          onChange={changeRegistration}
        />
      </div>
      <div className={styles.section}>
        <div className={styles.sectionTitle}>
          {locale.dashboard.tournament.settings.sections.createAssignmentSchema}
        </div>
        <CreateAssignment tournament={tournament} />
      </div>
    </div>
  );
};

export default memo(Settings);
