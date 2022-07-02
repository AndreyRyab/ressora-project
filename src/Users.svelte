<script>
  import { userList } from './stores.js';
  import { createEventDispatcher, onMount } from 'svelte';
  import { fly, fade } from 'svelte/transition';

  import UserItem from './UserItem.svelte';
  
  const dispatch = createEventDispatcher();

  const getUsers = (event) => {
    dispatch('routeEvent')
  };

  onMount(async () => {
    if (localStorage.getItem('ressoraLoggedIn')) {
      getUsers();
    } else {
      push('/signin');
    }
  })

  /* on:deleteUser={deleteCheckedUser} */
</script>

<section class="users">
  <h1 class="users__title">Список всех пользователей</h1>
  
  {#if $userList.length}
    <ul class="users__user-list">
      {#each $userList as user (user._id)}
      <li in:fly="{{ y: 50, duration: 500 }}" out:fade>
        <UserItem
          userId={user._id}
          userName={user.name}
          userLogin={user.login}
          isAdmin={user.admin}
          
        />
      </li>
      {/each}
    </ul>
  {/if}
  
</section>

<style>
  .users {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-content: center;
  }

  .users__title {
    margin: 32px auto 24px;
    font-size: 28px;
  }

  .users__user-list {
    margin: 0 auto 0;
    width: 80%;
    padding: 12px;
    list-style: none;
    background-color: antiquewhite;
  }

</style>
