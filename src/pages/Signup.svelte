<script>
  import { createEventDispatcher } from 'svelte';
  import SignupForm from '../components/SignupForm.svelte';

  const dispatch = createEventDispatcher();

  const createUser = (data) => {
    dispatch('routeEvent', { ...data.detail, method: 'createUser' });
  };

</script>
  
<section class="signup">
  <SignupForm on:createUser={createUser}/>
</section>

<style>
  .signup {
    margin: 25px 0 0 0;
  }
  
</style>
