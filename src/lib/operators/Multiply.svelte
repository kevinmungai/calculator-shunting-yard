<script lang="ts">
  export let onNumberPad: boolean = true;
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  xmlns:xlink="http://www.w3.org/1999/xlink"
  aria-hidden="true"
  role="img"
  class="iconify iconify--uim fill-current text-operator-color max-w-none w-6"
  class:text-operator-color={onNumberPad}
  class:text-text-color={!onNumberPad}
  class:w-full={onNumberPad}
  width="32"
  height="32"
  preserveAspectRatio="xMidYMid meet"
  viewBox="0 0 24 24"
  ><path
    class="uim-primary"
    d="M7 18a1 1 0 0 1-.707-1.707l10-10a1 1 0 0 1 1.414 1.414l-10 10A.997.997 0 0 1 7 18z"
    fill="currentColor"
  /><path
    class="uim-primary"
    d="M17 18a.997.997 0 0 1-.707-.293l-10-10a1 1 0 0 1 1.414-1.414l10 10A1 1 0 0 1 17 18z"
    fill="currentColor"
  /></svg
>
