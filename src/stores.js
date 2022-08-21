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
  plan: {
    operation_list: operations,
  },
  fact: {
    operation_list: operations,
  },
  chartData: null,
});

export const previousSummary = writable({
  date: '',
  prod_line: 1,
  created_by: '',
  updated_by: '',
  plan: {
    operation_list: operations,
  },
  fact: {
    operation_list: operations,
  },
  chartData: null,
});

export const certainSummaryList = writable([]);

export const userList = writable([]);

export const isPending = writable(false);

export const chartData = writable({});

export const isInputModalOpen = writable(false);

export const inputDate = writable(null);

export const inputDateStart = writable(null);

export const inputDateEnd = writable(null);
