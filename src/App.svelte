<script>
  import moment from 'moment';
  import {
    currentUser,
    userList,
    isPending,
    currentSummary,
    prevSummary,
    fetchedSummaryList,
  } from './stores.js';

  import { onMount } from 'svelte';
  import Router from 'svelte-spa-router';
  import { location, push } from 'svelte-spa-router';
  import { RingLoader } from 'svelte-loading-spinners'

  import Signin from './pages/Signin.svelte';
  import Signup from './pages/Signup.svelte';
  import Users from './pages/Users.svelte';
  import Summaries from './pages/Summaries.svelte';
  import Modal from './components/Modal.svelte';
  import Chart from './components/Chart.svelte';

  import { getErrorStatus, showErrorMessage } from './errors/error-handler';
  import { operations } from './data';

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
    createNewSummary,
    updateSummary,
    getSummary,
  } from './apiCalls';

  let modal;
  let chartData;

  let isCreating = true;
  let summaryForm = [...operations];

  let errorMessage = '';
  let loggedIn = false;

  const now = moment().format('L');

  onMount(async () => {
    if (localStorage.getItem('ressoraLoggedIn')) {
      await getUser();
    } else {
      push('/signin');
    }
  });

  $: {
    if (loggedIn) {
      localStorage.setItem('ressoraLoggedIn', true);
      (async () => await getUser())();
    }
  };

  $: if ($currentUser._id) push('/data');

  $: if ($currentUser._id) (async () => await getCurrentSummary({
    start: moment(now).format(),
    period: moment(now).subtract(1, 'months'),
    method: 'getCurrentSummary',
  }))();

  $: fillChartWithInputData(summaryForm);

  /* $: if (currentSummary.date) fillChartWithInputData(currentSummary); */

  const fillChartWithInputData = (summaryForm) => {
    chartData = summaryForm.reduce((acc, item) => {
      acc.plan.push(item.quantity);
      acc.title.push(item.title);
      return acc;
    }, {
      plan: [NaN],
      title: [''],
    });
    chartData.plan.push(NaN);
    chartData.title.push('');
  }

  const createUser = async (params) => {
    try {
      isPending.update(p => p = true);
      await createNewUser(params);
      getUsers();
    } catch (error) {
      errorMessage = showErrorMessage(error);
    } finally {
      isPending.update(p => p = false);
    }
  };

  const signIn = async (params) => {
    try {
      isPending.update(p => p = true);
      const { data } = await signin(params.detail);
      loggedIn = true;
      userMessage = data.message;
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
  };

  const logOut = async () => {
    isPending.update(p => p = true);
    localStorage.removeItem('ressoraLoggedIn');
    loggedIn = false;
    push('/signin');
    const _id = $currentUser._id;
    currentUser.set({
      _id: '',
      name: '',
      login: '',
      admin: null,
    });
    userList.set([]);

    try {
      const { data } = await logout({ _id });
      userMessage = data.message;
    } catch (error) {
      errorMessage = showErrorMessage(error);
    } finally {
      isPending.update(p => p = false);
    }
  };

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
  };

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

  const getCurrentSummary = async (params) => {
    try {
      isPending.update(p => p = true);
      const { lastOne } = await getSummary(params);
      currentSummary.update(summary => summary = lastOne);
    } catch (error) {
      errorMessage = showErrorMessage(error);
    } finally {
      isPending.update(p => p = false);
    }
  };

  const getCertainSummaries = async (params) => {
    try {
      isPending.update(p => p = true);
      const { data } = await getSummary(params);
      fetchedSummaryList.update(summaryList => summaryList = data);
    } catch (error) {
      errorMessage = showErrorMessage(error);
    } finally {
      isPending.update(p => p = false);
    }
  };

  const createSummary = async (params) => {
    try {
      isPending.update(p => p = true);
      const { data } = await createNewSummary(params);
      currentSummary.update(summary => summary = data);
    } catch (error) {
      errorMessage = showErrorMessage(error);
    } finally {
      isPending.update(p => p = false);
    }
  };

  const updateCurrentSummary = async (params) => {
    try {
      isPending.update(p => p = true);
      const { data } = await updateSummary(params);
      currentSummary.update(summary => summary = data);
    } catch (error) {
      errorMessage = showErrorMessage(error);
    } finally {
      isPending.update(p => p = false);
    }
  };

  const handleSummary = () => {
    isCreating ? createSummaryObj() : updateSummaryObj();
  }

  const createSummaryObj = () => {
    const params = {
      date: moment().format(),
      prod_line: 1,
      created_by: $currentUser._id,
      updated_by: null,
      plan:  {
        operation_list: [...summaryForm],
      },
      fact: {
        operation_list: [],
      },
      method: 'createSummary',
    }

    console.log(params);

    /* dispatch('routeEvent', params); */
  }

  const updateSummaryObj = () => {
    const params = {
      update: {
        update: {
          updated_by: $currentUser._id,
          fact: {
            operation_list: [...summaryForm],
          },
        },
      },
      timeStamp: moment().format(),
      method: 'updateSummary',
    }

    console.log(params);

    /* dispatch('routeEvent', params); */
  }

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
    if (data.detail.method === 'createSummary') {
      createSummary(data.detail);
    }
    if (data.detail.method === 'updateSummary') {
      updateCurrentSummary(data.detail);
    }
    /* if (data.detail.method === 'getCurrentSummary') {
      getCurrentSummary(data.detail);
    } */
    if (data.detail.method === 'getCertainSummaries') {
      getCertainSummaries(data.detail);
    }
  }

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
      </nav>

      {#if $currentUser.name }
        <p class="header__user-name">{$currentUser.name || ''}</p>
        
        <span class="header__user-admin">{$currentUser.admin ? 'админ' : ''}</span>
        
        <a href="/" class="header__nav-link" on:click|preventDefault={logOut}>Выйти</a>
      {/if}
    </div>
  </header>

  <main>
    <button class="button button_accent" on:click={() => modal.show()}>Внести данные</button>

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

  <Modal bind:this={modal}>
    <div class="modal__data-wrapper">
      <div class="modal__chart">
        <Chart {chartData}/>
      </div>

      <div class="modal__inputs">
        <ul>
          {#each $fetchedSummaryList as summary (summary.date)}
            <li>{summary.date}</li>
          {/each}
        </ul>  
        <ul>
          {#each summaryForm as input (input.brief)}
            <li>
              {input.title}
              <input disabled={$isPending} type="number" bind:value={input.quantity} min=0 max=100>
            </li>
          {/each}
        </ul>
      </div>
    </div>

    <div class="modal__actions">
      <button disabled={$isPending} class="button button_accent" on:click={handleSummary}>Сохранить и закрыть</button>
      <button class="button" on:click={() => modal.hide()}>Закрыть без изменений</button>
    </div>
  </Modal>

  {#if $isPending}
    <div class="spinner">
      <div class="spinner__wrapper">
        <RingLoader size="150" color="#FF3E00" unit="px" duration="2s"></RingLoader>
      </div>
    </div>
  {/if}
</body>


<style>
  body {
    width: 100%;
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

  .modal__data-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px;
  }

  .modal__chart {
    flex: 0 0 auto;
    width: 70%;
  }
  
  .modal__inputs {
    flex: 0 0 auto;
    width: 25%;
    margin: 0 auto;
  }
  .modal__actions {
    display: flex;
    gap: 10px;
    justify-content: center;
    margin: 10px 0;
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

  ul {
    list-style: none;
  }

  li {
    display: flex;
    gap: 8px;
    width: 250px;
    align-items: baseline;
    justify-content: space-between;
    border-bottom: 1px solid grey;
    padding: 8px 0
  }

  li:last-of-type {
    border: none;
  }

  input {
    width: 50px;
    border: none;
    margin: 0;
  }
  
  @media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
