<style>
  section {
    margin-top: 2rem;
  }
  .data-input {
    margin: 1rem 0;
  }
  .demo-dataset {
    display: inline;
    color: var(--grey-text);
    cursor: pointer;
  }
  .demo-dataset:hover {
    text-decoration: underline;
  }

  .load-sample:hover {
    text-decoration: underline;
  }
  .drag {
    text-align: center;
    outline: 1px dashed var(--grey-stroke);
    font-size: 1.25rem;
    background-color: var(--grey-bg);
    position: relative;
    transition: outline-offset 0.15s ease-in-out, background-color 0.15s linear;
  }
  .drag:hover,
  .drag.is-dragging {
    outline: 2px dashed var(--grey-stroke);
  }
  label {
    overflow: hidden;
    position: relative;
    box-sizing: border-box;
    padding: 1rem;
    width: 100%;
    height: 175px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
  label:hover .icon-bg-magic {
    transform: rotate(-10deg);
  }
  label:hover .icon-bg-error {
    transform: rotate(-48deg);
  }
  /* label:hover .icon-bg-success { */
  /* transform: rotate(-4deg); */
  /* } */
  .icon-bg-magic {
    pointer-events: none;
    z-index: 0;
    position: absolute;
    right: -1rem;
    top: -1.25rem;
    width: 12rem;
    height: 12rem;
    transform: rotate(-3deg);
    fill: var(--grey-light);
    transition: transform 0.2s;
  }
  .icon-bg-error {
    pointer-events: none;
    z-index: 0;
    position: absolute;
    right: -1rem;
    bottom: -2rem;
    width: 12rem;
    height: 12rem;
    transform: rotate(-60deg);
    fill: var(--grey-light);
    transition: transform 0.2s;
  }
  .icon-bg-success {
    pointer-events: none;
    z-index: 0;
    position: absolute;
    right: -2rem;
    bottom: -1.5rem;
    width: 12rem;
    height: 12rem;
    transform: rotate(0);
    fill: var(--grey-light);
    transition: transform 0.2s;
  }
  .drag-callout {
    z-index: 1;
    margin-top: -1rem;
  }
  .drag-callout-title {
    font-size: 1.25rem;
    font-weight: 500;
    position: relative;
  }
  .drag-icon {
    position: absolute;
    top: 0.25rem;
    left: -2rem;
    fill: #333;
  }
  .small-note {
    position: absolute;
    bottom: 1rem;
    color: var(--grey-text);
    font-size: small;
  }
  .drag-file {
    width: 0.1px;
    height: 0.1px;
    opacity: 0;
    overflow: hidden;
    position: absolute;
    z-index: -1;
  }
  .drag-filename {
    pointer-events: none;
    font-weight: 500;
  }
  .drag-filesize {
    pointer-events: none;
    margin-top: 0.25rem;
    color: var(--grey-text);
    font-size: small;
  }
  .drag-success {
    height: 100px;
  }
  .underline {
    text-decoration: underline;
  }
  .error {
    position: relative;
    overflow: hidden;
    text-align: center;
    padding: 5rem;
    background: #f8f8f8;
  }
  .drag-error-title {
    font-weight: 500;
  }
  .drag-error-hint {
    margin-top: 0.25rem;
    color: var(--grey-text);
    font-size: 1rem;
  }
  .error svg {
    fill: #e6e6e6;
    position: absolute;
    right: -1rem;
    bottom: -1rem;
    width: 140px;
    transform: rotate(-87deg);
  }
</style>

<script>
  import StepHeader from "./components/StepHeader.svelte";
  import { parse } from "papaparse";
  import { dsvFormat, autoType } from "d3-dsv";

  import { data } from "./stores.js";
  import bytesToSize from "./utils/bytes-to-size.js";
  import iris from "./utils/iris.js";

  let isDragging = false;
  let files;
  let fileMetadata;

  $: isValidFile = true;
  $: isUploaded = false;

  $: if (files) {
    // read file picker file
    const [file] = files;
    readFile(file);
  }

  loadSample();

  function loadSample() {
    // load sample data set in the store
    data.set(iris);
  }

  function dropped(event) {
    const [file] = event.dataTransfer.files;
    readFile(file);
  }

  function readFile(file) {
    const reader = new FileReader();

    if (
      file.type.match("text/csv") ||
      file.type.match("text/tsv") ||
      file.type.match("text/txt")
    ) {
      reader.readAsText(file);

      reader.onload = () => {
        isUploaded = true;
        fileMetadata = file;

        // use papaparse to parse the text file
        const { meta } = parse(reader.result);

        // get it into a an array with the delimeter found by papaparse
        const dsv = dsvFormat(meta.delimiter, "utf-8");

        // pass data to the store
        data.set(dsv.parse(reader.result, autoType));
      };
    } else {
      isUploaded = false;
      isValidFile = false;
    }
  }
</script>

<section id="upload">
  <StepHeader step={1}>
    Upload your spreadsheet (don’t worry, everything stays on your computer)
  </StepHeader>

  <div class="data-input">
    <form
      on:dragover|preventDefault
      on:dragenter={() => (isDragging = true)}
      on:dragleave={() => (isDragging = false)}
      on:drop|preventDefault|stopPropagation={dropped}
      class={['drag', isDragging ? 'is-dragging' : ''].join(' ')}
      method="post"
      enctype="multipart/form-data"
    >
      <div class={['drag-input', isUploaded ? 'is-uploaded' : ''].join(' ')}>
        <input
          id="file"
          class="drag-file"
          accept="text"
          bind:files
          type="file"
        />
        <label for="file">
          {#if isValidFile && !isUploaded}
            <svg
              class="icon-bg-magic"
              xmlns="http://www.w3.org/2000/svg"
              enable-background="new 0 0 24 24"
              height="24"
              viewBox="0 0 24 24"
              width="24"
            ><g>
                <rect fill="none" height="24" width="24" />
              </g>
              <g>
                <g>
                  <path
                    d="M21,8c-1.45,0-2.26,1.44-1.93,2.51l-3.55,3.56c-0.3-0.09-0.74-0.09-1.04,0l-2.55-2.55C12.27,10.45,11.46,9,10,9 c-1.45,0-2.27,1.44-1.93,2.52l-4.56,4.55C2.44,15.74,1,16.55,1,18c0,1.1,0.9,2,2,2c1.45,0,2.26-1.44,1.93-2.51l4.55-4.56 c0.3,0.09,0.74,0.09,1.04,0l2.55,2.55C12.73,16.55,13.54,18,15,18c1.45,0,2.27-1.44,1.93-2.52l3.56-3.55 C21.56,12.26,23,11.45,23,10C23,8.9,22.1,8,21,8z"
                  />
                  <polygon
                    points="15,9 15.94,6.93 18,6 15.94,5.07 15,3 14.08,5.07 12,6 14.08,6.93"
                  />
                  <polygon points="3.5,11 4,9 6,8.5 4,8 3.5,6 3,8 1,8.5 3,9" />
                </g>
              </g></svg>
            <div class="drag-callout">
              <div class="drag-callout-title">
                <svg
                  class="drag-icon"
                  xmlns="http://www.w3.org/2000/svg"
                  height="24"
                  viewBox="0 0 24 24"
                  width="24"
                >
                  <path d="M0 0h24v24H0z" fill="none" />
                  <path d="M5 4v2h14V4H5zm0 10h4v6h6v-6h4l-7-7-7 7z" />
                </svg>

                <div>Drop your file</div>
              </div>
              <div class="drag-select">or <span class="underline">select it</span></div>
            </div>
            <div class="small-note">CSV and TSV files are supported</div>
          {:else if isUploaded}
            <svg
              class="icon-bg-success"
              xmlns="http://www.w3.org/2000/svg"
              enable-background="new 0 0 24 24"
              height="24"
              viewBox="0 0 24 24"
              width="24"
            ><g>
                <rect fill="none" height="24" width="24" />
              </g>
              <g>
                <g>
                  <path
                    d="M7,19c-1.1,0-2,0.9-2,2h14c0-1.1-0.9-2-2-2h-4v-2h3c1.1,0,2-0.9,2-2h-8c-1.66,0-3-1.34-3-3c0-1.09,0.59-2.04,1.46-2.56 C8.17,9.03,8,8.54,8,8c0-0.21,0.04-0.42,0.09-0.62C6.28,8.13,5,9.92,5,12c0,2.76,2.24,5,5,5v2H7z"
                  />
                  <path
                    d="M10.56,5.51C11.91,5.54,13,6.64,13,8c0,0.75-0.33,1.41-0.85,1.87l0.59,1.62l0.94-0.34l0.34,0.94l1.88-0.68l-0.34-0.94 l0.94-0.34L13.76,2.6l-0.94,0.34L12.48,2L10.6,2.68l0.34,0.94L10,3.97L10.56,5.51z"
                  />
                  <circle cx="10.5" cy="8" r="1.5" />
                </g>
              </g></svg>
            <div>
              <div class="drag-filename">{fileMetadata.name}</div>
              <div class="drag-filesize">{bytesToSize(fileMetadata.size)}</div>
            </div>
          {:else}
            <svg
              class="icon-bg-error"
              xmlns="http://www.w3.org/2000/svg"
              height="24"
              viewBox="0 0 24 24"
              width="24"
            ><path d="M0 0h24v24H0z" fill="none" />
              <path
                d="M4.59 6.89c.7-.71 1.4-1.35 1.71-1.22.5.2 0 1.03-.3 1.52-.25.42-2.86 3.89-2.86 6.31 0 1.28.48 2.34 1.34 2.98.75.56 1.74.73 2.64.46 1.07-.31 1.95-1.4 3.06-2.77 1.21-1.49 2.83-3.44 4.08-3.44 1.63 0 1.65 1.01 1.76 1.79-3.78.64-5.38 3.67-5.38 5.37 0 1.7 1.44 3.09 3.21 3.09 1.63 0 4.29-1.33 4.69-6.1H21v-2.5h-2.47c-.15-1.65-1.09-4.2-4.03-4.2-2.25 0-4.18 1.91-4.94 2.84-.58.73-2.06 2.48-2.29 2.72-.25.3-.68.84-1.11.84-.45 0-.72-.83-.36-1.92.35-1.09 1.4-2.86 1.85-3.52.78-1.14 1.3-1.92 1.3-3.28C8.95 3.69 7.31 3 6.44 3 5.12 3 3.97 4 3.72 4.25c-.36.36-.66.66-.88.93l1.75 1.71zm9.29 11.66c-.31 0-.74-.26-.74-.72 0-.6.73-2.2 2.87-2.76-.3 2.69-1.43 3.48-2.13 3.48z"
              /></svg>
            <div class="drag-error-title">Error while reading the file</div>
            <div class="drag-error-hint">please upload a valid CSV</div>
          {/if}
        </label>
      </div>
    </form>
  </div>
</section>
