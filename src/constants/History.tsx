import { HistoryItem } from '@custom-types/ui/basics/timeline';

const oldHistory: HistoryItem[] = [
  {
    title: 'Accept v1.0',
    content: 'Начало работы над проектом',
    date: '20.12.2020',
    type: 'new',
    version: 1,
  },
  {
    title: 'Чекер',
    content: 'Первая версия чекера тестов на языке JS',
    date: '21.12.2020',
    type: 'new',
    version: 1,
  },
  {
    title: 'Авторизация',
    content: 'Возможность авторизации',
    date: '28.12.2020',
    type: 'new',
    version: 1,
  },
  {
    title: 'Задачи',
    content:
      'Возможность добавлять, редактировать и удалять задачи. Список задач',
    date: '07.01.2021',
    type: 'new',
    version: 1,
  },
  {
    title: 'Чекер v2',
    content: 'Обновленная версия чекера на языке Python',
    date: '11.01.2021',
    type: 'update',
    version: 1,
  },
  {
    title: 'Уроки',
    content: 'Добавление, редактирование и удаление',
    date: '13.01.2021',
    type: 'update',
    version: 1,
  },
  {
    title: 'Рефакторинг кода',
    content:
      'Исправлены серьёзные баги, обновлены скрипты. Изменён парсер для чекера',
    date: '18.01.2021',
    type: 'bugfix',
    version: 1,
  },
  {
    title: 'Чекер v3',
    content: 'Разделение чекера на модули',
    date: '21.01.2021',
    type: 'update',
    version: 1,
  },
  {
    title: 'Ребрендинг',
    content:
      'Замена шапки сайты на боковую панель. Разработано лого и название',
    date: '08.03.2021',
    type: 'style',
    version: 1,
  },
  {
    title: 'Турниры',
    content:
      'Добавление, редактирование и удаление. В турнирах добавлены чат и таймер',
    date: '29.03.2021',
    type: 'new',
    version: 1,
  },
  {
    title: 'Чекер',
    content: 'Новые опции: Java, C++ и Pypy',
    date: '31.03.2021',
    type: 'update',
    version: 1,
  },
  {
    title: 'Реструктуризация',
    content:
      'Рейтинг. Возможность отправлять решения файлом и загружать тесты архивом. Динамическое обновление результатов задач. Исправлены баги, изменена структура сайта',
    date: '02.06.2021',
    type: 'update',
    version: 1,
  },
  {
    title: 'Контрольные уроки',
    content:
      'Защита сессий, добавление контрольных уроков - уроков ограниченных по времени',
    date: '08.06.2021',
    type: 'new',
    version: 1,
  },
  {
    title: 'Панель управления',
    content:
      'Возможность удалённого администрирования системы, руководство для учителей и администраторов',
    date: '24.06.2021',
    type: 'new',
    version: 1,
  },
];

const newHistory: HistoryItem[] = [
  {
    title: 'Accept v2.0',
    content: 'Начало работы над проектом',
    date: '16.02.2022',
    type: 'new',
    version: 2,
  },
  {
    title: 'Задачи',
    content:
      'Набросок архитектуры задач: добавление, редактирование и удаление. Теги, выбор языков, отправка решений',
    date: '29.03.2022',
    type: 'new',
    version: 2,
  },
  {
    title: 'Схемы уроков',
    content: 'Добавление, редактирование и удаление схем уроков',
    date: '11.04.2022',
    type: 'new',
    version: 2,
  },
  {
    title: 'Пользователи',
    content:
      'Список пользователей, группы, авторизация и  набросок уведомлений',
    date: '01.05.2022',
    type: 'new',
    version: 2,
  },
  {
    title: 'Задачи',
    content:
      'Валидация форм, вспомогательные сообщения, соответствующие описания и загрузка тестов архивом',
    date: '24.07.2022',
    type: 'update',
    version: 2,
  },
  {
    title: 'Уведомления',
    content: 'Список и создание уведомлений. Меню профиля',
    date: '29.07.2022',
    type: 'update',
    version: 2,
  },
  {
    title: 'Задачи',
    content:
      'Панель навигации между задачами на уроках. Текстовые задачи',
    date: '27.08.2022',
    type: 'style',
    version: 2,
  },
  {
    title: 'Управление уроком',
    content: 'Учительская панель для контроля урока',
    date: '06.09.2022',
    type: 'new',
    version: 2,
  },
  {
    title: 'Контроль доступа',
    content: 'Проверка ролей и соответствующие ограничения',
    date: '12.09.2022',
    type: 'new',
    version: 2,
  },
  {
    title: 'Турниры',
    content:
      'Добавление, редактирование и удаление турниров. Бан задач и пользователей. Список турниров и панель управления',
    date: '27.10.2022',
    type: 'new',
    version: 2,
  },
  {
    title: 'Исправление багов',
    content: 'Исправление ошибок, обновление библиотек',
    date: '19.01.2023',
    type: 'bugfix',
    version: 2,
  },
  {
    title: 'Профиль',
    content:
      'Рейтинг, инициализация чата из панели управления. Статистика в профиле',
    date: '28.01.2023',
    type: 'update',
    version: 2,
  },
  {
    title: 'О нас',
    content: 'Страница "О нас" и форма обратной связи',
    date: '31.01.2023',
    type: 'new',
    version: 2,
  },
  {
    title: 'Панель разработчика',
    content:
      'Менеджмент уведомлений и обратной связи, взаимодействие с базой данных',
    date: '14.02.2023',
    type: 'new',
    version: 2,
  },
  {
    title: 'Уведомления и чат',
    content:
      'Улучшена оптимизация уведомлений и чата. Улучшены протоколы безопасности',
    date: '05.04.2023',
    type: 'bugfix',
    version: 2,
  },
  {
    title: 'Группы тестов',
    content: 'Улучшена система тестов, добавлены группы тестов',
    date: '09.08.2023',
    type: 'new',
    version: 2,
  },
  {
    title: 'Новые виды турниров',
    content: 'Командные и закрытые турниры',
    date: '22.09.2023',
    type: 'new',
    version: 2,
  },
  {
    title: 'Пользовательские настройки',
    content: 'Настройки приватности профиля, интерфейса',
    date: '--',
    type: 'soon',
    version: 2,
  },
];

export const projectHistory: HistoryItem[] =
  oldHistory.concat(newHistory);
