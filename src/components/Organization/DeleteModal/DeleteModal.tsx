import { useLocale } from '@hooks/useLocale';
import { FC, memo, useCallback, useState } from 'react';
import { requestWithNotify } from '@utils/requestWithNotify';
import SimpleModal from '@ui/SimpleModal/SimpleModal';
import { Icon } from '@ui/basics';
import { IGroupDisplay } from '@custom-types/data/IGroup';
import { Trash } from 'tabler-icons-react';
import modalStyles from '@styles/ui/modal.module.css';
import SimpleButtonGroup from '@ui/SimpleButtonGroup/SimpleButtonGroup';
import { IOrganization } from '@custom-types/data/IOrganization';

const DeleteModal: FC<{
  organization: IOrganization;
}> = ({ organization }) => {
  // TODO: Mock
  const { locale, lang } = useLocale();

  const [active, setActive] = useState(false);

  const handleDelete = useCallback(() => {
    console.log('Lol it is just a Mock!');
    // requestWithNotify(
    //   `organization/delete/${organization.spec}`,
    //   'DELETE',
    //   locale.notify.group.delete,
    //   lang,
    //   (_: any) => '',
    //   undefined,
    //   () => setActive(false)
    // );
  }, [organization.spec, locale, lang]);

  return (
    <>
      <Icon color="red" size="xs" onClick={() => setActive(true)}>
        <Trash />
      </Icon>
      <SimpleModal
        opened={active}
        close={() => setActive(false)}
        hideCloseButton={true}
        title={locale.organization.modals.deletion}
      >
        <div className={modalStyles.verticalContent}>
          <div>
            {locale.organization.modals.delete + ` '${organization.name}' ?`}
          </div>
          <SimpleButtonGroup
            reversePositive
            actionButton={{
              label: locale.delete,
              onClick: handleDelete,
            }}
            cancelButton={{
              label: locale.cancel,
              onClick: () => setActive(false),
            }}
          />
        </div>
      </SimpleModal>
    </>
  );
};

export default memo(DeleteModal);
