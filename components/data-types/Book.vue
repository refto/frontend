<template>
  <div>
    <a-avatar v-if="data.picture_addr != null" shape="square" :src="data.picture_addr" />
    <p>
      by <span v-for="(author, i) in data.authors">
        <a v-if="author.addr!=null" :href="author.addr" target="_blank">{{author.name}}</a>
        <span v-else>{{author.name}}</span>
        <span v-if="i+1 < data.authors.length-1">, </span>
        <span v-if="i+1 === data.authors.length-1"> & </span>
    </span>
    </p>
    <p>{{data.description}}</p>
      <p>{{ data.publish_date }}</p>
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
