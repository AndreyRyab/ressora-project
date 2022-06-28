<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  const deleteUser = (event) => {
    dispatch('deleteUser', {
      userId,
    })
  };

  export let userName;
  export let userLogin;
  export let isAdmin;
  export let userId;

</script>

  <div class="user-item">
    <p class="user-item__role">{isAdmin ? 'Admin' : ''}</p>
    <p class="user-item__login">{userName}</p>
    <p class="user-item__name">{userLogin}</p>
    <button on:click={deleteUser}>delete</button>
  </div>

<style>
  .user-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-width: 90%;
    margin: 24px auto 0;
    border-radius: 5px;
    padding: 12px 18px;
    background-color: linen;
  }

  .user-item:last-of-type {
    margin-bottom: 24px;
  }

  .user-item:first-of-type {
    margin-top: 12px;
  }

  .user-item__login {
    min-width: 30%;
    color: indigo;
    text-transform: uppercase;
  }

  .user-item__name {
    min-width: 30%;
    color: indigo;
  }

  .user-item__role {
    min-width: 10%;
    color: indigo;
  }
</style>
