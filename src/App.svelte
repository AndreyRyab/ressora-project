<script>
  import moment from 'moment';
  import {
    currentUser,
    userList,
    isPending,
    currentSummary,
    previousSummary,
    certainSummaryList,
    chartData,
    isInputModalOpen,
    inputDate,
  } from './stores.js';

  import { onMount } from 'svelte';
  import Router from 'svelte-spa-router';
  import { location, push } from 'svelte-spa-router';
  import { RingLoader } from 'svelte-loading-spinners';

  import { getSummary } from './apiCalls';

  import Signin from './pages/Signin.svelte';
  import Signup from './pages/Signup.svelte';
  import Users from './pages/Users.svelte';
  import Summaries from './pages/Summaries.svelte';
  
  import Modal from './components/Modal.svelte';
  import Chart from './components/chart/Chart.svelte';
  
  import { getErrorStatus, showErrorMessage } from './errors/error-handler';
  import { operations } from './data';
  
  import fillChartWithInputData from './helpers/fill-chart-with-input-data';
  import createChartData from './helpers/create-chart-data';

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
  } from './apiCalls';

  let modal;

  let summaryForm = [...operations];

  let errorMessage = null;
  let loggedIn = false;

  const now = moment().format();

  /* onMount(async () => {
    if (localStorage.getItem('ressoraLoggedIn')) {
      await getUser();
      push('/data');
    } else {
      push('/signin');
    }
  }); */

  $: if (loggedIn) {
    localStorage.setItem('ressoraLoggedIn', true);
    getUser();
  };

  $: if ($currentUser._id) {
    push('/data');
  };
  
  $: if ($isInputModalOpen) {
    if ($currentSummary.plan.operation_list.length) {
      chartData.update(p => p = fillChartWithInputData(summaryForm, true));
    } else {
      chartData.update(p => p = fillChartWithInputData(summaryForm, false));
    }
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
      console.log('data: ', data);
      currentSummary.update(summary => summary = data);
    } catch (error) {
      errorMessage = showErrorMessage(error);
    } finally {
      isPending.update(p => p = false);
    }
  };

  const handleSummary = async () => {
    if (true/* moment($currentSummary.date).format('DD.MM.YYYY') === moment(now).format('DD.MM.YYYY') */) {
      
      console.log('$currentSummary: ', $currentSummary);
      console.log('updateSummaryObj(): ', updateSummaryObj());
      await updateCurrentSummary(updateSummaryObj());
    } else {
      await createSummary(createSummaryObj());
    }
    modal.hide();
    isInputModalOpen.update(p => p = false);
    await findSummary({
      method: 'getLastSummaries',
      startPeriod: moment(now).subtract(1, 'months').format(),
      endPeriod: moment(now).add(1, 'd').format(),
    });
    push('/data');
  }

  const findSummary = async (params) => {
    errorMessage = null;
    try {
      isPending.update((p) => (p = true));

      const { data } = await getSummary(params);

      console.log('findSummary, data: ', data)

      if (params.method === 'getLastSummaries') {
        currentSummary.update(
          p => p = {
            ...data[0],
            chartData: createChartData(data[0]),
          }
        );
        if (data[1]) {
          previousSummary.update(
            p => p = {
              ...data[1],
              chartData: createChartData(data[1]),
            }
          );
        }

        chartData.update(p => p = $currentSummary.chartData);
        console.log('getLastSummaries')
      }

      if (params.method === 'getCertainSummaries') {
        certainSummaryList.update(
          p => p = {
            ...data[0],
            chartData: createChartData(data[0]),
          }
        );

        chartData.update(p => p = $certainSummaryList.chartData);

        inputDate.update(p => p = null);
      }
    } catch (error) {
      errorMessage = showErrorMessage(error);
      if (params.method === 'getCertainSummaries') chartData.update(p => p = $currentSummary.chartData);
      inputDate.update(p => p = null);
    } finally {
      isPending.update(p => p = false);
    }
  };

  const createSummaryObj = () => ({
    date: moment().format(),
    prod_line: 1,
    created_by: $currentUser._id,
    plan:  {
      operation_list: [...summaryForm],
    },
    fact: [],
    method: 'createSummary',
  });

  const updateSummaryObj = () => ({
    update: {
      fact: [
        ...$currentSummary.fact,
        {
          created_by: $currentUser._id,
          operation_list: [...summaryForm],
        },
      ],
    },
    id: $currentSummary._id,
    method: 'updateSummary',
  });

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
    if (data.detail.method === 'getCertainSummaries' || data.detail.method === 'getLastSummaries') {
      findSummary(data.detail);
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
        <p class="header__user-name">{$currentUser.name || 'Неопознанный пользователь'}</p>
        
        <span class="header__user-admin">{$currentUser.admin ? 'админ' : ''}</span>
        
        <a href="/" class="header__nav-link" on:click|preventDefault={logOut}>Выйти</a>
      {/if}
    </div>
  </header>

  <main>
    {#if $currentUser._id}
      <div class="main-actions__wrapper">
        <button class="button button_accent" on:click={() => modal.show()}>Внести данные</button>
      </div>
    {/if}

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
      <h2>
        Вы вносите {
          $currentSummary.plan.length
          ? 'фактические'
          : 'плановые'
        } показатели за {moment().format('DD.MM.YYYY')}
      </h2>
      
      <div class="modal__chart">
      <Chart />
      </div>

      <div class="modal__inputs">
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
    position: fixed;
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

  .main-actions__wrapper {
    display: flex;
    justify-content: flex-end;
    width: 100%;
    box-sizing: border-box;
    padding: 12px 16px;
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
