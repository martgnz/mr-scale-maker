<style>
  .settings-group {
    flex-basis: 33.33%;
  }
</style>

<script>
  export let name;
</script>

<div class="settings-group">
  <div class="setting-name">{name}</div>
  <slot />
</div>
