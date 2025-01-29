import { steps } from './steps';
import { validation } from './validation';

export const form = {
  steps,
  validation,

  title: 'Название',
  complexity: 'Сложность (%)',
  description: 'Описание',
  inputFormat: 'Входные данные',
  outputFormat: 'Выходные данные',
  inputExample: 'Пример входных данных',
  outputExample: 'Пример выходных данных',
  grade: 'Класс',
  constraints: {
    title: 'Ограничения',
    time: 'Время (секунды)',
    memory: 'Память (Мб)',
  },
  checkTypes: ['Тесты', 'Чекер'],
  taskTypes: ['Задача со сдачей кода', 'Текстовая задача'],
  checkType: 'Тип тестирования',
  taskType: 'Тип задачи',
  checker: 'Чекер',
  hint: {
    title: 'Подсказка',
    alarmType: 'Вид триггера подсказки',
    hintAlarmTypes: ['Попытки', 'Время (минуты)'],
    text: 'Текст подсказки',
    showAfter: 'Показать подсказку после',
  },
  remark: 'Примечание',
  tests: 'Тесты',
  emptyTests: 'Добавьте тесты с помощью кнопки ниже или перетащите сюда файлы',
  inputTest: 'Входные данные',
  outputTest: 'Выходные данные',
  test: 'Тест',
  example: 'Пример',
  allowed: 'Разрешенные',
  forbidden: 'Запрещенные',
  restrictLanguages: 'Ограничить используемые языки',
};
