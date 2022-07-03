<script>
  import { userList } from '../stores.js';
  import { createEventDispatcher, onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import { push } from 'svelte-spa-router';

  import UserItem from '../components/UserItem.svelte';
  import SignupForm from '../components/SignupForm.svelte';
  
  const dispatch = createEventDispatcher();

  const getUsers = () => {
    dispatch('routeEvent', { method: 'getUsers' });
  };

  const deleteUser = (data) => {
    dispatch('routeEvent', { userId: data.detail.userId, method: 'deleteUser' });
  };

  const createUser = (data) => {
    dispatch('routeEvent', { ...data.detail, method: 'createUser' });
  };
  
  onMount(async () => {
    if (localStorage.getItem('ressoraLoggedIn')) {
      getUsers();
    } else {
      push('/signin');
    }
  })

</script>

<section class="users" in:fade="{{duration: 500}}">
  <!-- <h1 class="users__title">Список всех пользователей</h1> -->

  <SignupForm on:createUser={createUser}/>
  
  {#if $userList.length}
    <ul class="users__user-list">
      {#each $userList as user (user._id)}
      <li in:fade="{{duration: 500}}">
        <UserItem
          userId={user._id}
          userName={user.name}
          userLogin={user.login}
          isAdmin={user.admin}
          on:deleteUser={deleteUser}
        />
      </li>
      {/each}
    </ul>
  {/if}
  
</section>

<style>
  .users {
    display: flex;
    gap: 18px;
    width: 100%;
  }

  .users__user-list {
    margin: 0 auto 0;
    width: 80%;
    padding: 12px;
    list-style: none;
  }

</style>
