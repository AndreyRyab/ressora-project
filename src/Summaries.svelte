<script>
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  const getUsers = (event) => {
    dispatch('routeEvent')
  };

  /* on:deleteUser={deleteCheckedUser} */
</script>

<section class="summaries">
  страница данных
</section>

<style>

</style>
