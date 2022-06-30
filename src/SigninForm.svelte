<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  const signin = (event) => {
    dispatch(
      'routeEvent',
      Object.fromEntries((new FormData(event.target)).entries()),
    )
  };

</script>

  <section class="signin-form">
    <h2 class="signin-form__title">Войти</h2>
    <form class="signin-form__form" on:submit|preventDefault={signin}>
      <label class="signin-form__label" for="login">Логин:</label>
      <!-- svelte-ignore a11y-autofocus -->
      <input type="text" name="login" minlength="4" required autofocus>

      <label class="signin-form__label" for="password">Пароль:</label>
      <input type="password" name="password" minlength="5" required>

      <input type="submit" class="button" value="Войти">
    </form>
  </section>

<style>
  .signin-form {
    display: flex;
    flex-direction: column;
    width: 30%;
    min-width: 280px;
    margin: 50px 0;
    padding: 32px;
    background-color: beige;
  }

  .signin-form__label{
    align-self: start;
    margin: 8px 0 5px;
    font-size: 10px;
  }
  
  .signin-form__title {
    margin-top: 0;
  }

  .signin-form__form {
    display: flex;
    flex-direction: column;
  }

  .button {
    margin-top: 10px;
  }
</style>
