import { STICKY_SIZES } from '@constants/Sizes';
import { IUser } from '@custom-types/data/IUser';
import { useLocale } from '@hooks/useLocale';
import { useWidth } from '@hooks/useWidth';
import Sticky, { IStickyAction } from '@ui/Sticky/Sticky';
import { FC, memo, useState } from 'react';
import { Pencil, Trash } from 'tabler-icons-react';

import ProfileDeleteModal from '../ProfileDeleteModal/ProfileDeleteModal';
import ProfileEditModal from '../ProfileEditModal/ProfileEditModal';

const ProfileSticky: FC<{ user: IUser }> = ({ user }) => {
  const { width } = useWidth();
  const [activeEditModal, setActiveEditModal] = useState(false);
  const [activeDeleteModal, setActiveDeleteModal] = useState(false);
  const { locale } = useLocale();

  const actions: IStickyAction[] = [
    {
      color: 'green',
      icon: (
        <Pencil
          width={STICKY_SIZES[width] / 3}
          height={STICKY_SIZES[width] / 3}
        />
      ),
      onClick: () => setActiveEditModal(true),
      description: locale.tip.sticky.user.edit,
    },
    {
      color: 'red',
      icon: (
        <Trash
          width={STICKY_SIZES[width] / 3}
          height={STICKY_SIZES[width] / 3}
        />
      ),
      onClick: () => setActiveDeleteModal(true),
      description: locale.tip.sticky.user.delete,
    },
  ];

  return (
    <>
      {user && (
        <>
          <ProfileDeleteModal
            opened={activeDeleteModal}
            setOpened={setActiveDeleteModal}
            user={user}
          />

          <ProfileEditModal
            opened={activeEditModal}
            setOpened={setActiveEditModal}
            user={user}
          />
        </>
      )}
      <Sticky actions={actions} />
    </>
  );
};

export default memo(ProfileSticky);
