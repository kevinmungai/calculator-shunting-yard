<script lang="ts">
  import {
    formatNumber,
    numbersAndOperators,
    numOperators,
    result,
  } from "$lib/types";
  import type { NumOperator } from "$lib/types";
  import "tailwindcss/tailwind.css";
  import "$lib/assets/css/app.css";
  import Divide from "$lib/operators/Divide.svelte";
  import BackSpace from "$lib/operators/BackSpace.svelte";
  import Equals from "$lib/operators/Equals.svelte";
  import Minus from "$lib/operators/Minus.svelte";
  import Multiply from "$lib/operators/Multiply.svelte";
  import Add from "$lib/operators/Add.svelte";

  let innerHeight: number;
  let div: HTMLElement;
  let p: HTMLParagraphElement;

  function numOperatorClicked(n: NumOperator) {
    numOperators.numOrOperatorClicked(n);
  }

  $: {
    if ($numOperators && div) {
      div.scrollLeft = div.scrollWidth;
    }

    if ($result && p) {
      p.scrollLeft = p.scrollWidth;
    }

    if (typeof window !== "undefined") {
      let vh = innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    }
  }
</script>

<svelte:window bind:innerHeight />

<main class="font-lato">
  <div style="grid-template-rows: 1fr 5fr;" class="grid grid-flow-row">
    <div class="place-self-stretch grid place-items-center">
      <h1 class="text-xl">Calculator</h1>
    </div>
    <div class="grid grid-flow-row auto-rows-min content-center gap-y-2">
      <div
        style="grid-template-columns: 1fr;"
        class="grid grid-flow-col auto-cols-min items-center justify-items-end gap-x-1 overflow-x-auto text-3xl sm:text-2xl pr-7 pb-2"
        bind:this={div}
      >
        {#each $numOperators as nos, i}
          {#if nos.type === "number"}
            <p>{formatNumber(nos.value)}</p>
          {:else if nos.type === "operator"}
            {#if nos.sign === "decimal-point"}
              <p>.</p>
            {:else if nos.sign === "divide"}
              <Divide onNumberPad={false} />
            {:else if nos.sign === "minus"}
              <Minus onNumberPad={false} />
            {:else if nos.sign === "multiply"}
              <Multiply onNumberPad={false} />
            {:else if nos.sign === "add"}
              <Add onNumberPad={false} />
            {/if}
          {/if}
        {/each}
        <span class="blink">|</span>
      </div>

      {#if $result.length > 0}
        <p class="text-right text-5xl pr-8 overflow-x-auto pb-2" bind:this={p}>
          {$result}
        </p>
      {:else}
        <p class="text-right text-5xl pr-7 overflow-x-auto pb-2">0</p>
      {/if}
    </div>
  </div>

  <div class="numbers-and-operators bg-calculator-pad text-2xl">
    {#each numbersAndOperators as n}
      {#if n.type === "number"}
        <button type="button" on:click={() => numOperatorClicked(n)}>
          {n.value}
        </button>
      {:else if n.type === "operator"}
        {#if n.sign === "decimal-point"}
          <button
            type="button"
            on:click={() => numOperatorClicked(n)}
            aria-label="decimal-point"
            >.
          </button>
        {:else}
          <button
            type="button"
            class="grid place-items-center"
            on:click={() => numOperatorClicked(n)}
            aria-label={n.sign}
          >
            {#if n.sign === "backspace"}
              <BackSpace />
            {:else if n.sign === "equals"}
              <Equals />
            {:else if n.sign === "minus"}
              <Minus />
            {:else if n.sign === "divide"}
              <Divide />
            {:else if n.sign === "multiply"}
              <Multiply />
            {:else if n.sign === "add"}
              <Add />
            {/if}
          </button>
        {/if}
      {/if}
    {/each}
  </div>
</main>

<style>
  main {
    height: 100vh;
    height: calc(var(--vh, 1vh) * 100);
    display: grid;
    grid-template-rows: 1fr 1fr;
    grid-auto-flow: row;
    align-content: end;
    color: var(--text-color);
    background-color: var(--bkg-color);
    margin: 0 auto;
    max-width: 550px;
  }

  .numbers-and-operators {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    justify-items: stretch;
  }

  .numbers-and-operators button:nth-child(10) {
    grid-column: 1;
  }

  .numbers-and-operators button:nth-child(14) {
    grid-column: 1;
  }

  .numbers-and-operators button:nth-child(16) {
    grid-column: 4;
  }

  .blink {
    animation: 1s blinker step-end infinite;
  }

  @keyframes blinker {
    from,
    to {
      color: transparent;
    }
    50% {
      color: var(--text-color);
    }
  }
</style>
