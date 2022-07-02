<script>
  import { createEventDispatcher } from 'svelte';
  
  import { authorizedUser, allUsers } from './stores.js';

  let userList;
  allUsers.subscribe(value => {
		userList = value;
	});
  
  const dispatch = createEventDispatcher();

  const createUser = (event) => {
    dispatch(
      'routeEvent',
      Object.fromEntries((new FormData(event.target)).entries()),
    )
  };

</script>

<section class="users">
  {#if userList.length}
    <ul class="user-list">
      {#each userList as user (user._id)}
      <li in:fly="{{ y: 50, duration: 500 }}" out:fade>
        <UserItem
          userId={user._id}
          userName={user.name}
          userLogin={user.login}
          isAdmin={user.admin}
          on:deleteUser={deleteCheckedUser}
        />
      </li>
      {/each}
    </ul>
  {/if}
  
</section>

<style>
  .users {
    display: flex;
  }

</style>
