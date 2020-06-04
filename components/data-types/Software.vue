<template>
  <div>
    <a-avatar v-if="data.logo_addr != null" shape="square" :src="data.logo_addr" />
    <p v-html="data.description"></p>
    <ul v-if="this.hasLinks()" class="data-links">
      <li v-if="data.source_addr != null"><a-button :icon="sourceLinkIcon(data.source_addr)" :href="data.source_addr" type="primary" class="source-btn">Source</a-button></li>
      <li v-for="l in data.links"><a :href="l.addr" target="_blank"><a-icon :type="l.icon == null ? 'link' : l.icon" /> {{l.label}}</a></li>
    </ul>
  </div>
</template>

<script>
    export default {
        props: ['data'],
        methods: {
            sourceLinkIcon(addr) {
                // show branded icon if recognizable
                if (addr.startsWith('https://github.com')) {
                    return 'github'
                }
                // TODO need something to do with icon set, default ant-vue icons is soo limited
                // if (addr.startsWith('https://bitbucket.org/')) {
                //     return 'bitbucket'
                // }

                // otherwise show generic icon
                // TODO better icon than "link" must be used, but ant-vue icon is too limited now
                return 'link'
            },
            hasLinks() {
                if (this.data.source_addr != null) {
                    return true
                }

                return this.data.links != null && this.data.links.length > 0
            }
        },
    }
</script>

<style>
  /* just to reduce accent of primary btn */
  .source-btn {
    background: #cbe1ff;
    color: #168be5;
    text-shadow: none;
  }
</style>
