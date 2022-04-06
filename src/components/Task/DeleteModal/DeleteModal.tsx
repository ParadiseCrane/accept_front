import { ITask, ITaskDisplay } from '@custom-types/ITask';
import { useLocale } from '@hooks/useLocale';
import { Button, Group, Modal } from '@mantine/core';
import { isSuccessful, sendRequest } from '@requests/request';
import { capitalize } from '@utils/capitalize';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC, memo, useCallback, useEffect, useState } from 'react';
import styles from './deleteModal.module.css';

const DeleteModal: FC<{
  active: boolean;
  setActive: (_: boolean) => void;
  task: ITaskDisplay;
}> = ({ active, setActive, task }) => {
  const [assignments, setAssignments] = useState<ITask[]>([]);
  const { locale } = useLocale();
  const router = useRouter();

  useEffect(() => {
    let cleanUp = false;

    sendRequest<{}, ITask[]>(
      `/tasks/connected_assignments/${task.spec}`,
      'POST'
    ).then((res) => {
      if (res && !cleanUp) {
        setAssignments(res);
      }
    });

    return () => {
      cleanUp = true;
    };
  }, [task]);

  const handleDelete = useCallback(() => {
    isSuccessful<{}>('/tasks/delete', 'POST', {
      spec: task.spec,
    }).then((res) => (res ? router.push('/edu/task/list') : {}));
  }, [task, router]);

  return (
    <Modal
      opened={active}
      centered
      hideCloseButton
      onClose={() => setActive(false)}
      size="lg"
      title={
        capitalize(locale.tasks.modals.delete) + ` '${task.title}' ?`
      }
      classNames={{
        title: styles.modalTitle,
      }}
    >
      <div className={styles.form}>
        <div className={styles.question}>
          {capitalize(locale.tasks.modals.deleteConfidence)}
        </div>
        {assignments.length > 0 && (
          <div>
            <div>
              {capitalize(locale.tasks.modals.usedInAssignments) +
                ` (${assignments.length}):`}
            </div>
            <br />
            <div className={styles.assignmentList}>
              {assignments.map((assignment, index) => (
                <div key={index}>
                  <Link href={`/edu/assignment/${assignment.spec}`}>
                    <a
                      className={styles.assignmentLink}
                      target="_blank"
                    >
                      {assignment.title}
                    </a>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
        <Group
          position="right"
          spacing="lg"
          className={styles.buttons}
        >
          <Button
            variant="outline"
            color="green"
            autoFocus
            onClick={() => setActive(false)}
          >
            {capitalize(locale.cancel)}
          </Button>
          <Button
            variant="outline"
            color="red"
            onClick={() => handleDelete()}
          >
            {capitalize(locale.delete)}
          </Button>
        </Group>
      </div>
    </Modal>
  );
};

export default memo(DeleteModal);
