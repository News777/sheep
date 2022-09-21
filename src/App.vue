<template>
  <index />
</template>

<script>
import Index from '@/views/index';
export default {
  name: 'App',
  components: {
    Index,
  },
};
</script>

<style lang="scss">
body,
html,
#app {
  width: 100%;
  height: 100%;
}
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>
