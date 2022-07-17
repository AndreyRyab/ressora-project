<script>
  import { fade } from 'svelte/transition';

  let shown = false;
  export function show() {
    shown = true;
  }
  export function hide() {
    shown = false;
  }
</script>

<svelte:window
  on:keydown={e => {
    if (e.key === 'Escape') {
      hide();
    }
  }} />

{#if shown}
  <div class="modal" transition:fade="{{duration: 300}}">
    <div class="modal__wrapper">
      <span class="modal__close" on:click={() => hide()}>&times;</span>
      <slot />
    </div>
  </div>
{/if}

<style>
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgb(0, 0, 0);
    background-color: rgba(0, 0, 0, 0.8);
  }
  
  .modal__wrapper {
    margin: 25px auto;
    max-width: 80vw;
    padding: 1rem;
    background-color: white;
  }

  .modal__close {
    float: right;
    cursor: pointer;
  }

  .modal__close:hover {
    font-weight: bold;
  }
</style>
