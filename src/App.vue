<template>
  <main id="app">
    <h1>Projeto Pokemon</h1>
  </main>
</template>

<script>

export default {
  name: 'App',
  components: {
    
  }
}
</script>

<style>
  /* Reset */
  * {
    font-family: 'Orbitron', sans-serif;
    font-weight: normal;
    font-size: 100%;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  h1, h2 {
    font-weight: bold;
  }

  h1 {
    font-size: 2.5rem;
  }

  h2 {
    font-size: 2rem;
  }

  .centralizar {
    display: flex;
    justify-content: center;
    width: 100%;
  }

  .espacar {
    padding: 10px;
  }

  /* ############### CORPO ############### */

  #app {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>
