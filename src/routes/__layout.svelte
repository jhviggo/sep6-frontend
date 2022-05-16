<script>
  import TheHeader from "../components/theHeader.svelte";
</script>

<TheHeader />
<slot></slot>

<style global>
  :global(body) {
    background-color: #efefef;
  }
</style>