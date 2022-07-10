<script>
  import moment from 'moment';
  import { currentUser, isPending, fetchedSummaryList } from '../stores';
  import { createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';

  import { operations } from '../data';

  let isCreated = false;
  let isUpdated = false;
  let form = [...operations];

  const dispatch = createEventDispatcher();

  const handleSummary = () => {
    isCreated ? updateSummary() : createSummary();
  }

  const createSummary = () => {
    const params = {
      date: moment().format('L'),
      prod_line: 1,
      created_by: $currentUser._id,
      updated_by: $currentUser._id,
      plan:  {
        operation_list: [...form],
      },
      fact: {
        operation_list: [{
          title: '',
          brief: '',
          quantity: 0,
        }],
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
      timeStamp: moment().format('L'),
      method: 'updateSummary',
    }

    dispatch('routeEvent', params);
  }

  const getCurrentSummary = () => {
    const params = {
      start: moment().format('L'),
      method: 'getCurrentSummary',
    };

    dispatch('routeEvent', params);
  };

  const getCertainSummaries = () => {
    const params = {
      start: '07/07/2022',
      end: moment().format('L'),
      method: 'getCertainSummaries',
    };

    dispatch('routeEvent', params);
  }

</script>

<section class="summaries" in:fade="{{duration: 500}}">
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
    margin-top: 150px;
  }

  /* .summaries__title {
    font-size: 30px;
    margin: 0 auto;
  } */

</style>
