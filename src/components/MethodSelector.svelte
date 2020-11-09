<style>
  label {
    display: block;
  }
  label:not(:last-child) {
    padding-bottom: 0.5rem;
    margin-bottom: 0.5rem;
    border-bottom: 1px solid var(--grey-light);
  }
</style>

<script>
  import Setting from "./setting.svelte";
  import { scale } from "../stores";

  // FIXME: is there some way to make adding a new scale easier?
  const scales = [
    "quantiles",
    "quantize",
    "quantize (nice)",
    // "equal breaks",
    "ckmeans",
  ];
  let selected = "quantiles";
</script>

<Setting
  name={'Method'}
  help="<p><strong>Quantiles</strong> creates breaks among roughly the same amount of records.</p>
    <p><strong>Quantize</strong> will divide the breaks among equal intervals. The nice variant will try to create better-looking intervals.</p>
    <p><strong>Ckmeans</strong> is a clustering algorithm that will minimise differences between groups.</p>"
>
  {#each scales as scaleSelect}
    <label>
      <input
        type="radio"
        bind:group={selected}
        on:change={() => ($scale = selected)}
        value={scaleSelect}
      />
      {scaleSelect}
    </label>
  {/each}
</Setting>
