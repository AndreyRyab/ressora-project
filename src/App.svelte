<script>
  import moment from 'moment';
  import {
    currentUser,
    userList,
    isPending,
    currentSummary,
    fetchedSummaryList,
    chartData,
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

  let isSummaryExist = false;
  let summaryForm = [...operations];

  let errorMessage = '';
  let loggedIn = false;

  let inputChartData;

  const now = moment().format();

  /* onMount(async () => {
    if (localStorage.getItem('ressoraLoggedIn')) {
      await getUser();
    } else {
      push('/signin');
    }
  }); */

  $: if (loggedIn) {
      localStorage.setItem('ressoraLoggedIn', true);
      getUser();
    };

  $: if ($currentUser._id) {
    getCurrentSummary({
      start: moment().format('DD-MM-YYYY'),
      period: moment(now).subtract(1, 'months').format('DD-MM-YYYY'),
      method: 'getCurrentSummary',
    })
    push('/data');
  };

  $: if ($currentSummary.date) createInitialChart();
  
  $: fillChartWithInputData(summaryForm);

  /* {
        labels: chartData.labels,
        datasets: [{
          label: 'План',
          borderWidth: 4,
          borderColor: 'rgb(252, 186, 3)',
          pointStyle: 'circle',
          tension: 0.3,
          fill: false,
          data: chartData.plan,
        },
        {
          label: 'Факт',
          borderWidth: 4,
          borderColor: 'rgb(255, 99, 132)',
          pointStyle: 'circle',
          tension: 0.3,
          fill: false,
          data: fact,
        }]
      }, */
  const planChartStyle = {
    label: 'План',
    borderWidth: 4,
    borderColor: 'rgb(252, 186, 3)',
    pointStyle: 'circle',
    tension: 0.3,
    fill: false,
  };

  const factChartStyle = {
    label: 'Факт',
    borderWidth: 4,
    borderColor: 'rgb(255, 99, 132)',
    pointStyle: 'circle',
    tension: 0.3,
    fill: false,
  };

  const createInitialChart = () => {
    let initialChartData = $currentSummary.plan.operation_list.reduce(
      (acc, item) => {
        acc.labels.push(item.title);
        acc.datasets[0].data.push(item.quantity);
        return acc;
      },
      {
        labels: [''],
        datasets: [
          {
            data: [NaN],
            ...planChartStyle,
          },
        ],
      }
    );
    initialChartData.labels.push('');
    initialChartData.datasets[0].data.push(NaN);

    console.log(initialChartData)

    let factChartData = null;

    if ($currentSummary.fact.operation_list.length) {
      factChartData = $currentSummary.fact.operation_list.reduce(
      (acc, item) => {
        acc.data.push(item.quantity);
        return acc;
      },
      {
        data: [NaN],
        ...factChartStyle,
      },
    );
      factChartData.data.push(NaN);
    };

    initialChartData.datasets.push(factChartData);
    
    console.log(initialChartData);

    chartData.update(p => p = initialChartData);
  };

  const fillChartWithInputData = (summaryForm) => {
    inputChartData = summaryForm.reduce((acc, item) => {
      acc.plan.push(item.quantity);
      acc.labels.push(item.title);
      return acc;
    }, {
      plan: [NaN],
      labels: [''],
    });
    inputChartData.plan.push(NaN);
    inputChartData.labels.push('');
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
      const { data } = await getSummary(params);
      console.log(data);
      currentSummary.update(summary => summary = data);
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
    $currentSummary.date === moment().format('DD-MM-YYYY')
      ? updateSummaryObj()
      : createSummaryObj();
  }

  const createSummaryObj = () => {
    const params = {
      date: moment().format('DD-MM-YYYY'),
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

    console.log('createSummary: ', params);

    /* dispatch('routeEvent', params); */
    createSummary(params);
  }

  const updateSummaryObj = () => {
    const params = {
      update: {
        updated_by: $currentUser._id,
        fact: {
          operation_list: [...summaryForm],
        },
      },
      timeStamp: moment().format('DD-MM-YYYY'),
      method: 'updateSummary',
    }

    console.log('updateSummary: ', params);

    updateCurrentSummary(params);

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
      <div class="modal__chart">
      <Chart {inputChartData}/>
      </div>

      <div class="modal__inputs">
        <!-- <ul>
          {#each $fetchedSummaryList as summary (summary.date)}
            <li>{summary.date}</li>
          {/each}
        </ul>   -->
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
