<script>
  import SigninForm from './SigninForm.svelte';
  import UserForm from './UserForm.svelte';
  import UserItem from './UserItem.svelte';

  import getErrorStatus from './errors/getErrorStatus';

  import {
  NOT_FOUND_USER,
  LOGIN_PASSWORD_ERR,
  SERVER_ERR,
  JWT_ERROR,
  AUTH_ERROR,
} from './errors/messages-constants';

  import {
    createNewUser,
    getAllUsers,
    getCurrentUser,
    signin,
    logout,
    deleteUser,
  } from './apiCalls.js';

  let isPending = false;
  let errorMessage = '';
  let createdUser;
  let users = [];
  let form;
  let userMessage;
  let fetchedUser;

  let deletedUserId;

  let currentUser;
  let contextUser;

  const clearMessages = () => {
    errorMessage = '';
    userMessage = '';
  };

  const createUser = async (form) => {
    try {
      clearMessages();
      isPending = true;
      const { data } = await createNewUser(form.detail)/* .then(newUser => createdUser = newUser) */;
      createdUser = data;
      await getUsers();
    } catch ({ message }) {
      errorMessage = message;
    } finally {
      isPending = false;
    }
  }

  const signIn = async (form) => {
    try {
      clearMessages();
      isPending = true;
      const { data } = await signin(form.detail);
      userMessage = data.message;
      localStorage.setItem('ressoraLoggedIn', true);
    } catch (error) {
      if (getErrorStatus(error) === 404) {
        errorMessage = NOT_FOUND_USER;
      } else if (getErrorStatus(error) === 401) {
        errorMessage = LOGIN_PASSWORD_ERR;
      } else if (getErrorStatus(error) === 400) {
        errorMessage = JWT_ERROR;
      } else {
        errorMessage = SERVER_ERR;
      }
    } finally {
      isPending = false;
    }
  }

  const logOut = async () => {
    try {
      localStorage.removeItem('ressoraLoggedIn');
      users = [];
      const _id = contextUser._id;
      contextUser = {};
      currentUser = '';
      clearMessages();
      isPending = true;
      const { data } = await logout({ _id });
      userMessage = data.message;
    } catch ({ message }) {
      errorMessage = message;
    } finally {
      isPending = false;
    }
  }

  const getUsers = async () => {
    try {
      clearMessages();
      isPending = true;
      const { data } = await getAllUsers();
      users = data;
    } catch (error) {
      if (getErrorStatus(error) === 401) {
        errorMessage = AUTH_ERROR;
      } else {
        errorMessage = SERVER_ERR;
      }
    } finally {
      isPending = false;
    }
  }

  const getUser = async () => {
    try {
      isPending = true;
      const { data } = await getCurrentUser();
      fetchedUser = data;
      contextUser = data;
      currentUser = fetchedUser.name;
    } catch (error) {
      if (getErrorStatus(error) === 401) {
        errorMessage = AUTH_ERROR;
      } else {
        errorMessage = SERVER_ERR;
      }
    } finally {
      isPending = false;
    }
  };

  const deleteCheckedUser = async (event) => {
    deletedUserId = event.detail.userId;
    try {
      isPending = true;
      const { data } = await deleteUser({ userId: deletedUserId });
      users = users.filter((user) => user._id !== data._id)
      deletedUserId = data._id;
    } catch ({ message }) {
      errorMessage = message;
    } finally {
      isPending = false;
    }
  }

</script>

<main>
  <h1>Hello {currentUser}!</h1>
  
  <button class="button" on:click={getUser}>get user</button>
  <button class="button" on:click={getUsers}>вывести всех пользователей</button>
  <button class="button" on:click={logOut}>logOut</button>
  
  <section class="results">
    <!-- <p>errorMessage: {errorMessage}</p> -->
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
    <!-- <UserItem on:deleteUser={deleteCheckedUser} userId={'userId 1'} userName={'Имя пользователя'} userLogin={'Длинный логин'} isAdmin={'админ'}/>
    <UserItem on:deleteUser={deleteCheckedUser} userId={'userId 2'} userName={'Имя пользователя'} userLogin={'Длинный логин'} isAdmin={'админ'}/> -->
    {#if users.length}
      <ul class="user-list">
        {#each users as user (user._id)}
        <li>
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

  ul {
    margin: 0;
    width: 100%;
    padding: 0;
    list-style: none;
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
