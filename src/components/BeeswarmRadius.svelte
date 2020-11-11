<style>
  .beeswarm-radius {
    display: flex;
    flex-direction: column;
  }
  .beeswarm-radius-title {
    font-size: 0.85rem;
    margin-bottom: 0.15rem;
  }
  @media (min-width: 600px) {
    .beeswarm-radius {
      font-size: 1rem;
      align-items: center;
      flex-direction: row;
    }
    .beeswarm-radius-title {
      margin-right: 0.5rem;
    }
  }
</style>

<script>
  import { beeswarmRadius, defaultBeeswarmRadius } from "../stores";

  let radiusOptions = [1, 2, 4, 6, 8];
</script>

<div class="beeswarm-radius">
  <div class="beeswarm-radius-title">Circle radius</div>
  <div class="button-group">
    {#each radiusOptions as number}
      <button
        on:click={() => ($beeswarmRadius = number)}
        class:active={$beeswarmRadius ? $beeswarmRadius === number : $defaultBeeswarmRadius === number}
      >
        {number}
      </button>
    {/each}
  </div>
</div>
