export const errors = {
  organization: {
    notSelected: 'Organization wasn\'t selected',
    exists: 'Incorrect organization',
  },
  login: {
    len: 'Login shorter than 5 symbols',
    symbols: 'Login includes invalid symbols',
    used: 'Login is already used',
    exists: 'Enter login',
  },
  password: {
    len: 'Password shorter than 5 symbols',
    symbols: 'Password can include only latin letters, numbers, dots',
    exists: 'Enter password',
  },
  name: {
    len: 'Name is too long',
    surname: 'You need to enter surname and name',
    short: 'Name is too short',
    invalid: 'Name contains invalid symbols',
  },
  surname: {
    short: 'Surname is too short',
    invalid: 'Surname contains invalid symbols',
  },
  patronymic: {
    invalid: 'Patronymic contains invalid symbols',
  },
  email: 'Email is incorrect',
  confirm: 'Passwords did not match',
  role: 'Select a role',
};
