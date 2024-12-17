const organizationLocalStorageKey = 'organization_ls_key';

export const putOrganizationToLS = ({
  value,
}: {
  value: string | null | undefined;
}) => {
  if (value) localStorage.setItem(organizationLocalStorageKey, value);
};

export const getOrganizationFromLS = (): string | null => {
  return localStorage.getItem(organizationLocalStorageKey);
};
