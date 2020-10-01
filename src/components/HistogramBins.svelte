<script>
  import { binTicks } from "../stores";

  let binTickOptions = [10, 20, 50, 100];
</script>

<div>Histogram bins</div>
<div class="button-group">
  {#each binTickOptions as number}
    <button
      on:click={() => ($binTicks = number)}
      class={$binTicks === number ? 'active' : ''}
    >
      {number}
    </button>
  {/each}
</div>
