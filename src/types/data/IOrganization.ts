import { ReactNode } from 'react';

export interface IOrganization {
  spec: string;
  name: string;
  // expiration: Date; // TODO: Fix
  description: string;
  allowRegistration: boolean;
}

export interface IItem {
  // TODO: Move somewhere
  value: any;
  display: string | ReactNode;
}

export interface IOrganizationList
  extends Omit<IOrganization, 'name' | 'allowRegistration'> {
  name: IItem;
  allowRegistration: IItem;
}
