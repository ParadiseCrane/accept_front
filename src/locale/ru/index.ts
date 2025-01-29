import { accounts } from './accounts';
import { assignment } from './assignment';
import { assignmentSchema } from './assignmentSchema';
import { attempt } from './attempt';
import { auth } from './auth';
import { contacts } from './contacts';
import { course } from './course';
import { dashboard } from './dashboard';
import { date, months } from './date';
import { errorPage } from './errorPage';
import { executor } from './executor';
import { feedback } from './feedback';
import { form, placeholders } from './form';
import { grade } from './grade';
import { group } from './group';
import { helpers } from './helpers';
import { credentials, mainHeaderLinks } from './layout';
import { notification } from './notification';
import { notify } from './notify';
import { organization } from './organization';
import { profile } from './profile';
import { projects } from './projects';
import { rating } from './rating';
import { student } from './student';
import { tag } from './tag';
import { task } from './task';
import { team } from './team';
import { timer } from './timer';
import { tip } from './tip';
import { tiptap } from './tiptap/tiptap';
import { titles } from './titles';
import { todo } from './todo';
import { tournament } from './tournament';
import { ui } from './ui';
import { user } from './user';
import { users } from './users';

const ru = {
  accept: 'Accept',
  loading: 'Загрузка',
  download: 'Скачать',
  name: 'Название',
  save: 'Сохранить',
  delete: 'Удалить',
  close: 'Закрыть',
  cancel: 'Отмена',
  yes: 'Да',
  no: 'Нет',
  sure: 'Вы уверены?',
  error: 'Ошибка',
  success: 'Успешно',
  language: 'Язык',
  add: 'Добавить',
  all: 'Все',
  create: 'Создать',
  edit: 'Изменить',
  ban: 'Забанить',
  unban: 'Разбанить',
  toList: 'К списку',
  toTournaments: 'К турнирам',
  validationError: 'Ошибка валидации',
  jsonValidationError: 'Некорректный JSON',
  yourProfile: 'Ваш профиль',
  copy: {
    label: 'Копировать',
    done: 'Скопировано!',
  },
  newTab: 'Открыть в новой вкладке',
  new: 'New',
  email: 'Почта',
  total: 'Всего',
  send: 'Отправить',
  reset: 'Сбросить',
  assignmentSchema,
  assignment,
  user,
  attempt,
  dashboard,
  group,
  placeholders,
  profile,
  credentials,
  mainHeaderLinks,
  notification,
  projects,
  date,
  months,
  auth,
  task,
  form,
  users,
  notify,
  errorPage,
  tournament,
  ui,
  helpers,
  tag,
  timer,
  student,
  grade,
  titles,
  todo,
  rating,
  feedback,
  contacts,
  executor,
  tip,
  team,
  accounts,
  organization,
  tiptap,
  course,
};

export default ru;
