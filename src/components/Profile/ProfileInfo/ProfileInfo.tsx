import { FC, memo } from 'react';
import styles from './profileInfo.module.css';
import { IFullProfileBundle } from '@custom-types/data/IProfileInfo';
import MainInfo from './MainInfo/MainInfo';
import GroupsInfo from './GroupsInfo/GroupsInfo';
import TaskInfo from './TaskInfo/TaskInfo';
import AttemptInfo from './AttemptInfo/AttemptInfo';
import ShortStatistics from './ShortStatistics/ShortStatistics';

const ProfileInfo: FC<IFullProfileBundle> = ({
  user,
  attempt_info,
  task_info,
  rating_info,
}) => {
  return (
    <div className={styles.wrapper}>
      <MainInfo user={user} place={rating_info.place} />
      <GroupsInfo user={user} />
      <ShortStatistics
        ratingInfo={rating_info}
        attemptInfo={attempt_info}
      />
      {(task_info.total_solved > 0 || task_info.total_tried > 0) && (
        <TaskInfo {...task_info} />
      )}
      {attempt_info.total > 0 && <AttemptInfo {...attempt_info} />}
    </div>
  );
};

export default memo(ProfileInfo);
