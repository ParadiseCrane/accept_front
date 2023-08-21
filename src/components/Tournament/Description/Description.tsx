import { FC, memo, useEffect, useMemo, useState } from 'react';
import styles from './description.module.css';
import { ITournament } from '@custom-types/data/ITournament';
import { ITaskDisplay } from '@custom-types/data/ITask';
import { getLocalDate } from '@utils/datetime';
import { useLocale } from '@hooks/useLocale';
import PrimitiveTaskTable from '@ui/PrimitiveTaskTable/PrimitiveTaskTable';
import { useUser } from '@hooks/useUser';
import { Overlay } from '@ui/basics';
import { sendRequest } from '@requests/request';
import { letterFromIndex } from '@utils/letterFromIndex';
import PrintTasks from '@components/Task/PrintTasks/PrintTasks';
import RegistrationButton from './RegistrationButton/RegistrationButton';

const Description: FC<{
  tournament: ITournament;
  isPreview?: boolean;
}> = ({ tournament, isPreview }) => {
  const { locale } = useLocale();
  const [start, setStart] = useState('-');
  const [end, setEnd] = useState('-');
  const [tasks, setTasks] = useState(tournament.tasks);
  const { user, isAdmin } = useUser();

  const [successfullyRegistered, setSuccessfullyRegistered] =
    useState(false);

  const special = useMemo(
    () =>
      isAdmin ||
      tournament.moderators.includes(user?.login || '') ||
      tournament.author == user?.login,
    [isAdmin, tournament.author, tournament.moderators, user?.login]
  );

  const registered = useMemo(
    () =>
      special ||
      successfullyRegistered ||
      tournament.participants.includes(user?.login || ''),
    [user?.login, special, tournament, successfullyRegistered]
  );

  const banned = useMemo(
    () => !!user && tournament.banned.includes(user.login),
    [user, tournament.banned]
  );

  useEffect(() => {
    let cleanUp = false;
    if (tournament.tasks.length && !isPreview) {
      sendRequest<string[], ITaskDisplay[]>(
        `task/list-specs`,
        'POST',
        tournament.tasks.map((task: any) => task.value || task.spec),
        5000
      ).then((res) => {
        if (!cleanUp && !res.error) {
          setTasks(
            res.response.map((task, index) => ({
              ...task,
              title: `${letterFromIndex(index)}. ${task.title}`,
            }))
          );
        }
      });
    }
    return () => {
      cleanUp = true;
    };
  }, [tournament.spec, tournament.tasks, isPreview]);

  useEffect(() => {
    setStart(getLocalDate(tournament.start));
    setEnd(getLocalDate(tournament.end));
  }, [tournament.end, tournament.start]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.titleWrapper}>
        <div className={styles.title}>
          {tournament.title}
          <PrintTasks
            title={
              <div className={styles.title}>{tournament.title}</div>
            }
            description={
              <div
                className={styles.description}
                dangerouslySetInnerHTML={{
                  __html: tournament.description,
                }}
              />
            }
            tasks={tasks.map((task) => task.spec)}
          />
        </div>
        <div className={styles.info}>
          <div className={styles.usersInfo}>
            <div className={styles.author}>
              {locale.tournament.form.author}: {tournament.author}
            </div>
          </div>

          <div>
            <div className={styles.duration}>
              {locale.tournament.form.startTime}: {start}
            </div>
            <div className={styles.duration}>
              {locale.tournament.form.endTime}: {end}
            </div>
          </div>
        </div>
      </div>
      <div
        className={styles.description}
        dangerouslySetInnerHTML={{ __html: tournament.description }}
      />
      {banned ? (
        <div className={styles.bannedWrapper}>
          {locale.tournament.banned}!
        </div>
      ) : (
        !(tournament.status.spec === 2 || isPreview || special) && (
          <RegistrationButton
            spec={tournament.spec}
            withPin={tournament.security == 1}
            status={tournament.status.spec}
            allowRegistrationAfterStart={
              tournament.allowRegistrationAfterStart
            }
            registered={registered}
            onRegister={() => setSuccessfullyRegistered(true)}
            onRefusal={() => setSuccessfullyRegistered(false)}
          />
        )
      )}

      <div className={styles.tasksWrapper}>
        {((!registered && tournament.status.spec != 2) ||
          (!special && tournament.status.spec == 0)) && <Overlay />}
        <PrimitiveTaskTable
          tasks={tasks}
          linkQuery={`tournament=${tournament.spec}`}
          empty={
            special && !isPreview
              ? locale.tournament.addTasks
              : registered || tournament.status.spec == 2
              ? locale.tournament.emptyTasks
              : locale.tournament.needRegistration
          }
        />
      </div>
    </div>
  );
};

export default memo(Description);
