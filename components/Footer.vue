<template>
  <a-layout-footer>
    <a-row class="footerLinks">
      <a-col :span="8">
        <p><a href="https://refto.dev">refto.dev</a><br>work in progress</p>
      </a-col>
      <a-col :span="8">
        <ul>
          <li>
            <a-icon type="question" />
            <a href="https://github.com/refto/data#how-it-works" target="_blank">How it works</a></li>
          <li>
            <a-icon type="question" />
            <a href="https://github.com/refto/data/blob/master/CONTRIBUTING.md" target="_blank">How to contribute</a></li>
        </ul>
      </a-col>
      <a-col :span="8">
        <ul>
          <li>
            <a-icon type="github"/>
            <a href="https://github.com/refto/data" target="_blank">Data source</a></li>
          <li>
            <a-icon type="github"/>
            <a href="https://github.com/refto/frontend" target="_blank">Frontend source</a></li>
          <li>
            <a-icon type="github"/>
            <a href="https://github.com/refto/server" target="_blank">Server source</a></li>
        </ul>
      </a-col>
    </a-row>
  </a-layout-footer>
</template>

<script>
    export default {}
</script>

<style>
  .footerLinks {
    font-size: 16px;
  }

  .footerLinks li {
    list-style: none;
    padding: 5px;
  }

  .footerLinks li a {
    color: #00ace5;
    text-decoration: underline;
  }

  .footerLinks li a:hover {
    color: white;
    text-decoration: none;
  }

  .ant-layout-footer {
    background: #001529;
  }

  .ant-layout-footer * {
    color: #ececec;
  }
</style>
