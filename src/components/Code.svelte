<style>
  pre {
    position: relative;
    font-size: 0.85rem;
    font-family: var(--mono);
    background: #f6f6f6;
    overflow: auto;
    padding: 1rem;
    margin-bottom: 1rem;
  }
  div {
    background: white;
    cursor: pointer;
    padding: 5px;
    padding-bottom: 0;
    border-radius: 6px;
    position: absolute;
    top: 0.5rem;
    right: 0.75rem;
    border: 1px solid #d7d7d7;
  }
  div:hover {
    background: #f6f6f6;
  }
</style>

<script>
  export let code;

  let textArea;

  function handleCopy() {
    if (!navigator.clipboard) {
      return;
    }

    navigator.clipboard.writeText(code);
  }
</script>

<!-- prettier-ignore -->
<pre>
  <code bind:this={textArea}>{code}</code><div on:click={handleCopy} title="Copy"><svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 0 24 24" width="16"><path d="M0 0h24v24H0z" fill="none"/><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg></div>
</pre>
