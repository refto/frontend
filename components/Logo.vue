<template>
  <div id="logo">
    <a href="/">r<span id="logoSpan">efto.dev</span></a>
  </div>
</template>

<script>
    export default {}
</script>

<style>
  #logo a {
    color: #ececec;
    font-size: 50px;
  }

  @media only screen and (max-width: 1000px) {
    #logo a {
      width: 80px;
      font-size: 30px;
    }
  }

  @media only screen and (max-width: 700px) {
    #logoSpan {
      display: none;
    }
    #logo a {
      font-size: 50px;
    }
  }
</style>
