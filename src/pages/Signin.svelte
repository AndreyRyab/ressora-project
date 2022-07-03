<script>
  import { createEventDispatcher } from 'svelte';
  import SigninForm from '../components/SigninForm.svelte';

  const dispatch = createEventDispatcher();

  const signin = (data) => {
    dispatch('routeEvent', { ...data.detail, method: 'signin' });
  };

</script>

<section class="signin">
  <SigninForm on:signin={signin}/>
</section>

<style>
  .signin {
    margin: 25px 0 0 0;
  }
  
</style>
