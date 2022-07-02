<script>
  import { onMount } from 'svelte';
  import { fly, fade } from 'svelte/transition';
  import Router from 'svelte-spa-router';
  import { location, push } from 'svelte-spa-router';

  import { authorizedUser, allUsers } from './stores.js';

  import SigninForm from './SigninForm.svelte';
  import UserForm from './UserForm.svelte';
  import UserItem from './UserItem.svelte';

  import { getErrorStatus, showErrorMessage } from './errors/error-handler';

  import {
  LOGIN_PASSWORD_ERR,
  JWT_ERROR,
} from './errors/messages-constants';

  import {
    createNewUser,
    getAllUsers,
    getCurrentUser,
    signin,
    logout,
    deleteUser,
  } from './apiCalls';
  
  let currentUser;
  authorizedUser.subscribe(value => {
		currentUser = value;
  });
  
  let userList;
  allUsers.subscribe(value => {
		userList = value;
	});

  let isPending = false;
  let errorMessage = '';
  let createdUser;
  let userMessage;
  let fetchedUser;

  let deletedUserId;

  let contextUser;

  const routeEventHandler = (data) => {
    if ($location === '/signin') {
      signIn(data);
    }
    if ($location === '/signup') {
      createUser(data);
    }
  }

  onMount(async () => {
    if (localStorage.getItem('ressoraLoggedIn')) {
      getUser();
      /* push($location); */
    } else {
      push('/signin');
    }
  })

  const clearMessages = () => {
    errorMessage = '';
    userMessage = '';
  };

  const createUser = async (params) => {
    try {
      clearMessages();
      isPending = true;
      const { data } = await createNewUser(params.detail);
      createdUser = data;
      await getUsers();
    } catch (error) {
      errorMessage = showErrorMessage(error);
    } finally {
      isPending = false;
    }
  }

  const signIn = async (params) => {
    try {
      clearMessages();
      isPending = true;
      const { data } = await signin(params.detail);
      userMessage = data.message;
      localStorage.setItem('ressoraLoggedIn', true);
      getUser();
    } catch (error) {
      if (getErrorStatus(error) === 401) {
        errorMessage = LOGIN_PASSWORD_ERR;
      } else if (getErrorStatus(error) === 400) {
        errorMessage = JWT_ERROR;
      } else {
        errorMessage = showErrorMessage(error);
      }
    } finally {
      isPending = false;
    }
  }

  const logOut = async () => {
    try {
      localStorage.removeItem('ressoraLoggedIn');
      allUsers.set([]);
      const _id = contextUser._id;
      authorizedUser.set({
        _id: '',
        name: '',
        login: '',
        admin: null,
      });
      fetchedUser = null;
      createdUser = null;
      clearMessages();
      isPending = true;
      const { data } = await logout({ _id });
      userMessage = data.message;
    } catch (error) {
      errorMessage = showErrorMessage(error);
    } finally {
      isPending = false;
    }
  }

  const getUsers = async () => {
    try {
      clearMessages();
      isPending = true;
      const { data } = await getAllUsers();
      allUsers.update(users => users = data);
    } catch (error) {
      errorMessage = showErrorMessage(error);
    } finally {
      isPending = false;
    }
  }

  const getUser = async () => {
    try {
      isPending = true;
      const { data } = await getCurrentUser();
      authorizedUser.update(user => user = data);
    } catch (error) {
      errorMessage = showErrorMessage(error);
    } finally {
      isPending = false;
    }
  };

  const deleteCheckedUser = async (event) => {
    deletedUserId = event.detail.userId;
    try {
      isPending = true;
      const { data } = await deleteUser({ userId: deletedUserId });
      allUsers.update(users => userList.filter((user) => user._id !== data._id));
      deletedUserId = data._id;
    } catch (error) {
      errorMessage = showErrorMessage(error);
    } finally {
      isPending = false;
    }
  };

</script>

<header class="header">
  <div class="header__nav-wrapper">
    <nav>
      {#if !currentUser.name && $location !== '/signin' }
        <a href="/#/signin" class="header__nav-link">Войти</a>
      {/if}
      {#if $location !== '/signup' }
        <a href="/#/signup" class="header__nav-link">Создать пользователя</a>
      {/if}
    </nav>
    {#if currentUser.name }
      <a href="/" class="header__nav-link" on:click|preventDefault={logOut}>Выйти</a>
    {/if}
  </div>
</header>

<main>
  <Router
    routes={{
      '/signin': SigninForm,
      '/signup': UserForm,
    }}
    on:routeEvent={ routeEventHandler }
  />

  {#if currentUser.name }
    <h1>Hello {currentUser.name || ''}!</h1>
  {/if}

  <button class="button" on:click={getUsers}>вывести всех пользователей</button>
  
  <section class="results">
    {#if userMessage }
      userMessage: { userMessage }
    {/if}

    {#if isPending }
      Loading...
    {/if}

    {#if errorMessage}
      errorMessage: { errorMessage }
    {:else}
      'No errors'
    {/if}

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

    {#if fetchedUser }
    <p class="fetched-user">fetchedUser: { JSON.stringify(fetchedUser) }</p>
    {/if}

    {#if createdUser }
      createdUser: { JSON.stringify(createdUser) }
    {/if}
  </section>

</main>

<style>
  .header {
    display: flex;
    justify-content: flex-end;
    max-width: 1280px;
    padding: 12px 32px;
  }

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

  ul {
    margin: 0;
    width: 100%;
    padding: 0;
    list-style: none;
  }

  .header__nav-wrapper {
    align-self: flex-end;
    display: flex;
    justify-content: space-between;
  }

  .header__nav-link {
    margin: 0 12px 0 0;
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
    padding: 12px;
    background-color: antiquewhite;
  }
  
  .fetched-user {
    width: 70%;
    word-break: break-word;
  }

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
