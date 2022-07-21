<script>
  import moment from 'moment';
  import {
    currentUser,
    chartData,
    fetchedSummaryList,
    currentSummary,
    isPending,
  } from '../stores';

  import { onMount } from 'svelte';

  import { push } from 'svelte-spa-router';

  import { fade } from 'svelte/transition';

  import Chart from '../components/chart/Chart.svelte';

  import { getSummary } from '../apiCalls';

  import { operations } from '../data';
  import { showErrorMessage } from '../errors/error-handler';
  import { planChartStyle, factChartStyle } from '../components/chart/chartStyles';

  let errorMessage;
  
  const now = moment().format();
  let inputDate/*  = moment(now).format('YYYY-MM-DD') */;

  let isCreated = false;
  let isUpdated = false;
  let form = [...operations];

  onMount(async () => {
    if ($currentUser._id && $currentSummary.date) {
      return;
    }
    if ($currentUser._id) {
      await findSummary({
        method: 'getCurrentSummary',
        startPeriod: moment(now).subtract(1, 'months').format(),
        endPeriod: moment().format(),
      })
    } else {
      push('/signin');
    }
  });

  /* $: if ($currentSummary.date) createInitialChart(); */
  
  $: if (inputDate) findSummary({
    method: 'getCertainSummaries',
    start: moment(inputDate).format(),
    end: moment(inputDate).add(1, 'd').format(),
  });

  const findSummary = async (params) => {
    try {
      isPending.update(p => p = true);
      const { data } = await getSummary(params);
      if (params.method === 'getCurrentSummary') {
        currentSummary.update(summary => summary = data);
      }
      if (params.method === 'getCertainSummaries') {
        fetchedSummaryList.update(summaryList => summaryList = data);
        currentSummary.update(summary => summary = $fetchedSummaryList[0]); // TODO: remove
      }
      createInitialChart();
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

</script>

<section class="summaries">
  {#if $currentSummary.date}
    <h2>{
      ($currentSummary.date === 'Invalid date')
      ? 'Данные загружаются...'
      : `Данные за ${moment($currentSummary.date).format('DD.MM.YYYY')}`
    }</h2>
  {/if}
  
  <div class="summaries__filter">
    <label>
      Выбрать дату:
      <input
        disabled={$isPending}
        type="date"
        class="summaries__input-date"
        bind:value="{inputDate}"
        min="2022-07-16"
        max="{moment().format('YYYY-MM-DD')}"
      >
    </label>

    <label>
      <input
        disabled={$isPending}
        type="checkbox"
        class="summaries__checkbox"
      >
      Смотреть данные за предыдущий день
    </label>
  </div>
  
  <Chart />
</section>

<style>
  .summaries {
    display: flex;
    flex-direction: column;
    margin: 20px auto;
    width: 90%;
    height: 90%;
  }

  .summaries__filter {
    display: flex;
    gap: 25px;
    width: 100%;
    align-items: center;
    justify-content: space-between;
  }

  .summaries__checkbox {
    margin: 0;
  }

  .summaries__input-date {
    margin: 0;
    width: 130px;
  }

  input {
    width: 24px;
    border: none;
    margin: 0;
  }

</style>

