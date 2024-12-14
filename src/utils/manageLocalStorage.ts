const organizationLocalStorageKey = 'organization_ls_key';

export const putOrganizationToLS = ({
  value,
}: {
  value: string | null | undefined;
}) => {
  if (value) localStorage.setItem(organizationLocalStorageKey, value);
  console.log('putOrganizationToLS', getOrganizationFromLS());
};

export const getOrganizationFromLS = (): string | null => {
  console.log(
    'getOrganizationFromLS',
    localStorage.getItem(organizationLocalStorageKey)
  );
  return localStorage.getItem(organizationLocalStorageKey);
};
