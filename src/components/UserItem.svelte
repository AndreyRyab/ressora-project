<script>
  import { createEventDispatcher } from 'svelte';
  import { isPending } from '../stores.js';
  import { fade } from 'svelte/transition';

  import DeleteIcon from '../images/delete-icon.svg';

  export let userName;
  export let userLogin;
  export let isAdmin;
  export let userId;

  const dispatch = createEventDispatcher();

  const deleteUser = (event) => {
    dispatch('deleteUser', {
      userId,
    })
  };

</script>

<div class="user-item" in:fade="{{duration: 500}}">
  <p class="user-item__role">{isAdmin ? 'админ' : ''}</p>
  <p class="user-item__login">{userName}</p>
  <p class="user-item__name">{userLogin}</p>
<button disabled={$isPending} class="button" on:click={deleteUser}><DeleteIcon/></button>
</div>

<style>
  .user-item {
    display: flex;
    gap: 10px;
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
    color: #07080f;
    text-transform: uppercase;
  }

  .user-item__name {
    min-width: 30%;
    color: #07080f;
  }

  .user-item__role {
    min-width: 10%;
    color: grey;
    font-size: 10px;
  }

  .button {
    margin: 0;
    padding: 10px 13px;
    border: none;
    background-color: #ff6969;
  }

  .button:hover {
    cursor: pointer;
  }

</style>
