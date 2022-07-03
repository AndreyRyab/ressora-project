<script>
  import { createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';

  const dispatch = createEventDispatcher();

  const getUsers = (event) => {
    dispatch('routeEvent')
  };

  /* on:deleteUser={deleteCheckedUser} */
</script>

<section class="summaries" in:fade="{{duration: 500}}">
  <p class="summaries__title">Страница, на которой будут вводиться и отрисовываться данные</p>
</section>

<style>
  .summaries {
    display: flex;
    align-items: center;
    margin-top: 150px;
  }

  .summaries__title {
    font-size: 30px;
    margin: 0 auto;
  }

</style>
