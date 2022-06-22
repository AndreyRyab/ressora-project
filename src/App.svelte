<script>
  import SigninForm from './SigninForm.svelte';
  import UserForm from './UserForm.svelte'
  import { createNewUser, getAllUsers } from './apiCalls.js';

  
  const api = '/api/user';

  let isPending = false;
  let errorMessage = '';
  let createdUser;
  let users = [];
  let form;
  let userMessage;
  let fetchedUser;

  const createUser = async (data) => {
    try {
      isPending = true;
      form = data.detail;
      createNewUser(form).then(newUser => createdUser = newUser);
    } catch ({ message }) {
      throw new Error(message);
    } finally {
      isPending = false;
    }
  }

  const getUsers = async () => {
    try {
      isPending = true;
      getAllUsers().then(allUsers => users = allUsers);
    } catch ({ message }) {
      throw new Error(message);
    } finally {
      isPending = false;
    }
  }

  /* const createUser = async (data) => {
    isPending = true;
    form = data.detail;
    try {
      const res = await fetch(api, {
        body: JSON.stringify(form),
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      createdUser = await res.json();
    } catch ({ message }) {
      errorMessage = message;
    } finally {
      isPending = false;
    }
  } */

  const signin = async (data) => {
    isPending = true;
    form = { ...data.detail, method: 'signin' };
    try {
      const res = await fetch(api, {
        body: JSON.stringify(form),
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      userMessage = await res.json().message;
    } catch ({ message }) {
      errorMessage = message;
    } finally {
      isPending = false;
    }
  }

  const getCurrentUser = async (/* data */) => {
    isPending = true;
    form = { /* ...data.detail, */ method: 'getCurrentUser', userId: '62a7382aae887fa1bff6c41f', }; // TODO Remove hardcode
    try {
      const res = await fetch(api, {
        body: JSON.stringify(form),
        method: 'POST',
        /* headers: {
          'Content-Type': 'application/json',
        }, */
      });
      userMessage = await res.json().message;
    } catch ({ message }) {
      errorMessage = message;
    } finally {
      isPending = false;
    }
  }

  /* const getUsers = async () => {
    isPending = true;
    try {
      const res = await fetch(api, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      users = await res.json();
    } catch ({ message }) {
      errorMessage = message;
    } finally {
      isPending = false;
    }
  } */

</script>

<main>
  <h1>Hello Andrey!</h1>
  
  <button class="button" on:click={getCurrentUser}>get user</button>
  <button class="button" on:click={getUsers}>вывести всех пользователей</button>

  <section class="results">
    {#if isPending }
      Loading...
      {#if errorMessage}
        { errorMessage }
      {:else}
        'No errors'
      {/if}
    {:else}
      <ul>
        {#each users as user}
        <li>{ user.name }</li>
        {:else}
        <li>Empty list</li>
        {/each}
      </ul>
    {/if}
    {#if userMessage }
    userMessage: { userMessage }
    {/if}
    {#if fetchedUser }
    fetchedUser: { fetchedUser }
    {/if}
    {#if form }
    Form: { JSON.stringify(form) }
    {/if}
    {#if createdUser }
    createdUser: { JSON.stringify(createdUser) }
    {/if}
  </section>
  <section class="forms">
    <UserForm on:submitCreateUser={ createUser } />
    <SigninForm on:submitSignin={ signin } />
  </section>

</main>

<style>
	main {
    display: flex;
    flex-direction: column;
    align-items: center;
		margin: 0 auto;
		max-width: 240px;
		text-align: center;
		padding: 1em;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

  .button {
    margin-top: 24px;
    padding: 12px;
  }
  .results {
    display: flex;
    flex-direction: column;
    margin-top: 50px;
    width: 80%;
    min-height: 200px;
    background-color: antiquewhite;
  }

  .forms {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
  }

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
