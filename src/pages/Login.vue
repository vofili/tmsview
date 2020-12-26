<template>
  <div class="d-flex justify-content-center align-items-center">
    <div class="row">
      <div class="col-md-6 d-flex justify-content-center align-items-center">
        <div class="container">
          <div class="d-none d-md-block d-lg-block d-xl-block">           
            <img :src="image" alt="Image" class="mt-5 img-fluid" />
          </div>
          <h4 class="text-center">TERMINAL MANAGEMENT SYSTEM</h4>
        </div>
      </div>
      <div class="col-md-6 d-flex justify-content-center align-items-center">
        <card class="card mt-5 border w-75" title="Login">
          <form @submit.prevent>
            <div class="row">
              <div class="col-md-12 p-2">
                <input
                  type="email"
                  class="form-control border"
                  label="Username"
                  placeholder="Email"
                  v-model="user.email"
                />
              </div>

              <div class="col-md-12 p-2">
                <input
                  type="password"
                  class="form-control border"
                  label="Password"
                  placeholder="Password"
                  v-model="user.password"
                />
              </div>
            </div>

            <div class="text-center">
              <p-button type="info" round @click.native.prevent="loginUser">
                Login
              </p-button>
            </div>
            <div class="clearfix"></div>
          </form>
        </card>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      user: {
        email: "",
        passsword: "",
      },
      image: require("@/assets/img/dummy-image.png"),
    };
  },
  computed: {
    ...mapState(["auth"]),
  },
  methods: {
    ...mapActions(["login"]),
    loginUser() {
      this.login(this.user);
    },
  },
  mounted() {
    if (this.auth.user !== null) {
      this.$router.push("/dashboard/transactions");
    }
  },
};
</script>
<style>
</style>
