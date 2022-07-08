<script>
  import moment from 'moment';
  import { currentUser, isPending } from '../stores';
  import { createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';

  import { operations } from '../data';

  let isCreated = true;
  let isUpdated = false;
  let form = [...operations];

  let currentSummary = {
    data: '2022-07-08T22:13:20+03:00',
  }

  const dispatch = createEventDispatcher();

  const handleSummary = () => {
    isCreated ? updateSummary() : createSummary();
  }

  const createSummary = () => {
    let summary = {
      date: moment().format(),
      prod_line: 1,
      created_by: $currentUser._id,
      updated_by: $currentUser._id,
      plan:  {
        operation_list: [{
          title: 'Test operation',
          brief: 'Test operation brief',
          quantity: 0,
        }],
      },
      fact: {
        operation_list: [{
          title: 'Test operation fact',
          brief: 'Test operation fact brief',
          quantity: 0,
        }],
      },
    };

    summary.plan.operation_list = [...form];

    console.log(summary);

    dispatch('routeEvent', { ...summary, method: 'createSummary' });
  }

  const updateSummary = () => {
    const update = {
      update: {
        updated_by: $currentUser._id,
        fact: {
          operation_list: [...form],
        },
      }
    };

    dispatch('routeEvent', { ...update, timeStamp: currentSummary.data, method: 'updateSummary' });
  }

</script>

<section class="summaries" in:fade="{{duration: 500}}">
  <ul>
    {#each form as input (input.brief)}
      <li>
        {input.title}
        <input disabled={$isPending} type="number" bind:value={input.quantity} min=0 max=100>
      </li>
    {/each}
  </ul>
  <button disabled={$isPending} on:click|preventDefault={handleSummary}>{isCreated ? 'Обновить' : 'Создать'}</button>
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
