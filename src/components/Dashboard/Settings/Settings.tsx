import {
  ChangeEvent,
  FC,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  ITournament,
  ITournamentSettingsBundle,
} from '@custom-types/data/ITournament';
import PinCode from '@ui/PinCode/PinCode';
import { sendRequest } from '@requests/request';
import { Button, Switch } from '@ui/basics';
import { CustomTransferList } from '@ui/CustomTransferList/CustomTransferList';
import { requestWithNotify } from '@utils/requestWithNotify';
import { useLocale } from '@hooks/useLocale';
import { ITaskDisplayWithPublic } from '@custom-types/data/ITask';
import styles from './settings.module.css';

const Settings: FC<{ tournament: ITournament }> = ({
  tournament,
}) => {
  const { locale, lang } = useLocale();

  const [settings, setSettings] = useState<ITournamentSettingsBundle>(
    null!
  );

  const [selectedSpecs, setSelectedSpecs] = useState<string[]>([]);

  const [
    allowRegistrationAfterStart,
    setAllowRegistrationAfterStart,
  ] = useState(tournament.allowRegistrationAfterStart);

  useEffect(() => {
    let cleanUp = false;
    if (!!tournament.spec) {
      sendRequest<undefined, ITournamentSettingsBundle>(
        `tournament/settings/${tournament.spec}`,
        'GET'
      ).then((res) => {
        if (!cleanUp && !res.error) {
          setSettings(res.response);
        }
      });
    }
    return () => {
      cleanUp = true;
    };
  }, [tournament.spec]);

  const updateTasksPublic = useCallback(() => {
    requestWithNotify<string[], boolean>(
      `tournament/settings/changePublic/${tournament.spec}`,
      'POST',
      locale.notify.notification.create, // TODO
      lang,
      (_: boolean) => '',
      selectedSpecs
    );
  }, [
    lang,
    locale.notify.notification.create,
    selectedSpecs,
    tournament.spec,
  ]);

  const updateRegistration = useCallback(
    (newValue: boolean) => {
      requestWithNotify<
        { allowRegistrationAfterStart: boolean },
        boolean
      >(
        `tournament/settings/allowRegistrationAfterStart/${tournament.spec}`,
        'POST',
        locale.notify.task.create, // TODO
        lang,
        (_: boolean) => '',
        { allowRegistrationAfterStart: newValue }
      );
    },
    [lang, locale.notify.task.create, tournament.spec]
  );

  const [availableTasks, selectedTasks] = useMemo(() => {
    let newAvailableTasks = [];
    let newSelectedTasks = [];

    if (!!!settings) return [undefined, undefined];

    for (let i = 0; i < settings.tasks.length; i++) {
      const task = {
        ...settings.tasks[i],
        label: settings.tasks[i].title,
      };
      if (task.public) {
        newSelectedTasks.push(task);
      } else {
        newAvailableTasks.push(task);
      }
    }

    return [newAvailableTasks, newSelectedTasks];
  }, [settings]);

  useEffect(() => {
    if (!!selectedTasks)
      setSelectedSpecs(selectedTasks.map((item) => item.spec));
  }, [selectedTasks]);

  const itemComponent = useCallback(
    (task: ITaskDisplayWithPublic, handleSelect: any) => {
      return (
        <div
          onClick={() => handleSelect(task)}
          style={{ cursor: 'pointer' }}
        >
          {task.title}
        </div>
      );
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
      {tournament.security == 1 && (
        <PinCode origin={tournament.spec} />
      )}
      <Switch
        label="allowRegistrationAfterStart"
        checked={allowRegistrationAfterStart}
        onChange={changeRegistration}
      />
      {!!availableTasks && !!selectedTasks && (
        <>
          <CustomTransferList
            titles={[
              locale.ui.taskSelector.unselected,
              locale.ui.taskSelector.selected,
            ]}
            itemComponent={itemComponent}
            defaultOptions={availableTasks}
            defaultChosen={selectedTasks}
            setUsed={(items) =>
              setSelectedSpecs(items.map((item) => item.spec))
            }
            classNames={{}}
          />
          <Button onClick={updateTasksPublic}>JOPA</Button>
        </>
      )}
    </div>
  );
};

export default memo(Settings);
