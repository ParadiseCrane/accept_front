import { IFullProfileBundle } from '@custom-types/data/IProfileInfo';
import { FC, memo } from 'react';

import AttemptInfo from './AttemptInfo/AttemptInfo';
import GroupsInfo from './GroupsInfo/GroupsInfo';
import MainInfo from './MainInfo/MainInfo';
import styles from './profileInfo.module.css';
import ShortStatistics from './ShortStatistics/ShortStatistics';
import TaskInfo from './TaskInfo/TaskInfo';

const ProfileInfo: FC<IFullProfileBundle> = ({
  user,
  attempt_info,
  task_info,
  rating_info,
}) => {
  return (
    <div className={styles.wrapper}>
      <MainInfo user={user} place={rating_info?.place} />
      <GroupsInfo user={user} />
      <ShortStatistics ratingInfo={rating_info} attemptInfo={attempt_info} />
      {(task_info.total_solved > 0 || task_info.total_tried > 0) && (
        <TaskInfo {...task_info} />
      )}
      {attempt_info.total > 0 && <AttemptInfo {...attempt_info} />}
    </div>
  );
};

export default memo(ProfileInfo);
