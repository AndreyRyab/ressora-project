<script>
  import moment from 'moment';
  import {
    currentUser,
    chartData,
    certainSummaryList,
    currentSummary,
    previousSummary,
    isPending,
    inputDate,
    inputDateStart,
    inputDateEnd,
  } from '../stores';

  import { createEventDispatcher, onMount } from 'svelte';

  import { push } from 'svelte-spa-router';

  import Chart from '../components/chart/Chart.svelte';
  
  const dispatch = createEventDispatcher();

  let errorMessage;

  let isPreviousSummary = false;

  const now = moment().format('YYYY-MM-DD');

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

  $: if ($inputDate) {
    findSummary({
      method: 'getCertainSummaries',
      start: moment($inputDate).format(),
      end: moment($inputDate).add(1, 'd').format(),
    });
  }

  const findSummary = (params) => {
    dispatch('routeEvent', params);
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

  const searchSummaries = () => {
    findSummary({
      method: 'getCertainSummaries',
      start: moment($inputDateStart).format(),
      end: moment($inputDateEnd).add(1, 'd').format(),
    });
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

  .summaries__form {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .summaries__form-row {
    display: flex;
  }

  input {
    width: 24px;
    border: none;
    margin: 0;
  }

  label {
    align-self: center;
  }
</style>

<section class="summaries">
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
        <h4>Выбрать дату:</h4>
        <input
          disabled={$isPending}
          type="date"
          class="summaries__input-date"
          bind:value={$inputDate}
          min="2022-07-16"
          max={moment().format('YYYY-MM-DD')} />
      </label>

      {#if $previousSummary.date}
        <div>
          <input
            disabled={$isPending}
            type="button"
            class="summaries__days-toggler"
            value={isPreviousSummary ? `Вернуться на ${moment($currentSummary.date).format('DD.MM.YYYY')}` : 'Предыдущий день'}
            on:click={() => togglePrevCurrentSummary()}
          />
        </div>
      {/if}

      {#if $certainSummaryList.length}
      <div>
        <input
          disabled={$isPending}
          type="button"
          class="summaries__days-toggler"
          value={`Вернуться на ${moment($currentSummary.date).format('DD.MM.YYYY')}`}
          on:click={() => togglePrevCurrentSummary('current')}
        />
      </div>
      {/if}

      <form class="summaries__form">
        <h4 class="summaries__form-title">Данные за период</h4>

        <div class="summaries__form-row">
          <label for="start">с</label>
          <input
            disabled={$isPending}  
            name="start"
            type="date"
            min={'2022-08-06'}
            max={$inputDateEnd || moment().format('YYYY-MM-DD')}
            class="summaries__input-date"
            bind:value={$inputDateStart}
            required
          >
        </div>
        
        <div class="summaries__form-row">
          <label for="end">по</label>
          <input
            disabled={$isPending}
            name="end"
            type="date"
            min={$inputDateStart || '2022-08-06'}
            max={moment().format('YYYY-MM-DD')}
            class="summaries__input-date"
            bind:value={$inputDateEnd}
            required
            >
        </div>

        <div class="summaries__form-row">
          <input
          disabled={$isPending}
          type="button"
          class="summaries__days-toggler"
          value="Показать"
          on:click={() => searchSummaries()}
        />
        </div>
      </form>
    </div>
  </section>
</section>
