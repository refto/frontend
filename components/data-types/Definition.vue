<template>
  <div>
    <a-avatar v-if="data.picture_addr != null" shape="square" :src="data.picture_addr" />
    <p v-html="data.description"></p>
    <div v-if="this.hasLinks()" class="definition-links">
      <a v-for="l in data.links" :href="l.addr" target="_blank"><a-icon :type="l.icon == null ? 'link' : l.icon" /> {{l.label}}</a>
    </div>
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
  .definition-links {
    text-align: center;
    padding-bottom: 20px;
  }
  .definition-links a {
    display: inline-block;
    padding: 3px 10px;
    margin: 0 5px 5px 0;
    border-radius: 3px;
    background: #00b6ff;
    color: white;
  }
  .definition-links a:hover {
    background: #0096ff;
  }
</style>
