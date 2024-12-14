export interface IOrganization {
  spec: string;
  name: string;
  // expiration: Date; // TODO: Fix
  description: string;
  allowRegistration: boolean;
}
