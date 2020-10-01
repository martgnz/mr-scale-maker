<style>
  section {
    margin-bottom: 2rem;
  }
  .preview {
    margin-top: 0.5rem;
    overflow-x: scroll;
  }
  table {
    width: 100%;
    font-family: monospace;
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
    background-image: linear-gradient(to bottom, transparent, white);
    pointer-events: none;
  }
  td,
  th {
    position: relative;
  }
  td {
    border-bottom: 1px solid #e8e7e7;
  }
  th {
    border-bottom: 1px solid #111;
  }
  th:not(:last-child),
  td:not(:last-child) {
    padding-left: 5px;
    padding-right: 25px;
  }
  th:last-child,
  td:last-child {
    padding-right: 5px;
    padding-left: 25px;
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
  import { select, selectAll } from "d3-selection";
  import isDate from "lodash/isDate";
  import isFinite from "lodash/isFinite";
  import isString from "lodash/isString";

  import { data, columnData } from "./stores.js";

  let tbody;
  let thead;

  function getCellType(d) {
    switch (true) {
      case isDate(d):
        return "date";
        break;
      case isFinite(d):
        return "number";
        break;
      case isString(d):
        return "string";
        break;
      default:
        return "";
    }
  }

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
  <h2>2. Choose the column</h2>

  <div class="preview">
    {#if $data}
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
          {#each $data.slice(0, 6) as row}
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
    {/if}
  </div>
</section>
