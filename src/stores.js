import { writable } from 'svelte/store';

export const currentUser = writable({
  _id: '',
  name: '',
  login: '',
  admin: null,
});

export const userList = writable([]);
