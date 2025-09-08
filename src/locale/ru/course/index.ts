import { modals } from './modals';
import { list } from './list';
import { lesson } from './lesson';

export const course = {
  courseImage: 'Обложка курса',
  nextShortcut: 'Можете использовать сочетание клавиш ',
  prevShortcut: 'Можете использовать сочетание клавиш ',
  selectImagePreset: 'Выберите набор изображений',
  selectGroup: 'Выберите группу',
  presetName: 'Название набора',
  groupName: 'Название группы',
  presetNotFound: 'Набор не найден',
  groupNotFound: 'Группа не найдена',
  nameAndStructure: 'Название и структура',
  courseStructure: 'Структура курса',
  description: 'Описание',
  backToCoursesTip: 'Вернуться к списку курсов',
  backToCourseTip: 'Вернуться к курсу',
  backToCoursesButton: 'Назад к курсам',
  backToCourseButton: 'Назад к курсу',
  presentNameToLocale: (key: string) => {
    return (
      new Map<string, string>(
        Object.entries({
          math: 'Математика',
          networks: 'Сети',
          robotics: 'Робототехника',
          coworking: 'Командная работа',
          abstract: 'Абстрактные',
        })
      ).get(key.toLowerCase()) ?? key
    );
  },
  contents: (kind: 'unit' | 'course'): string => {
    if (kind === 'unit') return 'Содержание модуля';
    return 'Содержание курса';
  },
  modals,
  list,
  lesson,
};
