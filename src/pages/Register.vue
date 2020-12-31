<template>
  <div class="d-flex justify-content-center align-items-center">
    <div class="row w-50">
        <card class="card mt-5 border" title="Create User">
          <form >
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

              <div class="col-md-6 p-2">
                <input
                  type="password"
                  class="form-control border"
                  label="Password"
                  placeholder="Password"
                  v-model="user.password"
                />
              </div>
              <div class="col-md-6 p-2">
                <input
                  type="password"
                  class="form-control border"
                  label="Password Confirmation"
                  placeholder="Password Confirmation"
                  v-model="user.password_confirmation"
                />
              </div>
              <div class="col-md-6">
                <input
                  type="text"
                  class="form-control border"
                  label="First Name"
                  placeholder="First Name"
                  v-model="user.firstName"
                />
              </div>
              <div class="col-md-6">
                <input
                  type="text"
                  class="form-control border"
                  label="Last Name"
                  placeholder="Last Name"
                  v-model="user.lastName"
                />
              </div>
              <div class="col-md-6">
                <input
                  type="text"
                  class="form-control border"
                  label="Merchant Id"
                  placeholder="Merchant Id"
                  v-model="user.merchantId"
                />
              </div>
              <div class="col-md-6">
                <input
                  type="text"
                  class="form-control border"
                  label="Phone"
                  placeholder="Phone Number"
                  v-model="user.phoneNumber"
                />
              </div>
              <div class="col-md-6">
                <input
                  type="text"
                  class="form-control border"
                  label="Merchant Id"
                  placeholder="Merchant Id"
                  v-model="user.merchantId"
                />
              </div>
              <div class="col-md-6">
                    <select class="form-control" v-model="user.userType" >
                    <option value="">Select a User Type</option>
                    <option value="user">User</option>
                    <option value="admin"> Admin</option>
                    <option value="super-admin">Super Admin</option>
                </select>
              </div>
              <div class="col-md-6">
                <label></label>
                <textarea rows="5" class="form-control border-input"
                            placeholder="Wallet Ids Separated by commas"
                            v-model="terminals">
                </textarea>
              </div>
            </div>

            <div class="text-center mt-4">
              <p-button type="info" @click.native.prevent="submit">
                <div
                  class="spinner-grow"
                  role="status"
                  v-if="loading.show === true"
                ></div>
                Create User
              </p-button>
            </div>
            <div class="clearfix"></div>
          </form>
        </card>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      user: {
        firstName: "",
        lastName: "",
        merchantId: "",
        email: "",
        password: "",
        userType: "",
        phoneNumber: "",
        password_confirmation: "",
        merchantId: ""
      },
      terminals: "",
    };
  },
  computed: {
    ...mapState(["auth", "loading"]),
  },
  methods: {
    ...mapActions(["createUser"]),
    submit() {
        const terminals = this.terminals.split(',');
        const user = { ...this.user, terminals }
        
        this.createUser(user);
    },
  },
  mounted() {
    // if (this.auth.user !== null) {
    //   this.$router.push("/dashboard/transactions");
    // }
  },
};
</script>
<style>
</style>
