<script>
  import moment from 'moment';
  import {
    currentUser,
    chartData,
    certainSummaryList,
    currentSummary,
    previousSummary,
    isPending,
    isInputModalOpen,
  } from '../stores';

  import { onMount } from 'svelte';

  import { push } from 'svelte-spa-router';

  import { fade } from 'svelte/transition';

  import Chart from '../components/chart/Chart.svelte';

  import { getSummary } from '../apiCalls';

  import createChartData from '..//helpers/create-chart-data';

  import { operations } from '../data';
  import { showErrorMessage } from '../errors/error-handler';

  let errorMessage;

  let isPreviousSummary = false;

  const now = moment().format('YYYY-MM-DD');
  let inputDate /*  = moment(now).format('YYYY-MM-DD') */;

  let isCreated = false;
  let isUpdated = false;
  let form = [...operations];

  onMount(async () => {
    if ($currentUser._id && $currentSummary.date) {
      return;
    }
    if ($currentUser._id) {
      await findSummary({
        method: 'getLastSummaries',
        startPeriod: moment(now).subtract(1, 'months').format(),
        endPeriod: moment(now).add(1, 'd').format(),
      });
    } else {
      push('/signin');
    }
  });

  $: if (inputDate)
    findSummary({
      method: 'getCertainSummaries',
      start: moment(inputDate).format(),
      end: moment(inputDate).add(1, 'd').format(),
    });

  const findSummary = async (params) => {
    errorMessage = null;
    try {
      isPending.update((p) => (p = true));

      const { data } = await getSummary(params);

      if (params.method === 'getLastSummaries') {
        currentSummary.update(
          p => p = {
            ...data[1],
            chartData: createChartData(data[1]),
          }
        );

        previousSummary.update(
          p => p = {
            ...data[0],
            chartData: createChartData(data[0]),
          }
        );

        chartData.update(p => p = $currentSummary.chartData);
      }

      if (params.method === 'getCertainSummaries') {
        console.log('getCertainSummaries data in findSummary: ', data)
        certainSummaryList.update(
          p => p = {
            ...data[0],
            chartData: createChartData(data[0]),
          }
        );

        chartData.update(p => p = $certainSummaryList.chartData);
        
        inputDate = null;
      }
    } catch (error) {
      errorMessage = showErrorMessage(error);
      if (params.method === 'getCertainSummaries') chartData.update(p => p = $currentSummary.chartData);
      inputDate = null;
    } finally {
      isPending.update(p => p = false);
    }
  };

 const togglePrevCurrentSummary = (summary = null) => {
    if (summary === 'current') {
      chartData.update(p => p = $currentSummary.chartData);
      return;
    }
    isPreviousSummary = !isPreviousSummary;
    if ($chartData.date === $currentSummary.date) {
      chartData.update(p => p = $previousSummary.chartData);
      return;
    }
    chartData.update(p => p = $currentSummary.chartData);
  };
</script>

<style>
  .summaries {
    display: flex;
    flex-direction: column;
    margin: 20px auto;
    width: 90%;
    height: 90%;
  }

  .summaries__chart-wrapper {
    display: flex;
  }

  .summaries__chart {
    display: flex;
    flex-direction: column;
    width: 70%;
  }

  .summaries__chart-title {
    align-self: center;
  }

  .summaries__filter {
    display: flex;
    flex-direction: column;
    width: 30%;
    align-items: center;
    justify-content: space-evenly;
  }

  .summaries__days-toggler {
    width: fit-content;
    margin: 0;
    padding: 12px 24px;
  }

  .summaries__input-date {
    margin: 0;
    width: 130px;
  }

  /* .summaries__error-message {
    display: block;
    padding: 24px 0;
    margin: 0 auto;
  } */

  input {
    width: 24px;
    border: none;
    margin: 0;
  }
</style>

<section class="summaries">
  <!-- <p>chartData: {JSON.stringify($chartData.date)}</p>
  <p>current: {JSON.stringify($currentSummary.date)}</p>
  <p>previous: {JSON.stringify($previousSummary.date)}</p>
  <p>certainSummaryList: {JSON.stringify($certainSummaryList.date)}</p>
  <p>isPreviousSummary: {isPreviousSummary}</p> -->

  <section class="summaries__chart-wrapper">
    <div class="summaries__chart">
      {#if !$isPending}
        <h2 class="summaries__chart-title">
          Данные за {moment($chartData?.date).format('DD.MM.YYYY') || ''}
        </h2>
      {/if}

      <Chart />
    </div>  

    <div class="summaries__filter">
      {#if errorMessage}
        <p class="error-message">{errorMessage}</p>
      {/if}

      <label>
        Выбрать дату:
        <input
          disabled={$isPending}
          type="date"
          class="summaries__input-date"
          bind:value={inputDate}
          min="2022-07-16"
          max={moment().format('YYYY-MM-DD')} />
      </label>

      {#if $previousSummary.date && ($chartData.date !== $certainSummaryList.date)}
        <label>
          <input
            disabled={$isPending}
            type="button"
            class="summaries__days-toggler"
            value={isPreviousSummary ? `Вернуться на ${moment($currentSummary.date).format('DD.MM.YYYY')}` : 'Предыдущий день'}
            on:click={() => togglePrevCurrentSummary()} />
        </label>
      {/if}

      {#if $certainSummaryList.date === $chartData.date}
        <label>
          <input
            disabled={$isPending}
            type="button"
            class="summaries__days-toggler"
            value={`Вернуться на ${moment($currentSummary.date).format('DD.MM.YYYY')}`}
            on:click={() => togglePrevCurrentSummary('current')} />
        </label>
      {/if}
    </div>
  </section>
</section>
