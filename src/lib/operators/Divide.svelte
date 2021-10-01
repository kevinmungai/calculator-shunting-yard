<script lang="ts">
  export let onNumberPad: boolean = true;
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  xmlns:xlink="http://www.w3.org/1999/xlink"
  aria-hidden="true"
  role="img"
  class="iconify iconify--ic fill-current max-w-none w-6"
  class:text-operator-color={onNumberPad}
  class:text-text-color={!onNumberPad}
  class:w-full={onNumberPad}
  width="32"
  height="32"
  preserveAspectRatio="xMidYMid meet"
  viewBox="0 0 24 24"
>
  <path
    d="M5 11h14v2H5zm7.002-7a2 2 0 1 0-.004 4a2 2 0 0 0 .004-4zm0 12a2 2 0 1 0-.004 4a2 2 0 0 0 .004-4z"
    fill="currentColor"
  />
</svg>
