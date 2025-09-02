import { defaultClassNames } from '@constants/NotificationClassNames';
import { showNotification, updateNotification } from '@mantine/notifications';
import {
  IconAlertTriangle,
  IconCheck,
  IconInfoCircle,
  IconX,
} from '@tabler/icons-react';
import { v4 as uuidv4 } from 'uuid';

const radius = '10px';

export const newNotification = (params: any): string => {
  const id = uuidv4();
  showNotification({
    id,
    loading: true,
    classNames: defaultClassNames,
    withCloseButton: false,
    radius,
    ...params,
  });
  return id;
};
export const successNotification = (params: any): void => {
  updateNotification({
    color: 'green',
    icon: <IconCheck width={24} height={24} />,
    classNames: defaultClassNames,
    loading: false,
    withCloseButton: true,
    radius,
    ...params,
  });
};
export const errorNotification = (params: any): void => {
  updateNotification({
    color: 'red',
    icon: <IconX width={24} height={24} />,
    classNames: defaultClassNames,
    loading: false,
    withCloseButton: true,
    radius,
    ...params,
  });
};
export const infoNotification = (params: any): void => {
  updateNotification({
    color: 'blue',
    icon: <IconInfoCircle width={24} height={24} />,
    classNames: defaultClassNames,
    loading: false,
    withCloseButton: true,
    radius,
    ...params,
  });
};

export const warningNotification = (params: any): void => {
  updateNotification({
    color: 'white',
    icon: <IconAlertTriangle width={24} height={24} color={'var(--neutral)'} />,
    classNames: defaultClassNames,
    loading: false,
    withCloseButton: true,
    radius,
    ...params,
  });
};
