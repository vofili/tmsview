<template>
  <span class="text-white">{{ notification.message }}.</span>
</template>

<script>
import { mapState } from "vuex"
  export default {
    name: 'notify',
    computed: {
        ...mapState(["notification"])
    }
  }
</script>
