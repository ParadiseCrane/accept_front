import { useLocale } from '@hooks/useLocale';
import { CustomEditor, TextInput } from '@ui/basics';
import { FC, memo } from 'react';

const DescriptionInfo: FC<{ form: any }> = ({ form }) => {
  const { locale } = useLocale();
  return (
    <>
      <TextInput
        label={locale.notification.form.shortDescription}
        helperContent={
          <div>
            {locale.helpers.notification.shortDescription.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>
        }
        {...form.getInputProps('shortDescription')}
      />
      <CustomEditor
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
