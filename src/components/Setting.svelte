<style>
  .setting-group:not(:last-child) {
    margin-bottom: 1.5rem;
  }
  .setting-title {
    position: relative;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid var(--black);
    padding-bottom: 0.15rem;
    margin-bottom: 0.5rem;
  }
  .setting-name {
    font-weight: 500;
  }
  .setting-help svg {
    cursor: pointer;
    fill: var(--grey-stroke);
  }
  .setting-help svg:hover {
    fill: var(--blue-highlight);
  }
  .setting-help.active svg {
    fill: var(--blue-highlight);
  }
  .help-tooltip {
    right: 0;
    top: 1.5rem;
    line-height: 1.3;
    width: 200px;
    pointer-events: none;
    font-size: 0.85rem;
    position: absolute;
    background: white;
    padding: 4px;
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);
    border: 1px solid #f5f5f5;
    z-index: 1;
  }
  :global(.help-tooltip p) {
    margin-bottom: 0.35rem;
  }
</style>

<script>
  export let name = "Setting";
  export let help = "This is some help text";

  let showTooltip = false;
</script>

<div class="setting-group">
  <div class="setting-title">
    <div class="help-tooltip" style="display: {showTooltip ? 'block' : 'none'}">
      {@html help}
    </div>

    <div class="setting-name">{name}</div>
    <div
      class={['setting-help', showTooltip ? 'active' : ''].join(' ')}
      on:mousemove={() => (showTooltip = true)}
      on:mouseleave={() => (showTooltip = false)}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="18"
        viewBox="0 0 24 24"
        width="18"
      ><path d="M0 0h24v24H0z" fill="none" />
        <path
          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"
        /></svg>
    </div>
  </div>
  <slot />
</div>
