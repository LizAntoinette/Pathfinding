<template>
  <div id="app">
    <Index />
  </div>
</template>

<script>
import Index from "./components/Index";

export default {
  name: "App",
  components: { Index }
};
</script>

<style>
#app {
  font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
</style>
