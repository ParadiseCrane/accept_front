export const validation = {
  name: (number: number) =>
    `Минимальное количество символов в названии группы - ${number}`,
  members: (number: number) =>
    `Минимальное количество участников в группе - ${number}`,
};
