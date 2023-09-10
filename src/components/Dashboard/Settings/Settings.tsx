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
import { Button, Helper, InputWrapper, Switch } from '@ui/basics';
import {
  CustomTransferList,
  Item,
} from '@ui/CustomTransferList/CustomTransferList';
import { requestWithNotify } from '@utils/requestWithNotify';
import { useLocale } from '@hooks/useLocale';
import styles from './settings.module.css';
import { TaskItem } from '@ui/selectors/TaskSelector/TaskItem/TaskItem';

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
      locale.notify.tournament.settings.changePublic,
      lang,
      (_: boolean) => '',
      selectedSpecs
    );
  }, [lang, locale, selectedSpecs, tournament.spec]);

  const updateRegistration = useCallback(
    (newValue: boolean) => {
      requestWithNotify<
        { allowRegistrationAfterStart: boolean },
        boolean
      >(
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

  const [availableTasks, selectedTasks] = useMemo(() => {
    let newAvailableTasks = [];
    let newSelectedTasks = [];

    if (!!!settings) return [undefined, undefined];

    for (let i = 0; i < settings.tasks.length; i++) {
      const task = {
        ...settings.tasks[i],
        label: settings.tasks[i].title,
        value: settings.tasks[i].spec,
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

  const setUsed = useCallback(
    (items: Item[]) =>
      setSelectedSpecs(items.map((item) => item.spec)),
    []
  );

  const itemComponent = useCallback(
    (item: any, handleSelect: any) => {
      return (
        <TaskItem item={item} onSelect={() => handleSelect(item)} />
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
      <div className={styles.section}>
        <div className={styles.sectionTitle}>
          {locale.dashboard.tournament.settings.sections.pin}
        </div>
        {tournament.security == 1 && (
          <PinCode
            origin={tournament.spec}
            classNames={{ wrapper: styles.pinCodeWrapper }}
          />
        )}
      </div>
      {!!availableTasks && !!selectedTasks && (
        <div className={styles.section}>
          <div className={styles.sectionTitle}>
            {locale.dashboard.tournament.settings.sections.tasks}
            <Helper
              dropdownContent={
                locale.helpers.tournament.settings.tasks
              }
            />
          </div>
          <InputWrapper style={{ width: '80%' }}>
            <CustomTransferList
              titles={[
                locale.ui.taskSelector.unselected,
                locale.ui.taskSelector.selected,
              ]}
              itemComponent={itemComponent}
              defaultOptions={availableTasks}
              defaultChosen={selectedTasks}
              setUsed={setUsed}
              classNames={{}}
            />
          </InputWrapper>
          <Button onClick={updateTasksPublic}>{locale.save}</Button>
        </div>
      )}
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
    </div>
  );
};

export default memo(Settings);
