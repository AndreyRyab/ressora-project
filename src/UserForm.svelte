<script>
  import { isPending, currentUser } from './stores.js';
  import { createEventDispatcher } from 'svelte';

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
      'routeEvent',
      Object.fromEntries((new FormData(event.target)).entries()),
    )
    clearInputs();
  };

  // TO DO
  /* const updateUser = (event) => {
    dispatch('submitUpdateUser', Object.fromEntries((new FormData(event.target)).entries()))
  }; */

</script>

<section class="user-form">
  <h2 class="user-form__title">Создать пользователя</h2>
  <form class="user-form__form" on:submit|preventDefault={ createUser }>
    <label class="user-form__label" for="name">Введите имя (минимум 2 символа):</label>
    <!-- svelte-ignore a11y-autofocus -->
    <input type="text" name="name" bind:value={name} minlength="2" required autofocus>

    <label class="user-form__label" for="login">Введите логин (минимум 4 символа):</label>
    <input type="text" name="login" bind:value={login} minlength="4" required>

    <label class="user-form__label" for="password">Введите пароль (минимум 5 символов, используйте буквы и цифры):</label>
    <input type="password" name="password" bind:value={password} minlength="5" required>

    {#if $currentUser.admin}
      <fieldset class="user-form__radio-fieldset">
        <input type="checkbox" name="admin">
        <label for="admin" class="user-form__radio-label">
          Включить права администратора (сможет создавать новых пользователей и изменять их данные)
        </label>
      </fieldset>
    {/if}

    <input disabled={$isPending} type="submit" value="Создать" class="button">
    <input type="reset" value="Очистить все поля">
  </form>
</section>

<style>
  .user-form {
    display: flex;
    flex-direction: column;
    width: 35%;
    min-width: 280px;
    margin: 50px 0;
    padding: 32px;
    background-color: beige;
  }

  .button {
    margin-top: 10px;
  }

  .user-form__label {
    margin: 8px 0 5px;
    text-align: left;
    font-size: 10px;
  }
  
  .user-form__title {
    margin-top: 0;
  }

  .user-form__form {
    display: flex;
    flex-direction: column;
  }

  .user-form__radio-fieldset {
    display: flex;
    align-items: center;
    margin: 5px 0;
    border: none;
  }

  .user-form__radio-label {
    margin: 0 7px;
    text-align: left;
    font-size: 10px;
  }
</style>
