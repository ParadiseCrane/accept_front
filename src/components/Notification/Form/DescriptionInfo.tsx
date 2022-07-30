import { FC, memo } from 'react';
import { CustomEditor, TextInput } from '@ui/basics';
import { useLocale } from '@hooks/useLocale';
import stepperStyles from '@styles/ui/stepper.module.css';

const DescriptionInfo: FC<{ form: any }> = ({ form }) => {
  const { locale } = useLocale();
  return (
    <>
      <TextInput
        label={locale.notification.form.shortDescription}
        onBlur={() => {
          form.validateField('shortDescription');
        }}
        helperContent={
          <div>
            {locale.helpers.notification.shortDescription.map(
              (p, idx) => (
                <p key={idx}>{p}</p>
              )
            )}
          </div>
        }
        {...form.getInputProps('shortDescription')}
      />
      <CustomEditor
        classNames={{
          label: stepperStyles.label,
        }}
        helperContent={
          <div>
            {locale.helpers.notification.description.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>
        }
        label={locale.notification.form.description}
        form={form}
        name={'description'}
      />
    </>
  );
};

export default memo(DescriptionInfo);
