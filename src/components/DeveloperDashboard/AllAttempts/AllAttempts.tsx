import AttemptsList from '@components/Dashboard/AttemptsList/AttemptsList';
import { FC, memo } from 'react';

const AllAttempts: FC<{}> = ({}) => {
  return (
    <>
      <AttemptsList
        type={'all'}
        spec={''}
        shouldNotRefetch={false}
        isFinished={false}
        endDate={new Date()}
      />
    </>
  );
};

export default memo(AllAttempts);
