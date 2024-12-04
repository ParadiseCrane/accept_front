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
import { TipTapEditor } from '@ui/basics/TipTapEditor/TipTapEditor';

const Description: FC<{
  tournament: ITournament;
  isPreview?: boolean;
  is_participant?: boolean;
}> = ({ tournament, isPreview, is_participant }) => {
  const { locale } = useLocale();
  const { user, isAdmin } = useUser();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(false);
  }, []);

  const [tasks, setTasks] = useState(
    tournament.tasks.map((task, index) => ({
      ...task,
      title: `${letterFromIndex(index)}. ${task.title}`,
    }))
  );
  const [successfullyRegistered, setSuccessfullyRegistered] = useState(false);

  const special = useMemo(
    () =>
      isAdmin ||
      tournament.moderators.includes(user?.login || '') ||
      tournament.author == user?.login,
    [isAdmin, tournament.author, tournament.moderators, user?.login]
  );

  const registered = useMemo(
    () => special || successfullyRegistered || !!is_participant,
    [special, is_participant, successfullyRegistered]
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

  return (
    <div className={styles.wrapper}>
      <div className={styles.titleWrapper}>
        <div className={styles.title}>
          {tournament.title}
          <PrintTasks
            title={<div className={styles.title}>{tournament.title}</div>}
            description={
              <div
                className={styles.description}
                children={
                  <TipTapEditor
                    editorMode={false}
                    content={tournament.description}
                    onUpdate={() => {}}
                  />
                }
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
              {locale.tournament.form.startDate}:{' '}
              {getLocalDate(tournament.start)}
            </div>
            <div className={styles.duration}>
              {locale.tournament.form.endDate}: {getLocalDate(tournament.end)}
            </div>
          </div>
        </div>
      </div>
      <div
        className={styles.description}
        children={
          <TipTapEditor
            editorMode={false}
            content={tournament.description}
            onUpdate={() => {}}
          />
        }
      />
      {!loading && (
        <>
          {banned ? (
            <div className={styles.bannedWrapper}>
              {locale.tournament.banned}!
            </div>
          ) : (
            !(tournament.status.spec === 2 || isPreview || special) && (
              <RegistrationButton
                spec={tournament.spec}
                withPin={tournament.security == 1}
                maxTeamSize={tournament.maxTeamSize}
                status={tournament.status.spec}
                allowRegistrationAfterStart={
                  tournament.allowRegistrationAfterStart
                }
                registered={registered}
                onRegistration={() => setSuccessfullyRegistered(true)}
                onRefusal={() => setSuccessfullyRegistered(false)}
              />
            )
          )}

          <div className={styles.tasksWrapper}>
            {((!registered && tournament.status.spec != 2) ||
              (!special && tournament.status.spec == 0)) && (
              <Overlay blur={3} />
            )}
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
        </>
      )}
    </div>
  );
};

export default memo(Description);
