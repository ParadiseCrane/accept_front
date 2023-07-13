import { callback } from '@custom-types/ui/atomic';
import { Trash } from 'tabler-icons-react';
import { FC, ReactNode, memo } from 'react';
import styles from './listItem.module.css';
import inputStyles from '@styles/ui/input.module.css';
import { Icon, TextArea } from '@ui/basics';

const ListItem: FC<{
  label: string;
  inLabel: string;
  outLabel: string;
  form: any;
  index: number;
  field: string;
  openInputNewTab: ReactNode;
  openOutputNewTab: ReactNode;
  maxRows?: number;
  minRows?: number;
  hideInput?: boolean;
  hideOutput?: boolean;
  onDelete?: callback<number, void>;
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
  field,
  readonly,
  classNames,
  shrink,
  openInputNewTab,
  openOutputNewTab,
}) => {
  return (
    <div
      className={`${styles.wrapper} ${
        shrink ? inputStyles.shrink : ''
      }`}
    >
      <div className={`${styles.label} ${inputStyles.label}`}>
        {label}
        {onDelete && (
          <Icon
            onClick={() => onDelete(index)}
            color="red"
            variant="transparent"
            size="xs"
          >
            <Trash />
          </Icon>
        )}
      </div>
      <div className={styles.example}>
        {!hideInput && (
          <TextArea
            monospace
            autosize
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
            value={form.values[field][index]['inputData']}
            onBlur={() =>
              readonly ? undefined : form.validateField(field)
            }
            onChange={
              readonly
                ? undefined
                : (e) => {
                    form.values[field][index]['inputData'] =
                      e.target.value;
                    form.setFieldValue(field, form.values[field]);
                  }
            }
          />
        )}
        {!hideOutput && (
          <TextArea
            monospace
            autosize
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
            value={form.values[field][index]['outputData']}
            onBlur={
              readonly ? undefined : () => form.validateField(field)
            }
            onChange={
              readonly
                ? undefined
                : (e) => {
                    form.values[field][index]['outputData'] =
                      e.target.value;
                    form.setFieldValue(field, form.values[field]);
                  }
            }
          />
        )}
      </div>
    </div>
  );
};

export default memo(ListItem);
