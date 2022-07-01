import { writable } from 'svelte/store';

export const authorizedUser = writable({
  _id: '',
  name: '',
  login: '',
  admin: null,
});

export const allUsers = writable([]);
