<style>
  main {
    padding: 0 9px;
    max-width: 960px;
    margin: 1rem auto;
    line-height: 1.4;
  }
  h1 {
    font-size: 1.75rem;
    font-weight: 700;
    text-align: left;
    margin-bottom: 1.25rem;
  }
</style>

<script>
  import Upload from "./Upload.svelte";
  import Table from "./Table.svelte";
  import Visualise from "./Visualise.svelte";
  import Export from "./Export.svelte";
</script>

<main>
  <h1>Mr. Scale Maker</h1>

  <Upload />
  <Table />
  <Visualise />
  <Export />
</main>
