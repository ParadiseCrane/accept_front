export const validation = {
  spec: (number: number) =>
    `Минимальное количество символов в spec организации - ${number}`,
  name: (number: number) =>
    `Минимальное количество символов в названии организации - ${number}`,
  description: 'Описание организации не должно быть пустым',
};
