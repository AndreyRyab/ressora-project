<script>
  import moment from 'moment';
  import {
    currentUser,
    chartData,
    currentSummary,
    isPending,
  } from '../stores';

  import { onMount } from 'svelte';

  import { push } from 'svelte-spa-router';

  import { fade } from 'svelte/transition';

  import Chart from '../components/chart/Chart.svelte';

  import { getSummary } from '../apiCalls';

  import { operations } from '../data';
  import { planChartStyle, factChartStyle } from '../components/chart/chartStyles';

  const now = moment().format();

  let isCreated = false;
  let isUpdated = false;
  let form = [...operations];

  onMount(async () => {
    if ($currentUser._id && $currentSummary.date) {
      return;
    }
    if ($currentUser._id) {
      await getCurrentSummary({
        start: moment().format(),
        period: moment(now).subtract(1, 'months').format(),
        method: 'getCurrentSummary',
      })
    } else {
      push('/signin');
    }
  });

  $: if ($currentSummary.date) createInitialChart();

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

    if (factChartData) initialChartData.datasets.push(factChartData);
    
    console.log(initialChartData);

    chartData.update(p => p = initialChartData);
  };
  /* export let chartData; */

  /* $: {
    fillChartWithInputData(form);
  }; */

  /* const openModal = () => {
    isModalOpen.update(p => p = true);
  }; */

  /* const fillChartWithInputData = (form) => {
    chartData = form.reduce((acc, item) => {
      acc.plan.push(item.quantity);
      acc.title.push(item.title);
      return acc;
    }, {
      plan: [NaN],
      title: [''],
    });
    chartData.plan.push(NaN);
    chartData.title.push('');
  } */

  /* const dispatch = createEventDispatcher(); */

  /* const handleSummary = () => {
    isCreated ? updateSummary() : createSummary();
  } */

  /* const createSummary = () => {
    const params = {
      date: moment().format(),
      prod_line: 1,
      created_by: $currentUser._id,
      updated_by: null,
      plan:  {
        operation_list: [...form],
      },
      fact: {
        operation_list: [],
      },
      method: 'createSummary',
    }

    dispatch('routeEvent', params);
  }

  const updateSummary = () => {
    const params = {
      update: {
        update: {
          updated_by: $currentUser._id,
          fact: {
            operation_list: [...form],
          },
        },
      },
      timeStamp: moment().format(),
      method: 'updateSummary',
    }

    dispatch('routeEvent', params);
  } */

</script>

<Chart />

<!-- <section class="summaries" in:fade="{{duration: 500}}">
  <Chart {chartData}/>
  <ul>
    {#each $fetchedSummaryList as summary (summary.date)}
      <li>{summary.date}</li>
    {/each}
  </ul>  
  <ul>
    {#each form as input (input.brief)}
      <li>
        {input.title}
        <input disabled={$isPending} type="number" bind:value={input.quantity} min=0 max=100>
      </li>
    {/each}
  </ul>
  <button disabled={$isPending} on:click|preventDefault={handleSummary}>{isCreated ? 'Обновить' : 'Создать'}</button>
  <button disabled={$isPending} on:click|preventDefault={getCurrentSummary}>{'Получить текущий summary'}</button>
  <button disabled={$isPending} on:click|preventDefault={getCertainSummaries}>{'Получить summaries'}</button>

</section> -->

<style>
  ul {
    margin: 0;
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

  input {
    width: 50px;
    border: none;
    margin: 0;
  }
  .summaries {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 20px auto;
    width: 90%;
  }

  /* .summaries__title {
    font-size: 30px;
    margin: 0 auto;
  } */

</style>

