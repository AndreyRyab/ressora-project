<script>
  import { isPending, currentUser } from '../stores.js';
  import { createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';

  const dispatch = createEventDispatcher();

  let name = '';
  let login = '';
  let password = '';

  const clearInputs = () => {
    name = '';
    login = '';
    password = '';
  }

  const createUser = (event) => {
    dispatch(
      'createUser',
      Object.fromEntries((new FormData(event.target)).entries()),
    )
    clearInputs();
  };

  // TO DO
  /* const updateUser = (event) => {
    dispatch('submitUpdateUser', Object.fromEntries((new FormData(event.target)).entries()))
  }; */

</script>

<section class="signup-form" in:fade="{{duration: 500}}">
  <h2 class="signup-form__title">Создать пользователя</h2>
  <form class="signup-form__form" on:submit|preventDefault={ createUser }>
    <label class="signup-form__label" for="name">Введите имя (минимум 2 символа):</label>
    <!-- svelte-ignore a11y-autofocus -->
    <input type="text" name="name" bind:value={name} minlength="2" required autofocus>

    <label class="signup-form__label" for="login">Введите логин (минимум 4 символа):</label>
    <input type="text" name="login" bind:value={login} minlength="4" required>

    <label class="signup-form__label" for="password">Введите пароль (минимум 5 символов, используйте буквы и цифры):</label>
    <input type="password" name="password" bind:value={password} minlength="5" required>

    {#if $currentUser.admin}
      <fieldset class="signup-form__radio-fieldset">
        <input type="checkbox" name="admin">
        <label for="admin" class="signup-form__radio-label">
          Включить права администратора (сможет создавать новых пользователей и изменять их данные)
        </label>
      </fieldset>
    {/if}

    <input disabled={$isPending} type="submit" value="Создать" class="button button_accent">
    <input type="reset" value="Очистить все поля" class="button">
  </form>
</section>

<style>
  .signup-form {
    margin: 0;
    min-width: 280px;
    padding: 32px;
  }

  .button {
    margin-top: 10px;
    border: none;
    padding: 12px 0;
  }

  .button_accent {
    background-color: #ff6969;
  }

  .signup-form__label {
    margin: 8px 0 5px;
    text-align: left;
    font-size: 10px;
  }
  
  .signup-form__title {
    margin: 0 auto 40px;
  }

  .signup-form__form {
    display: flex;
    flex-direction: column;
  }

  .signup-form__radio-fieldset {
    display: flex;
    align-items: center;
    margin: 5px 0;
    border: none;
  }

  .signup-form__radio-label {
    margin: 0 7px;
    text-align: left;
    font-size: 10px;
  }
</style>
