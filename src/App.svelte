<style>
  main {
    padding: 0 9px;
    max-width: 1024px;
    margin: 1rem auto;
    line-height: 1.4;
  }
  @media (min-width: 600px) {
    main {
      padding: 0 2rem;
    }
  }
  header {
    margin-bottom: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--grey);
  }
  h1 {
    font-size: 1.75rem;
    font-weight: 700;
    text-align: left;
    margin-bottom: 0.5rem;
  }
  h2 {
    font-weight: 300;
    color: var(--black-2);
  }
</style>

<script>
  import Upload from "./Upload.svelte";
  import Table from "./Table.svelte";
  import Visualise from "./Visualise.svelte";
  import Export from "./Export.svelte";
  import Footer from "./Footer.svelte";
</script>

<main>
  <header>
    <h1>Mr. Scale Maker</h1>
    <h2>Visualise distributions and create scales for your data, quickly</h2>
  </header>

  <Upload />
  <Table />
  <Visualise />
  <Export />
  <Footer />
</main>
