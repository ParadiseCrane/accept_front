import { ICourseAddEdit, IBaseTreeUnit } from '@custom-types/data/ICourse';
import { ILocale } from '@custom-types/ui/ILocale';
import { errorNotification, newNotification } from './notificationFunctions';

const getInitialValues = ({ title }: { title: string }): ICourseAddEdit => {
  return {
    title: title,
    description: '',
    kind: 'course',
    image: '',
    children: [],
  };
};

const checkCourseImageInvalidInput = ({
  image,
  locale,
}: {
  image: string;
  locale: ILocale;
}): boolean => {
  if (image.length === 0) {
    const id = newNotification({});
    errorNotification({
      id,
      title: locale.notify.group.courseConstructorValidation.image,
      autoClose: 1000,
    });
    return true;
  }
  return false;
};

const checkCourseDescriptionInvalidInput = ({
  description,
  locale,
}: {
  description: string;
  locale: ILocale;
}): boolean => {
  if (description.length === 0) {
    const id = newNotification({});
    errorNotification({
      id,
      title: locale.notify.group.courseConstructorValidation.description,
      autoClose: 1000,
    });
    return true;
  }
  return false;
};

const checkCourseTitleInvalidInput = ({
  title,
  locale,
}: {
  title: string;
  locale: ILocale;
}): boolean => {
  if (title.length === 0) {
    const id = newNotification({});
    errorNotification({
      id,
      title: locale.notify.group.courseConstructorValidation.title,
      autoClose: 1000,
    });
    return true;
  }
  return false;
};

const checkChildrenInvalidInput = ({
  children,
  locale,
}: {
  children: IBaseTreeUnit[];
  locale: ILocale;
}): boolean => {
  for (let i = 0; i < children.length; i++) {
    if (children[i].title.trim().length === 0) {
      const id = newNotification({});
      errorNotification({
        id,
        title: locale.notify.group.courseConstructorValidation.children,
        autoClose: 1000,
      });
      return true;
    }
  }
  return false;
};

const checkFormValidation = ({
  value,
  locale,
}: {
  value: boolean;
  locale: ILocale;
}): boolean => {
  if (value) {
    const id = newNotification({});
    errorNotification({
      id,
      title: locale.notify.group.validation.error,
      autoClose: 1000,
    });
    return true;
  }
  return false;
};

export const courseFromUtils = {
  getInitialValues,
  checkChildrenInvalidInput,
  checkCourseDescriptionInvalidInput,
  checkCourseImageInvalidInput,
  checkCourseTitleInvalidInput,
  checkFormValidation,
};
