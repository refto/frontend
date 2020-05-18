<template>
  <a-layout>
    <a-layout-header :style="{ position: 'fixed', zIndex: 1, width: '100%' }">
      <a-select
        size="large"
        mode="multiple"
        style="width: 100%"
        allowClear
        showArrow
        label-in-value
        :value="selectedTopics"
        :loading="loading"
        placeholder="Select topics..."
        @change="handleTopicChange"
      >
        <a-spin v-if="loading" slot="notFoundContent" size="small" />
        <a-select-option v-for="item in topics" :key="item" :value="item">
          {{ item }}
        </a-select-option>
      </a-select>
    </a-layout-header>
      <a-layout-content :style="{ marginTop: '64px' }">
        <div style="background-color: #ececec; padding: 20px;">
        <a-row :gutter="16" type="flex"  align="top">
          <a-col :span="6"  v-for="d in data" :key="d.token">
        <a-card>
          <a slot="extra" :href="editAddr(d.token, d.type)"  target="_blank"><a-icon type="edit"  title="Edit this" /></a>
          <a slot="title" :href="d.data.home_addr" :title="d.data.title"  target="_blank">
            <a-icon :type="getIcon(d.data, d.type)" />
            {{d.data.title}}</a>
          <component v-bind:is="components[d.type]" :data="d.data"></component>
          <a-button-group v-if="topicsDiff(d.data.topics).length > 0">
            <a-button v-for="(t, i) in topicsDiff(d.data.topics)" @click="addTopic(t)" :key="i">
              +{{t}}
            </a-button>
          </a-button-group>
        </a-card>
          </a-col>
        </a-row>
        </div>
      </a-layout-content>
    <a-layout-footer>refto.dev wip</a-layout-footer>
  </a-layout>
</template>
<script>
    import GenericType from "../components/data-types/Generic.vue";
    import BookType from "../components/data-types/Book.vue";

    export default {
        data() {
            return {
                data: [],
                topics: [],
                selectedTopics: [],
                loading: false,

                components: {
                    '': GenericType,
                    'generic': GenericType,
                    'book': BookType,
                }
            };
        },

        components: {
            GenericType,
            BookType,
        },

        beforeMount() {
            this.setSelectedTopicsFromPath()
            this.loadData()
        },

        methods: {
            async loadData() {
                this.loading = true
                // todo: there must be a better way to searialize array into query string
                let path = '/entities/'
                let qs = []
                if (this.selectedTopics.length > 0) {
                    for (let i = 0; i < this.selectedTopics.length; i++) {
                        qs[i] = "topics=" + this.selectedTopics[i].key;
                    }
                }
                if (qs.length > 0) {
                    path += "?" + qs.join("&")
                }

                try {
                    await this.$axios.$get(path).then((resp) => {
                        this.data = resp.entities
                        this.topics = resp.topics
                    })
                } catch (e) {
                    this.$notify({
                        type: 'error',
                        title: 'Failed to load data',
                        text: e.response.data.error
                    })
                }
                this.loading = false
            },

            handleTopicChange(selectedTopics) {
                this.topics = []
                this.selectedTopics = selectedTopics;
                this.setPathFromSelectedTopics()
                this.loadData()
            },

            topicsDiff(topics) {
                let sTopics = []
                for (let i = 0; i < this.selectedTopics.length; i++) {
                    sTopics.push(this.selectedTopics[i].key)
                }
                return topics.filter(x => !sTopics.includes(x));
            },

            addTopic(t) {
                this.selectedTopics.push({key: t, label: t})
                this.setPathFromSelectedTopics()
                this.loadData()
            },

            setSelectedTopicsFromPath() {
                let pathTopics = this.$route.params.pathMatch
                if (pathTopics === "") {
                    return
                }
                const topics = pathTopics.split(',');
                for (let i = 0; i < topics.length; i++) {
                    this.selectedTopics.push({key: topics[i], label: topics[i]})
                }
            },

            setPathFromSelectedTopics() {
                let sTopics = []
                for (let i = 0; i < this.selectedTopics.length; i++) {
                    sTopics.push(encodeURIComponent(this.selectedTopics[i].key))
                }

                history.pushState(
                    {},
                    null,
                    "/" + sTopics.join(',')
                )
            },

            editAddr(name, type) {
                let t = ""
                if (type !== "") {
                    t = "." + type
                }
                if (name.startsWith("/")) {
                    name = name.slice(1)
                }
                return "https://github.com/refto/data/edit/master/" + name + t + ".yaml"
            },

            getIcon(data, type) {
                if (type === 'book') {
                    return 'book'
                }

                if (data.home_addr.startsWith('https://github.com')) {
                    return 'github'
                }

                return "link"
            },
        },

        computed: {
        },
    };
</script>

<style>
  .data-links {
    margin: 0 0 20px 0;
    padding: 0;
    display: block;
  }
  .data-links li {
    list-style: none;
    display: inline-block;
    margin-right: 10px;
  }
  .ant-avatar {
    float: right;
    margin-left: 10px;
    margin-bottom: 10px;
    width: 100px;
    height: initial;
  }
  body {
    font-family: 'Roboto', sans-serif;
  }
  .ant-card {
    box-shadow: inset 0 0 0 2px white;
    border: none;
    margin-bottom: 20px;
  }
  .ant-card:hover {
    box-shadow: inset 0 0 0 2px #168be5, 0 0 5px rgba(0, 0, 0, 0.2);
  }
  .ant-card-head {
    border-bottom: none;
    font-weight: 300;
    font-size: 22px;
  }
  .ant-card-body {
    padding-top: 0;
  }
</style>
