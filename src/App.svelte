<script>
  import { currentUser, userList, isPending } from './stores.js';
  import { onMount } from 'svelte';
  import Router from 'svelte-spa-router';
  import { location, push } from 'svelte-spa-router';
  import { RingLoader } from 'svelte-loading-spinners'


  import Signin from './pages/Signin.svelte';
  import Signup from './pages/Signup.svelte';
  import Users from './pages/Users.svelte';
  import Summaries from './pages/Summaries.svelte';

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

  const routeEventHandler = (data) => {
    if (data.detail.method === 'signin') {
      signIn(data);
    }
    if (data.detail.method === 'getUsers') {
      getUsers();
    }
    if (data.detail.method === 'deleteUser') {
      deleteCheckedUser(data.detail.userId);
    }
    if (data.detail.method === 'createUser') {
      createUser(data.detail);
    }
  }

  /* onMount(async () => {
    if (localStorage.getItem('ressoraLoggedIn')) {
      await getUser();
    } else {
      push('/signin');
    }
  }) */

  const createUser = async (params) => {
    try {
      isPending.update(p => p = true);
      await createNewUser(params);
      if ($location !== '/users') {
        push('/users');
      }
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
      loggedIn = true;
      push('/data');
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
      push('/signin');
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
      const { data } = await logout({ _id });
      loggedIn = false;
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

  const deleteCheckedUser = async (userId) => {
    try {
      isPending.update(p => p = true);
      const { data } = await deleteUser({ userId });
      userList.update(users => $userList.filter((user) => user._id !== data._id));
      deletedUserId = data._id;
    } catch (error) {
      errorMessage = showErrorMessage(error);
    } finally {
      isPending.update(p => p = false);
    }
  };

</script>

<body>
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

        <!-- {#if !loggedIn }
          <a href="/#/signin" class="header__nav-link">Войти</a>
        {/if} -->
      </nav>

      {#if $currentUser.name }
      <p class="header__user-name">{$currentUser.name || ''}</p>
      
      <span class="header__user-admin">{$currentUser.admin ? 'админ' : ''}</span>
      
      <a href="/" class="header__nav-link" on:click|preventDefault={logOut}>Выйти</a>
      {/if}
    </div>
  </header>

  <main>
    <!-- {#if userMessage }
      userMessage: { userMessage }
    {/if}

    {#if $isPending }
      Loading...
    {/if}

     -->
    {#if errorMessage}
      { errorMessage }
    {/if}
    
    <Router
      routes={{
        '/signin': Signin,
        '/signup': Signup,
        '/users': Users,
        '/data': Summaries,
      }}
      on:routeEvent={ routeEventHandler }
    />

  </main>
</body>
{#if $isPending}
  <div class="spinner">
    <div class="spinner__wrapper">
      <RingLoader size="150" color="#FF3E00" unit="px" duration="2s"></RingLoader>
    </div>
  </div>
{/if}


<style>
  body {
    width: 100%;
    max-width: 100vw;
    margin: 0;
    overflow: hidden;
  }

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
    margin: 250px auto;
    font-size: 32px;
  }

  .header {
    display: flex;
    justify-content: space-between;
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
    color: #07080f;
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
