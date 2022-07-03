<script>
  import { isPending } from '../stores.js';
  import { createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';

  const dispatch = createEventDispatcher();

  let login = '';
  let password = '';

  const clearInputs = () => {
    login = '';
    password = '';
  }

  const signin = (event) => {
    clearInputs();
    
    dispatch(
      'signin',
      Object.fromEntries((new FormData(event.target)).entries()),
    );
  };

</script>

  <section class="signin-form" in:fade="{{duration: 500}}">
    <h2 class="signin-form__title">Войти</h2>
    <form class="signin-form__form" on:submit|preventDefault={signin}>
      <label class="signin-form__label" for="login">Логин:</label>
      <!-- svelte-ignore a11y-autofocus -->
      <input type="text" name="login" bind:value={login} minlength="4" required autofocus>

      <label class="signin-form__label" for="password">Пароль:</label>
      <input type="password" name="password" bind:value={password} minlength="5" required>

      <input disabled={$isPending} type="submit" class="button button_accent" value="Войти">
    </form>
  </section>

<style>
  .signin-form {
    min-width: 280px;
    padding: 32px;
  }

  .signin-form__label{
    align-self: start;
    margin: 8px 0 5px;
    font-size: 10px;
  }
  
  .signin-form__title {
    margin: 0 auto 40px;
  }

  .signin-form__form {
    display: flex;
    flex-direction: column;
  }

  .button {
    margin-top: 10px;
    border: none;
    padding: 12px 0;
  }

  .button_accent {
    background-color: #ff6969;
  }
</style>
