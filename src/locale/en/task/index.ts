import { modals } from './modals';
import { description } from './description';
import { list } from './list';
import { form } from './form';
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
