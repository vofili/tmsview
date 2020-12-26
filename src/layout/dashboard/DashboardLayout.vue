<template>
  <div class="wrapper">
    <side-bar>
      <template slot="links">
        <sidebar-link
          to="/dashboard/transactions"
          name="Transactions"
          icon="ti-exchange-vertical"
        />

        <sidebar-link to="/Dashboard" name="Dashboard" icon="ti-panel" />
        
        <sidebar-link
          to="/dashboard/stats"
          name="User Profile"
          icon="ti-user"
        />
        <!-- <sidebar-link
          to="/dashboard/table-list"
          name="Table List"
          icon="ti-view-list-alt"
        />
        <sidebar-link
          to="/dashboard/typography"
          name="Typography"
          icon="ti-text"
        />
        <sidebar-link
          to="/dashboard/icons"
          name="Icons"
          icon="ti-pencil-alt2"
        />
        <sidebar-link to="/dashboard/maps" name="Map" icon="ti-map" />
        <sidebar-link
          to="/dashboard/notifications"
          name="Notifications"
          icon="ti-bell"
        /> -->
      </template>
      <mobile-menu>
        
        <li class="divider"></li>
      </mobile-menu>
    </side-bar>
    <div class="main-panel">
      <top-navbar></top-navbar>

      <dashboard-content @click.native="toggleSidebar"> </dashboard-content>

      <!-- <content-footer></content-footer> -->
    </div>
  </div>
</template>
<style lang="scss">
</style>
<script>
import { mapState } from "vuex"
import TopNavbar from "./TopNavbar.vue";
// import ContentFooter from "./ContentFooter.vue";
import DashboardContent from "./Content.vue";
import MobileMenu from "./MobileMenu";
export default {
  components: {
    TopNavbar,
    // ContentFooter,
    DashboardContent,
    MobileMenu,
  },
  computed: {
    ...mapState(["auth" ])
  },
  methods: {
    toggleSidebar() {
      if (this.$sidebar.showSidebar) {
        this.$sidebar.displaySidebar(false);
      }
    },
  },
  mounted() {
    if (this.auth.user === null) {
      this.$router.push("/login");
    }
  },
};
</script>
<style scoped>
  .wrapper{
    font-size: 12px !important;
  }
</style>
