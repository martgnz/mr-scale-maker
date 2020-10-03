<style>
  section {
    margin-top: 2rem;
    margin-bottom: 2rem;
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
  .drag-file + label {
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
  .drag-callout {
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
    font-weight: 500;
  }
  .drag-filesize {
    margin-top: 0.25rem;
    color: var(--grey-text);
    font-size: small;
  }
  .drag-success {
    height: 100px;
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

    // FIXME: this seems too broad
    // should we really restrict to csv/tsv?
    if (file.type.match("text.*")) {
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
    Upload your spreadsheet (don't worry, everything stays in your computer)
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
              <div class="drag-select">or select it</div>
            </div>
            <div class="small-note">CSV and TSV files are supported</div>
          {:else if isUploaded}
            <div>
              <div class="drag-filename">{fileMetadata.name}</div>
              <div class="drag-filesize">{bytesToSize(fileMetadata.size)}</div>
            </div>
          {:else}
            <div class="drag-error-title">Error while reading the file</div>
            <div class="drag-error-hint">please upload a valid CSV</div>
          {/if}
        </label>
      </div>
    </form>
  </div>
</section>
