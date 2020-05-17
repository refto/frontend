<template>
  <div>
    <a-avatar v-if="data.picture_addr != null" shape="square" :src="data.picture_addr" />
    <p>{{data.description}}</p>

    <ul v-if="data.links != null && data.links.length > 0" class="data-links">
      <li v-for="l in data.links"><a-icon :type="l.icon == null ? 'link' : l.icon" /> <a :href="l.addr" target="_blank">{{l.label}}</a></li>
    </ul>
  </div>
</template>

<script>
    export default {
        props: ['data'],
    }
</script>
