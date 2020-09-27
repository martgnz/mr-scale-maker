<style>
  section {
    margin-bottom: 2rem;
  }
  .data-input {
    margin: 1rem 0;
  }
  .demo-dataset {
    display: inline;
    cursor: pointer;
  }
  .demo-dataset:hover {
    text-decoration: underline;
  }
  .small-note {
    margin-top: 0.25rem;
    color: #777;
    font-size: small;
  }
  .load-sample:hover {
    text-decoration: underline;
  }
  .drag {
    text-align: center;
    outline: 2px dashed #92b0b3;
    font-size: 1.25rem;
    background-color: white;
    position: relative;
    transition: outline-offset 0.15s ease-in-out, background-color 0.15s linear;
  }
  .drag:hover {
    background-color: #ebf7fb;
  }
  .drag.is-dragging {
    background-color: #ebf7fb;
  }

  .drag-icon {
    height: 30px;
    fill: #333;
  }
  .drag-file {
    width: 0.1px;
    height: 0.1px;
    opacity: 0;
    overflow: hidden;
    position: absolute;
    z-index: -1;
  }
  .drag-file + label {
    box-sizing: border-box;
    padding: 2rem;
    width: 100%;
    height: 200px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;
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
  import { parse } from "papaparse";
  import { dsvFormat, autoType } from "d3-dsv";

  import { data } from "./stores.js";
  import bytesToSize from "./bytes-to-size.js";
  import iris from "./iris.js";

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
  <h2>1. Upload your data (don't worry, everything stays in your computer)</h2>

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
      <div class="drag-input">
        <input
          id="file"
          class="drag-file"
          accept="text"
          bind:files
          type="file"
        />
        <label for="file">
          {#if isValidFile && !isUploaded}
            <div>
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
              <div>
                <strong>Drop a file</strong>
                <span class="drag-select">or select it</span>
              </div>
              <div class="small-note">CSV and TSV files are supported</div>
              <div
                class="small-note load-sample"
                on:click|preventDefault={loadSample}
              >
                (load sample data)
              </div>
            </div>
          {:else if isUploaded}
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path d="M0 0h24v24H0z" fill="none" />
                <path
                  d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9
                  2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3
                  3-1.34 3-3 3zm3-10H5V5h10v4z"
                />
              </svg>

              <div class="drag-filename">
                {fileMetadata.name} ({bytesToSize(fileMetadata.size)})
              </div>
            </div>
          {:else}
            <div>
              <strong>Error while reading the file</strong>
            </div>
            <div>please upload a valid CSV</div>
          {/if}

        </label>
      </div>
    </form>
  </div>
</section>
