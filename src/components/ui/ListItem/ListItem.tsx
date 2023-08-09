import { callback } from '@custom-types/ui/atomic';
import { Trash } from 'tabler-icons-react';
import { ChangeEvent, FC, ReactNode, memo } from 'react';
import styles from './listItem.module.css';
import inputStyles from '@styles/ui/input.module.css';
import { Icon } from '@ui/basics';
import TestArea from '@ui/TestArea/TestArea';
import { ITaskTestData } from '@custom-types/data/atomic';

const ListItem: FC<{
  label: string;
  inLabel: string;
  outLabel: string;
  form?: any;
  field?: string;
  values?: ITaskTestData[];
  index: number;
  openInputNewTab: ReactNode;
  openOutputNewTab: ReactNode;
  maxRows?: number;
  minRows?: number;
  hideInput?: boolean;
  hideOutput?: boolean;
  onDelete?: callback<number, void>;
  additionalActions?: ReactNode[];
  readonly?: boolean;
  classNames?: any;
  shrink?: boolean;
}> = ({
  label,
  inLabel,
  hideInput,
  hideOutput,
  maxRows,
  minRows,
  outLabel,
  index,
  onDelete,
  form,
  field = '',
  readonly,
  additionalActions,
  classNames,
  shrink,
  openInputNewTab,
  openOutputNewTab,
  values,
}) => {
  return (
    <div
      className={`${styles.wrapper} ${
        shrink ? inputStyles.shrink : ''
      }`}
    >
      <div className={`${styles.label} ${inputStyles.label}`}>
        {label}
        <div className={styles.actions}>
          {!!onDelete && (
            <Icon
              onClick={() => onDelete(index)}
              color="red"
              variant="transparent"
              size="xs"
            >
              <Trash />
            </Icon>
          )}
          {!!additionalActions &&
            additionalActions.map((actionNode) => actionNode)}
        </div>
      </div>
      <div className={styles.example}>
        {!hideInput && (
          <TestArea
            readonly={readonly}
            label={
              <div
                className={`${styles.label} ${inputStyles.subLabel} ${classNames?.label}`}
              >
                {inLabel}
                {openInputNewTab}
              </div>
            }
            minRows={minRows || 2}
            maxRows={maxRows}
            value={
              readonly && values
                ? values[index].inputData
                : form.values[field][index]['inputData']
            }
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
              if (!readonly) {
                form.values[field][index]['inputData'] =
                  e.target.value;
                form.setFieldValue(field, form.values[field]);
              }
            }}
            validateField={() =>
              readonly ? undefined : form.validateField(field)
            }
          />
        )}
        {!hideOutput && (
          <TestArea
            readonly={readonly}
            label={
              <div
                className={`${styles.label} ${inputStyles.subLabel} ${classNames?.label}`}
              >
                {outLabel}
                {openOutputNewTab}
              </div>
            }
            minRows={minRows || 2}
            maxRows={maxRows}
            value={
              readonly && values
                ? values[index].outputData
                : form.values[field][index]['outputData']
            }
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
              if (!readonly) {
                form.values[field][index]['outputData'] =
                  e.target.value;
                form.setFieldValue(field, form.values[field]);
              }
            }}
            validateField={() =>
              readonly ? undefined : form.validateField(field)
            }
          />
        )}
      </div>
    </div>
  );
};

export default memo(ListItem);
