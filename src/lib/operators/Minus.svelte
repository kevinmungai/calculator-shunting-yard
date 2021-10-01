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
  viewBox="0 0 24 24"><path d="M19 12.998H5v-2h14z" fill="currentColor" /></svg
>
