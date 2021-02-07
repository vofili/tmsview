<template>
  <div class="wrapper">
    <side-bar>
      <template slot="links">
        <sidebar-link
          to="/dashboard/transactions"
          name="Transactions"
          icon="ti-exchange-vertical"
        />
<!-- 
        <sidebar-link to="/Dashboard" name="Dashboard" icon="ti-panel" /> -->
        
        <sidebar-link
          to="/dashboard/institutions"
          name="Institutions"
          icon="ti-crown"
          v-if="auth.user.userType === 'super-admin'"
        />

        <!-- <sidebar-link
          to="/dashboard/create-merchant"
          name="Create Merchant"
          icon="ti-medall"
          v-if="auth.user.userType === 'super-admin'"
        /> -->

        <sidebar-link
          to="/dashboard/merchants"
          name="Merchants"
          icon="ti-layout"
          v-if="auth.user.userType === 'super-admin'"
        />
        
        <!-- <sidebar-link
          to="/dashboard/add-terminal"
          name="Add Terminal"
          icon="ti-control-stop"
          v-if="auth.user.userType === 'super-admin'"
        /> -->

        <sidebar-link
          to="/dashboard/terminals"
          name="Terminals"
          icon="ti-desktop"
          v-if="auth.user.userType === 'super-admin'"
        />

        <sidebar-link
          to="/dashboard/wallet-reports"
          name="Wallet Reports"
          icon="ti-wallet"
        />

        <sidebar-link
          to="/dashboard/create-user"
          name="Create User"
          icon="ti-plus"
          v-if="auth.user.userType === 'super-admin'"
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
        
        <sidebar-link to="/dashboard/maps" name="Map" icon="ti-map" />
        <sidebar-link
          to="/dashboard/notifications"
          name="Notifications"
          icon="ti-bell"
        /> -->
        <!-- <sidebar-link
          to="/dashboard/notifications"
          name="Notifications"
          icon="ti-bell"
        /> -->
        <!-- <sidebar-link
          to="/dashboard/icons"
          name="Icons"
          icon="ti-pencil-alt2"
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
