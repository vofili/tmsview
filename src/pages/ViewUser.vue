<template>
  <div>
    <div>
      <button
        class="btn btn-info m-2"
        @click="doDisable"
        v-if="user.disabled === false"
      >
        Disable User
      </button>
      <button
        class="btn btn-info m-2"
        @click="doEnable"
        v-if="user.disabled === true"
      >
        Enable User
      </button>
      <router-link v-if="user.merchantId" class="btn btn-info m-2" :to="`/dashboard/merchant/${user.merchantId}/agents`"> Back to Agents </router-link>
    </div>
    <card class="card" title="Add Merchant's Agent">
      <div>
        <form @submit.prevent>
          <div class="row">
            <div class="col-md-4">
              <fg-input
                type="text"
                label="First Name"
                placeholder="First Name"
                v-model="user.firstName"
              >
              </fg-input>
            </div>
            <div class="col-md-4">
              <fg-input
                type="text"
                label="Last Name"
                placeholder="Last Name"
                v-model="user.lastName"
              >
              </fg-input>
            </div>
            <div class="col-md-4">
              <fg-input
                type="text"
                label="Email"
                placeholder="Email"
                v-model="user.email"
              >
              </fg-input>
            </div>
          </div>

          <div class="row">
            <div class="col-md-4">
              <fg-input
                type="text"
                label="Company Name"
                placeholder="Company Name"
                v-model="user.companyName"
              >
              </fg-input>
            </div>
            <div class="col-md-4">
              <fg-input
                type="text"
                label="User Type"
                placeholder="User Type"
                v-model="user.address"
              >
              </fg-input>
            </div>
            <div class="col-md-4">
              <fg-input
                type="text"
                label="Phone Number"
                placeholder="Phone Number"
                v-model="user.phoneNumber"
              >
              </fg-input>
            </div>
          </div>


          <h4>Change User Password</h4>

          <div class="row">
             <div class="col-md-6">
              <fg-input
                type="password"
                label="New Password"
                placeholder="New Password"
                v-model="password"
              >
              </fg-input>
            </div>
          </div>

          <div class="text-center">
            <p-button type="info" round @click.native.prevent="submit">
              <div
                class="spinner-grow"
                role="status"
                v-if="loading.show === true"
              ></div>
              Change Password
            </p-button>
          </div>
          <div class="clearfix"></div>
        </form>
      </div>
    </card>
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";
import axios from "axios";
export default {
  data() {
    return {
      user: {
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        companyName: "",
        userType: "",
      },
      password: "",
    };
  },
  computed: {
    ...mapState(["auth", "loading", "utils"]),
  },
  methods: {
    ...mapActions([
      "adminChangeUserPassword",
      "setNotification",
      "enableUser",
      "disableUser"
    ]),
    submit() {
      this.$confirm("Change Password?").then(() => {
        this.adminChangeUserPassword({ id: this.$route.params.userId, password: this.password });
      });
    },
    doDisable(){
        this.$confirm("Disable User! Are you sure?").then(() => {
            this.disableUser({ id: this.user._id })
            this.getUser()
      });
    },
    doEnable(){
        this.$confirm("Enable User?").then(() => {
            this.enableUser({ id: this.user._id})
            this.getUser()
      });
    },
    async getUser() {
      try {
        const res = await axios.get(
          `${process.env.VUE_APP_API_URL}/user/${this.$route.params.userId}`
        );
        const { user } = res.data;
        this.user = user;
      } catch (err) {
        const { data } = err.response.data;
        console.log(data);
        if (data) {
          this.setNotification({
            type: "danger",
            message: data.message || "Unable to Fetch User Data",
          });
        }
      }
    },
  },
  async mounted() {
    await this.getUser();
  },
};
</script>
<style>
</style>
