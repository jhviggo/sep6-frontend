<script>
  import TheHeader from "../components/theHeader.svelte";
  import TheFooter from "../components/theFooter.svelte";
</script>

<TheHeader />
<slot></slot>
<TheFooter />

<style global>
  :global(body) {
    background-color: #efefef;
  }
</style>