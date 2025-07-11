'use client';
import Description from '@components/Tournament/Description/Description';
import { ITournament } from '@custom-types/data/ITournament';
import { FC, memo } from 'react';

const Preview: FC<{ tournament: ITournament }> = ({ tournament }) => {
  return (
    <div style={{ zoom: '80%' }}>
      <Description tournament={tournament} isPreview={true} />
    </div>
  );
};

export default memo(Preview);
