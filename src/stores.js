import { writable } from 'svelte/store';

import { operations } from './data.js';

export const currentUser = writable({
  _id: '',
  name: '',
  login: '',
  admin: null,
});

export const currentSummary = writable({
  date: '',
  prod_line: 1,
  created_by: '',
  updated_by: '',
  plan:  {
    operation_list: operations,
  },
  fact: {
    operation_list: operations,
  },
});

export const fetchedSummaryList = writable([]);

export const userList = writable([]);

export const isPending = writable(false);
