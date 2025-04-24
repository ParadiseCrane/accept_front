import { IParticipant, IUserDisplay } from '@custom-types/data/IUser';
import React, { ComponentPropsWithoutRef, FC, memo, ReactNode } from 'react';

import UserMultiSelect from './UserMultiSelect';
import UserSingleSelect from './UserSingleSelect';
import { ComboboxItem, ComboboxLikeRenderOptionInput } from '@mantine/core';

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
  users: IParticipant[] | IUserDisplay[];
  select: (_: IParticipant[] | IUserDisplay[] | undefined) => void;
  additionalProps?: any;
  multiple?: boolean;
  renderOption?:
    | ((item: ComboboxLikeRenderOptionInput<ComboboxItem>) => ReactNode)
    | undefined;
}

const UserSelect: FC<UserSelectProps> = ({ multiple, ...props }) => {
  if (multiple) return <UserMultiSelect {...props} />;
  return <UserSingleSelect {...props} />;
};

export default memo(UserSelect);
