import { Icon } from 'tabler-icons-react';
import styles from './IconWrapper.module.css';

export const IconWrapper = ({
  isActive,
  IconChild,
}: {
  isActive: boolean;
  IconChild: Icon;
}) => {
  return (
    <div
      className={isActive ? styles.icon_wrapper_active : styles.icon_wrapper}
    >
      <IconChild
        size={'1.2rem'}
        style={{ stroke: isActive ? '#041E49' : '#444746' }}
      />
    </div>
  );
};
