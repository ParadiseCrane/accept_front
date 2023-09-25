import { DefaultLayout } from '@layouts/DefaultLayout';
import Title from '@ui/Title/Title';
import { ReactElement, useCallback } from 'react';
import styles from '@styles/feedback.module.css';
import { useForm } from '@mantine/form';
import {
  IFeedbackMessage,
  feedbackSubjects,
} from '@custom-types/data/IFeedbackMessage';
import { useLocale } from '@hooks/useLocale';
import { Button, CustomEditor, Select, TextInput } from '@ui/basics';
import {
  errorNotification,
  newNotification,
} from '@utils/notificationFunctions';
import { useUser } from '@hooks/useUser';
import { timezoneDate } from '@utils/datetime';
import { requestWithNotify } from '@utils/requestWithNotify';
import Contacts from '@ui/Contacts/Contacts';

export function Feedback() {
  const { locale, lang } = useLocale();

  const { user } = useUser();

  const form = useForm({
    initialValues: {
      spec: '',
      author: '',
      message: '',
      title: '',
      subject: 'bug',
      date: new Date(),
      reviewed: false,
    } as IFeedbackMessage,
    validate: {
      subject: (value) =>
        value.length == 0
          ? locale.feedback.form.validation.subject
          : null,
      message: (value) =>
        value.length < 5
          ? locale.feedback.form.validation.message
          : null,
      title: (value) =>
        value.length < 5
          ? locale.feedback.form.validation.title
          : null,
    },
    validateInputOnBlur: true,
  });

  const handleSubmit = useCallback(() => {
    if (form.validate().hasErrors) {
      const id = newNotification({});
      errorNotification({
        id,
        title: locale.notify.feedback.validation.error,
        autoClose: 5000,
      });
      return;
    }

    const message: IFeedbackMessage = {
      ...form.values,
      spec: '',
      author: user?.login || 'anonymous',
      date: timezoneDate(new Date()),
    };
    requestWithNotify<IFeedbackMessage, boolean>(
      'feedback/add',
      'POST',
      locale.notify.feedback.send,
      lang,
      () => '',
      message
    );
  }, [form, lang, locale, user?.login]);

  return (
    <>
      <Title title={locale.titles.feedback} />
      <div className={styles.wrapper}>
        <Contacts />
        <div
          className={`${styles.section} ${styles.feedbackWrapper}`}
        >
          <div className={styles.title}>
            {locale.feedback.feedback.title}
          </div>
          <div className={styles.form}>
            <Select
              label={locale.feedback.form.subject}
              data={feedbackSubjects.map((item) => ({
                label: locale.feedback.subjects[item],
                value: item,
              }))}
              {...form.getInputProps('subject')}
            />
            <TextInput
              label={locale.feedback.form.title}
              name={'title'}
              {...form.getInputProps('title')}
            />
            <CustomEditor
              label={locale.feedback.form.message}
              form={form}
              name={'message'}
            />
            <div className={styles.buttonWrapper}>
              <Button
                disabled={!form.isValid()}
                onClick={handleSubmit}
              >
                {locale.send}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

Feedback.getLayout = (page: ReactElement) => {
  return <DefaultLayout>{page}</DefaultLayout>;
};
export default Feedback;
