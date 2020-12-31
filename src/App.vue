<template>
  <div :class="{'nav-open': $sidebar.showSidebar}">
    <notifications></notifications>
    <router-view></router-view>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex"
import Notify from "./pages/Notifications/Notify"
import jwt from "jsonwebtoken";
import setAuthToken from "./utils/setAuthToken";
export default {
   created() {
    if (localStorage.jwtToken) {
      const token = localStorage.jwtToken

      //decode the jwt token
      const user = jwt.decode(token, process.env.VUE_APP_JWT_KEY);

      const currentTime = Date.now() / 1000;
      if (user.exp < currentTime) {
        localStorage.removeItem("jwtToken");
      } else {
        //set axios header
        setAuthToken(token);
        this.setUser(user);
      }
    }
  },
  computed: {
    ...mapState(["auth", "notification"]),
    watchNotification() {
      return this.notification.show;
    },
  },
  watch: {
    watchNotification(newVal, oldVal) {
      if (oldVal === false && newVal === true) this.notifyVue();
    },
  },
  methods: {
    ...mapMutations(["setUser"]),
    notifyVue() {
      this.$notify({
        component: Notify,
        icon: "ti-bell",
        horizontalAlign: 'center',
        verticalAlign: 'top',
        type: this.notification.type
      });
    }
  }
};
</script>

<style lang="scss">
.vue-notifyjs.notifications {
  .alert {
    z-index: 10000;
  }
  .list-move {
    transition: transform 0.3s, opacity 0.4s;
  }
  .list-item {
    display: inline-block;
    margin-right: 10px;
  }
  .list-enter-active {
    transition: transform 0.2s ease-in, opacity 0.4s ease-in;
  }
  .list-leave-active {
    transition: transform 1s ease-out, opacity 0.4s ease-out;
  }

  .list-enter {
    opacity: 0;
    transform: scale(1.1);
  }
  .list-leave-to {
    opacity: 0;
    transform: scale(1.2, 0.7);
  }
}
</style>
