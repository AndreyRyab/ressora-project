<script>
  import {
    isInputModalOpen,
    chartData,
    currentSummary,
  } from '../stores';
  import { fade } from 'svelte/transition';

  let shown = false;

  export function show() {
    isInputModalOpen.update(p => p = true);
    shown = true;
  };

  export function hide() {
    chartData.update(p => p = $currentSummary.chartData);
    isInputModalOpen.update(p => p = false);
    shown = false;
  };
  
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
    box-sizing: border-box;
    background-color: rgba(0, 0, 0, 0.8);
  }
  
  .modal__wrapper {
    margin: 25px auto;
    max-width: 80vw;
    box-sizing: border-box;
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
