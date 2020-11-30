<template>
  <a-layout>
    <a-layout-content>
      <a-row>
        <a-col :span="24" style="padding: 30px">
          <h1>Processing...</h1>
          <a-spin size="large" v-if="loading"/>
          <a-alert v-if="this.error !=''"
                   message="Whoops"
                   type="error"
                   show-icon
          >
            <p slot="description" v-html="this.error"></p>
          </a-alert>
        </a-col>
      </a-row>
    </a-layout-content>
    <a-layout-footer>
          <p v-if="!loading"><a href="https://refto.dev/">refto.dev</a></p>
    </a-layout-footer>
  </a-layout>
</template>
<script>
    export default {
        data() {
            return {
                error: "",
                loading: false
            };
        },

        mounted() {
            let code = this.$route.query.code
            if (code === undefined) {
                this.$router.replace({ path: '/' })
            }

            this.login(code)
        },

        components: {},

        methods: {
            async login(code) {
                this.error = ""
                this.loading = true
                try {
                    let resp = await this.$axios.$post('/user/login/', {code: code})
                    this.loading = false
                    this.$store.commit('setAuth', resp)
                    this.$router.push('/')
                } catch (e) {}
            },
        },

        watch: {},
        computed: {},
    };
</script>

<style>
</style>
