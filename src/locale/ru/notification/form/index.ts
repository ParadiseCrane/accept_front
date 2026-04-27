import { steps } from "./steps";
import { validate } from "./validate";

export const form = {
  steps,
  validate,
  title: "Заголовок",
  author: "Автор",
  shortDescription: "Краткое описание",
  description: "Описание",
  asSystem: "Отправить уведомления от имени системы",
  broadcast: "Отправить уведомление всем пользователям",
  preview: "Предпросмотр",
  previewHint:
    "Нажмите, чтобы активировать предпросмотр. Так будет выглядеть ваше уведомление для пользователей. Нажмите на него, чтобы открыть полное описание.",
};
