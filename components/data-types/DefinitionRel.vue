<template>
  <div>
    <a-avatar v-if="data.picture_addr != null" shape="square" :src="data.picture_addr" />
    <p v-if="data.description != null" v-html="data.description"></p>
    <a-list v-if="this.hasLinks()" >
      <a-list-item v-for="l in data.links">
        <div><a :href="l.addr" target="_blank"><a-icon :type="l.icon == null ? 'link' : l.icon" /> {{l.label}}</a></div>
        <p v-if="l.description != null" v-html="l.description" class="def-link-description"></p>
      </a-list-item>
    </a-list>
  </div>
</template>

<script>
    export default {
        props: ['data'],
        methods: {
            hasLinks() {
                return this.data.links != null && this.data.links.length > 0
            }
        },
    }
</script>
<style>
  .ant-list-item {
    display: block;
    padding: 15px 25px;
    font-size: 120%;
  }
  .ant-list {
    margin: 0 -22px;
  }
  .def-link-description{
    padding-left: 20px;
  }
</style>
