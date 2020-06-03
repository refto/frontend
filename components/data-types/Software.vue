<template>
  <div>
    <a-avatar v-if="data.logo_addr != null" shape="square" :src="data.logo_addr" />
    <p v-html="data.description"></p>
    <ul v-if="data.links != null && data.links.length > 0" class="data-links">
      <li v-if="data.source_addr != null"><a-button :icon="sourceLinkIcon(data.source_addr)" :href="data.source_addr" type="primary">Source</a-button></li>
      <li v-for="l in data.links"><a-icon :type="l.icon == null ? 'link' : l.icon" /> <a :href="l.addr" target="_blank">{{l.label}}</a></li>
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
                // TODO need something to do with icon set, default ant-vue icons soo limited
                // if (addr.startsWith('https://bitbucket.org/')) {
                //     return 'bitbucket'
                // }

                // otherwise show generic icon
                // TODO better icon than "link" must be used, but ant-vue icon is too limited now
                return 'link'
            },
        },
    }
</script>
