export const errorPage = {
  description: "Oops... Page is not found!",
  returnToMain: "To main page",
  goBack: "Go back",
  forbidden: "You do not have enough rights for this page",
  serverError: "Oops... Some thing wrong with server :(",
  signInTitle: "Oops... You need to login!",
  signIn: "Sign in",
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
