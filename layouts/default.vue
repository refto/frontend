<template>
  <div>
    <nuxt/>
  </div>
</template>


<script>
    export default {
        data() {
            return {
                requestErrors: null,
            };
        },

        created() {
            this.unsubscribe = this.$store.subscribe((mutation, state) => {
                if (mutation.type === 'setRequestError') {
                    let err = state.requestError
                    if (!err.response) {
                        this.$notification.error({
                            message: 'Whoops',
                            description: "Unable to connect to API server. Either you have problems with network connection or API server is down.",
                            duration: null
                        });
                    } else {
                        const code = err.response.status
                        let resp = err.response.data
                        if (resp.error) { resp = resp.error }
                        if (resp === "") { resp = "Something went wrong :(" }
                        let dur = 5
                        if (code >= 500) {
                            dur = 0
                        }
                        let message = err.response.statusText
                        if (!message) {
                            message = code + " happens"
                        }
                        this.$notification.error({
                            message: message,
                            description: resp,
                            duration: dur
                        });
                        console.error(err)
                    }
                }
            });
        },
        beforeDestroy() {
            this.unsubscribe();
        },


    }
</script>
