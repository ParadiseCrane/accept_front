import { FC, forwardRef, memo, useMemo } from 'react';
import styles from './assignmentSchemaSelector.module.css';
import { IAssignmentSchemaDisplay } from '@custom-types/data/IAssignmentSchema';
import { Select } from '@ui/basics';
import { useLocale } from '@hooks/useLocale';
import { Eye } from 'tabler-icons-react';
import { ActionIcon } from '@mantine/core';
import Link from 'next/link';

interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
  value: string;
  label: string;
}

const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
  ({ label, value, ...others }: ItemProps, ref) => (
    <div ref={ref} className={styles.item}>
      <div {...others} className={styles.itemLabel}>
        {label}
      </div>
      <div className={styles.itemIcon}>
        <Link href={`/edu/assignment_schema/${value}`}>
          <ActionIcon size="md">
            <Eye color={'var(--primary)'} />
          </ActionIcon>
        </Link>
      </div>
    </div>
  )
);

SelectItem.displayName = 'AssignmentSchemaSelectItem';

const AssignmentSchemaSelector: FC<{
  form: any;
  field: string;
  schemas: IAssignmentSchemaDisplay[];
}> = ({ form, schemas, field }) => {
  const { locale } = useLocale();

  const data = useMemo(
    () =>
      schemas.map((schema) => ({
        value: schema.spec,
        label: schema.title,
      })),
    [schemas]
  );

  return (
    <Select
      label={locale.ui.schemasSelector.label}
      data={data}
      searchable
      itemComponent={SelectItem}
      {...form.getInputProps(field)}
    />
  );
};

export default memo(AssignmentSchemaSelector);
