<template>
  <div id="userMenu">
    <div v-if="!auth">
      <a-button type="primary" size="large" icon="github" :href="$config.githubAuthAddr">
        Connect
      </a-button>
    </div>
    <div v-else>

      <a-dropdown :trigger="['click']">
        <a id="userMenuHeader">
          <a-avatar :src="this.auth.user.avatar_url" :size="64" />
          <a-icon type="github" /> {{this.auth.user.login}} <a-icon type="down" />
        </a>
        <a-menu slot="overlay">
          <a-menu-item key="0">
            <NuxtLink to="/pages/collections"><a-icon type="unordered-list" /> My collections</NuxtLink>
          </a-menu-item>
          <a-menu-divider />
          <a-menu-item key="3" @click="this.logout">
            <a-icon type="logout" /> Logout
          </a-menu-item>
        </a-menu>
      </a-dropdown>
    </div>
  </div>
</template>

<script>
    export default {
        data() {
            return {
                auth: null,
            };
        },

        beforeMount() {
            this.auth = this.$store.state.auth
        },

        methods: {
            logout() {
                this.$store.commit('setAuth', null)
                this.auth = null
            },
        },
    }
</script>

<style>
  #userMenu {
    float: right;
  }

  #userMenuHeader {
    color: #ececec;
    font-size: 22px;
  }

</style>
