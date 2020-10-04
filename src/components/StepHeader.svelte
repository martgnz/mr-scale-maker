<style>
  .step-header {
    position: relative;
    margin-bottom: 1.5rem;
  }
  h3 {
    font-weight: 400;
  }
  .step-number {
    display: flex;
    margin-bottom: 0.5rem;
    align-items: center;
    text-align: center;
    justify-content: center;
    color: white;
    font-weight: 700;
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
  }
  .step-enabled {
    background: var(--red-highlight);
  }
  .step-disabled {
    background: var(--grey-stroke);
  }
  @media (min-width: 740px) {
    .step-header {
      display: flex;
      align-items: center;
    }
    .step-number {
      margin-bottom: 0;
      margin-right: 0.5rem;
    }
  }
  @media (min-width: 1140px) {
    h3 {
      display: inline-block;
    }
    .step-number {
      margin-right: 0;
      position: absolute;
      top: -0.25rem;
      left: -2.75rem;
    }
  }
</style>

<script>
  export let step;
  export let enabled = true;
</script>

<div class="step-header">
  <div
    class={['step-number', enabled ? 'step-enabled' : 'step-disabled'].join(' ')}
  >
    {step}
  </div>
  <h3>
    <slot />
  </h3>
</div>
