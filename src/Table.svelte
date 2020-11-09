<style>
  .preview {
    position: relative;
    margin-top: 0.5rem;
    text-align: center;
  }
  button {
    margin-top: 0.75rem;
    cursor: pointer;
    border-radius: 2rem;
    padding: 0.75rem 1.5rem;
    font-weight: 500;
    color: white;
    background: var(--blue-highlight);
    font-size: 1rem;
    border: none;
  }
  button:not([disabled]):hover {
    background: #3988d6;
  }
  button[disabled] {
    cursor: default;
    opacity: 0.5;
  }
  .row-size {
    color: var(--grey-text);
    font-size: 0.85rem;
    margin-top: 0.5rem;
  }
  @media (min-width: 350px) {
    .row-size {
      margin-top: 0;
      position: absolute;
      bottom: 0.75rem;
      right: 0;
    }
  }
  .table-container {
    overflow-x: scroll;
  }
  table {
    width: 100%;
    font-family: var(--mono);
    font-size: 0.85rem;
    position: relative;
    overflow: hidden;
    text-align: left;
  }
  table:after {
    content: "";
    position: absolute;
    bottom: 0;
    height: 4rem;
    width: 100%;
    /* background-image: linear-gradient(to bottom, transparent, white); */
    pointer-events: none;
  }
  td,
  th {
    position: relative;
  }
  td {
    border-bottom: 1px solid var(--grey-light);
    white-space: nowrap;
    max-width: 20%;
  }
  th {
    font-family: var(--sans-serif);
    font-weight: 500;
    border-bottom: 1px solid #111;
    vertical-align: bottom;
  }
  th:not(:first-child),
  td:not(:first-child) {
    padding-left: 25px;
    padding-right: 5px;
  }
  th:first-child,
  td:first-child {
    padding-right: 25px;
    padding-left: 5px;
  }
  th:not(:first-child):not(:last-child) {
    padding-bottom: 2px;
  }
  td:not(:first-child):not(:last-child) {
    padding-top: 10px;
    padding-bottom: 10px;
  }
  th.number {
    text-align: right;
  }
  td.number {
    text-align: right;
    font-size: 0.9rem;
    color: #3182bd;
  }
  td.string {
    color: #756bb1;
  }
  td.date {
    color: #e17f58;
  }

  /* Hover over the whole column */
  td:hover::after,
  th:not(:empty):hover::after,
  td.checked::after,
  th:not(:empty).checked::after {
    content: "";
    height: 10000px;
    left: 0;
    position: absolute;
    top: -5000px;
    width: 100%;
    z-index: -1;
  }
  td.number,
  th.number {
    cursor: pointer;
  }
  td.number:hover::after,
  th.number:hover::after,
  th.number.checked::after,
  td.number.checked::after {
    background-color: #ffffdd;
  }
</style>

<script>
  import { format } from "d3-format";
  import { select, selectAll } from "d3-selection";

  import StepHeader from "./components/StepHeader.svelte";
  import getCellType from "./utils/get-cell-type";
  import { data, columnData } from "./stores.js";

  const ft = format(",");

  $: showRows = 10;
  $: handleMoreRows = () => {
    if (showRows + 10 > $data.length) {
      showRows = $data.length;
      return;
    }

    showRows = 10 + showRows;
    return;
  };

  let tbody;
  let thead;

  function updateColumn(column, event) {
    // FIXME: we return if the first row of the series is not a number
    if (getCellType($data[0][column]) !== "number") return;

    // highlight the column
    // FIXME: do we need d3 for this?
    const isRow = event.target.nodeName === "TD";
    const cellIndex = isRow && event.target.cellIndex;

    // first, reset the selected class
    selectAll(".checked").classed("checked", false);

    // Now, highlight the whole column
    if (isRow) {
      select(thead)
        .selectAll("th")
        .nodes()
        .filter((d) => d.textContent === column)
        .forEach((e) => e.classList.add("checked"));

      select(tbody)
        .selectAll("td")
        .nodes()
        .filter((d) => d.cellIndex === cellIndex)
        .forEach((e) => e.classList.add("checked"));
    } else {
      select(event.target).classed("checked", true);
    }

    // set the data in the store
    columnData.set({ data: $data.map((d) => d[column]), column: column });
  }
</script>

<section id="choose">
  <StepHeader enabled={$data} step={2}>
    Select the (numeric) column that you want to inspect
  </StepHeader>

  <div class="preview">
    {#if $data}
      <div class="table-container">
        <table>
          <thead>
            <tr bind:this={thead}>
              {#each $data.columns as column}
                <th
                  class={getCellType($data[0][column])}
                  on:click={(event) => updateColumn(column, event)}
                >
                  {column}
                </th>
              {/each}
            </tr>
          </thead>

          <tbody bind:this={tbody}>
            {#each $data.slice(0, showRows) as row}
              <tr>
                {#each $data.columns as column}
                  <td
                    on:click={(event) => updateColumn(column, event)}
                    class={getCellType(row[column])}
                  >
                    {row[column]}
                  </td>
                {/each}
              </tr>
            {/each}
          </tbody>
        </table>
      </div>

      <button
        on:click={handleMoreRows}
        disabled={showRows === $data.length}
      >Load more rows</button>
      <div class="row-size">
        {ft($data.length < showRows ? $data.length : showRows)}/{ft($data.length)}
        rows
      </div>
    {/if}
  </div>
</section>
