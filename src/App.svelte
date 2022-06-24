<script>
  import SigninForm from './SigninForm.svelte';
  import UserForm from './UserForm.svelte'
  import {
    createNewUser,
    getAllUsers,
    getCurrentUser,
    signin,
    logout,
  } from './apiCalls.js';

  
  const api = '/api/user';

  let isPending = false;
  let errorMessage = '';
  let createdUser;
  let users = [];
  let form;
  let userMessage;
  let fetchedUser;

  const createUser = async (form) => {
    try {
      isPending = true;
      const { data } = await createNewUser(form.detail)/* .then(newUser => createdUser = newUser) */;
      createdUser = data;
    } catch ({ message }) {
      errorMessage = message;
      throw new Error(message);
    } finally {
      isPending = false;
    }
  }

  const signIn = async (form) => {
    try {
      isPending = true;
      const { data } = await signin(form.detail);
      userMessage = data.message;
    } catch ({ message }) {
      errorMessage = message;
      throw new Error(message);
    } finally {
      isPending = false;
    }
  }

  const logOut = async (form) => {
    try {
      isPending = true;
      const { data } = await logout(/* form.detail */{ userId: '62a7382aae887fa1bff6c41f' });
      userMessage = data.message;
    } catch ({ message }) {
      errorMessage = message;
      throw new Error(message);
    } finally {
      isPending = false;
    }
  }

  const getUsers = async () => {
    try {
      isPending = true;
      const { data } = await getAllUsers();
      users = data;
    } catch ({ message }) {
      errorMessage = message;
      throw new Error(message);
    } finally {
      isPending = false;
    }
  }

  const getUser = async (/* { userId: '???' } */) => {
    try {
      isPending = true;
      const { data } = await getCurrentUser({ userId: '62a7382aae887fa1bff6c41f' });
      fetchedUser = data;
    } catch ({ message }) {
      errorMessage = message;
      throw new Error(message);
    } finally {
      isPending = false;
    }
  };

</script>

<main>
  <h1>Hello Andrey!</h1>
  
  <button class="button" on:click={getUser}>get user</button>
  <button class="button" on:click={getUsers}>вывести всех пользователей</button>
  <button class="button" on:click={logOut}>logOut</button>
  
  <section class="results">
    {#if userMessage }
    userMessage: { userMessage }
    {/if}
    {#if isPending }
      Loading...
      {#if errorMessage}
        { errorMessage }
      {:else}
        'No errors'
      {/if}
    {/if}
    {#if users.length}
      <ul>
        {#each users as user}
        <li>{ user.name }</li>
        {/each}
      </ul>
    {/if}
    {#if fetchedUser }
    <p class="fetched-user">fetchedUser: { JSON.stringify(fetchedUser) }</p>
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
    <SigninForm on:submitSignin={ signIn } />
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
    flex-wrap: wrap;
    margin-top: 50px;
    width: 80%;
    min-height: 200px;
    background-color: antiquewhite;
  }
  
  .fetched-user {
    width: 70%;
    word-break: break-word;
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
