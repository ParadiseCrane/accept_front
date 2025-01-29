import { IUserDisplay } from '@custom-types/data/IUser';
import React, { ComponentPropsWithoutRef, FC, memo } from 'react';

import UserMultiSelect from './UserMultiSelect';
import UserSingleSelect from './UserSingleSelect';

export interface UserItemProps extends ComponentPropsWithoutRef<'div'> {
  login: string;
  label: string;
  role: string;
  value: string;
}

export interface UserSelectProps {
  label: string;
  placeholder: string;
  nothingFound: string;
  users: IUserDisplay[];
  select: (_: IUserDisplay[] | undefined) => void;
  additionalProps?: any;
  multiple?: boolean;
}

const UserSelect: FC<UserSelectProps> = ({ multiple, ...props }) => {
  if (multiple) return <UserMultiSelect {...props} />;
  return <UserSingleSelect {...props} />;
};

export default memo(UserSelect);
