<script>
  import { currentUser, userList, isPending } from './stores.js';
  import { onMount } from 'svelte';
  import { fly, fade } from 'svelte/transition';
  import Router from 'svelte-spa-router';
  import { location, push } from 'svelte-spa-router';
  import { RingLoader } from 'svelte-loading-spinners'


  import SigninForm from './SigninForm.svelte';
  import UserForm from './UserForm.svelte';
  import UserItem from './UserItem.svelte';
  import Users from './Users.svelte';
  import Summaries from './Summaries.svelte';

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

  let errorMessage = '';
  let userMessage;

  let deletedUserId;

  const routeEventHandler = (data) => {
    if ($location === '/signin') {
      signIn(data);
    }
    if ($location === '/signup') {
      createUser(data);
    }
    if ($location === '/users') {
      console.log('getUsers');
      getUsers(); 
    }
  }

  onMount(async () => {
    if (localStorage.getItem('ressoraLoggedIn')) {
      getUser();
      push('/data');
    } else {
      push('/signin');
    }
  })

  const createUser = async (params) => {
    try {
      isPending.update(p => p = true);
      await createNewUser(params.detail);
      getUsers();
    } catch (error) {
      errorMessage = showErrorMessage(error);
    } finally {
      isPending.update(p => p = false);
    }
  }

  const signIn = async (params) => {
    try {
      isPending.update(p => p = true);
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
      isPending.update(p => p = false);
    }
  }

  const logOut = async () => {
    try {
      push('/');
      isPending.update(p => p = true);
      const _id = $currentUser._id;
      localStorage.removeItem('ressoraLoggedIn');
      currentUser.set({
        _id: '',
        name: '',
        login: '',
        admin: null,
      });
      userList.set([]);
      fetchedUser = null;
      createdUser = null;
      const { data } = await logout({ _id });
      userMessage = data.message;
    } catch (error) {
      errorMessage = showErrorMessage(error);
    } finally {
      isPending.update(p => p = false);
    }
  }

  const getUsers = async () => {
    try {
      isPending.update(p => p = true);
      const { data } = await getAllUsers();
      userList.update(users => users = data);
    } catch (error) {
      errorMessage = showErrorMessage(error);
    } finally {
      isPending.update(p => p = false);
    }
  }

  const getUser = async () => {
    try {
      isPending.update(p => p = true);
      const { data } = await getCurrentUser();
      currentUser.update(user => user = data);
    } catch (error) {
      errorMessage = showErrorMessage(error);
    } finally {
      isPending.update(p => p = false);
    }
  };

  const deleteCheckedUser = async (event) => {
    deletedUserId = event.detail.userId;
    try {
      isPending.update(p => p = true);
      const { data } = await deleteUser({ userId: deletedUserId });
      userList.update(users => $userList.filter((user) => user._id !== data._id));
      deletedUserId = data._id;
    } catch (error) {
      errorMessage = showErrorMessage(error);
    } finally {
      isPending.update(p => p = false);
    }
  };

</script>

<header class="header">
  <a href="/" class="header__logo">ressora</a>
  <div class="header__nav-wrapper">
    <nav>
      {#if $currentUser._id && $location !== '/data' }
        <a href="/#/data" class="header__nav-link">Сводка</a>
      {/if}
      
      {#if $currentUser._id && $location !== '/users' }
        <a href="/#/users" class="header__nav-link">Пользователи</a>
      {/if}
      
      {#if $location !== '/signup' }
      <a href="/#/signup" class="header__nav-link">{$currentUser._id ? 'Создать пользователя' : 'Зарегистрироваться'}</a>
      {/if}

      {#if !$currentUser.name && $location !== '/signin' }
        <a href="/#/signin" class="header__nav-link">Войти</a>
      {/if}
    </nav>
    {#if $currentUser.name }
      <a href="/" class="header__nav-link" on:click|preventDefault={logOut}>Выйти</a>
    {/if}
    {#if $currentUser.name }
      <p class="header__user-name">{$currentUser.name || ''}</p>
      <span class="header__user-admin">{$currentUser.admin && 'админ'}</span>
    {/if}
  </div>
</header>

<main >
  {#if userMessage }
    userMessage: { userMessage }
  {/if}

  {#if $isPending }
    Loading...
  {/if}

  {#if errorMessage}
    errorMessage: { errorMessage }
  {/if}
  
  <Router
    routes={{
      '/signin': SigninForm,
      '/signup': UserForm,
      '/users': Users,
      '/data': Summaries,
    }}
    on:routeEvent={ routeEventHandler }
  />

</main>

{#if $isPending}
  <div class="spinner">
    <div class="spinner__wrapper">
      <RingLoader size="150" color="#FF3E00" unit="px" duration="2s"></RingLoader>
    </div>
  </div>
{/if}


<style>
  .spinner {
    position: absolute;
    display: flex;
    z-index: 10;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: black;
    opacity: 80%;
  }

  .spinner__wrapper {
    margin: 200px auto;
    font-size: 32px;
  }
  .header {
    display: flex;
    justify-content: space-between;
    max-width: 1280px;
    padding: 12px 32px;
    border-bottom: 1px solid grey;
  }

  .header__logo {
    margin: 0;
    color: red;
    text-transform: uppercase;
    text-decoration: none;

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

	.header__nav-wrapper {
    align-self: flex-end;
    display: flex;
    justify-content: space-between;
  }

  .header__nav-link {
    margin: 0 0 0 15px;
  }

  .header__user-name {
    margin: 0 0 0 15px;
    color: red;
  }

  .header__user-admin {
    margin: 0 0 0 4px;
    font-size: 9px;
  }
  
  @media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
