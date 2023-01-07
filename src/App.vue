<template>
  <div id="app">
    <power-4 />
  </div>
</template>

<script>
import Power4 from './components/Power4.vue'
export default {
  name: 'App',
  components: {
    'power-4': Power4,
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
  height:100%;
  
}
</style>
