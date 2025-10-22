export const tiptap = {
  bold: "Жирный",
  italic: "Курсив",
  underline: "Подчеркнутый",
  striketrough: "Зачеркнутый",
  clearFormatting: "Сбросить форматирование",
  fontColor: "Изменить цвет шрифта",
  highlightColor: "Изменить цвет выделения",
  codeBlock: "Блок кода",
  latex: "Вставить LaTeX выражение",
  imageFile: "Загрузить изображение",
  imageURL: "Вставить изображение по URL",
  imageUploadFail: "Ошибка загрузки изображения",
  imageAltTitle: "Загруженное изображение",
  headings: "Заголовки",
  heading1: "Заголовок 1",
  heading2: "Заголовок 2",
  heading3: "Заголовок 3",
  heading4: "Заголовок 4",
  callout: "Выноска",
  quote: "Цитата",
  bulletList: "Маркированный список",
  orderedList: "Упорядоченный список",
  subscript: "Подстрочный",
  superscript: "Надстрочный",
  setLink: "Добавить ссылку",
  removeLink: "Убрать ссылку",
  align: "Выравнивание",
  alignLeft: "Выравнивание по левому краю",
  alignCenter: "Выравнивание по центру",
  alignRight: "Выравнивание по правому краю",
  alignJustify: "Выравнивание по ширине",
  undo: "Отменить изменения",
  redo: "Вернуть изменения",
  defaultLanguage: "По умолчанию",
  language: "Язык программирования",
  chooseProgrammingLanguage: "Выберите язык программирования",
  chooseCalloutType: "Выберите тип выноски",
  enterCalloutTitle: "Введите заголовок выноски (опционально)",
  calloutDefaultContent: "Введите текст",
  getCalloutTitleByType: (type: string) => {
    switch (type) {
      case "warning":
        return "Внимание";
      case "tip":
        return "Подсказка";
      case "remark":
        return "Замечание";
      case "danger":
        return "Опасность";
      default:
        return "Внимание";
    }
  },
  insert: "Вставить",
  close: "Закрыть",
  block: "В виде блока",
  inline: "Встроенный",
};
