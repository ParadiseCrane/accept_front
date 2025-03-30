import { description } from './description';
import { form } from './form';
import { list } from './list';
import { modals } from './modals';
import { tests } from './tests';

export const task = {
  constraints: {
    time: 'Time',
    memory: 'Memory',
  },
  complexity: 'Complexity',
  description,
  send: 'Send',
  answer: 'Answer',
  results: 'Results',
  status: {
    error: 'Error on task submit',
    ok: 'Attempt successfully submitted',
  },
  submit: 'Submit',
  modals,
  list,
  form,
  tests,
};
