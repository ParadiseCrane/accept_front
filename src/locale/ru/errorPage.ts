export const errorPage = {
  description: "Упс... Страница где-то потерялась!",
  returnToMain: "На главную",
  goBack: "Назад",
  forbidden: "У вас не достаточно прав для просмотра этой страницы",
  serverError: "Упс... Что-то не так с сервером :(",
  signInTitle: "Упс... Вам надо войти в аккаунт!",
  signIn: "Войти",
  getTitle: (code: number): string => {
    if (code === 401) {
      return errorPage.signInTitle;
    }
    if (code === 403) {
      return errorPage.forbidden;
    }
    if (code === 500) {
      return errorPage.serverError;
    }
    return errorPage.description;
  },
  getButtonTitle: (code: number): string => {
    if (code === 401) {
      return errorPage.signIn;
    }
    return errorPage.returnToMain;
  },
};
