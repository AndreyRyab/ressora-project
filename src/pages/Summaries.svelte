<script>
  import moment from 'moment';
  import {
    currentUser,
    isPending,
    fetchedSummaryList,
  } from '../stores';
  import { createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';

  import Chart from '../components/Chart.svelte';

  import { operations } from '../data';

  let isCreated = false;
  let isUpdated = false;
  let form = [...operations];

  export let chartData;

  $: {
    fillChartWithInputData(form);
  };

  const openModal = () => {
    isModalOpen.update(p => p = true);
  };

  const fillChartWithInputData = (form) => {
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
  }

  const dispatch = createEventDispatcher();

  const handleSummary = () => {
    isCreated ? updateSummary() : createSummary();
  }

  const createSummary = () => {
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
  }

  const getCurrentSummary = () => {
    const now = moment().format('L');
    const params = {
      start: moment(now).format(),
      method: 'getCurrentSummary',
    };

    dispatch('routeEvent', params);
  };

  const getCertainSummaries = () => {
    const params = {
      start: moment('07/12/2022').format(),
      end: moment().format(),
      method: 'getCertainSummaries',
    };

    dispatch('routeEvent', params);
  }

</script>

<section class="summaries" in:fade="{{duration: 500}}">
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

</section>

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

