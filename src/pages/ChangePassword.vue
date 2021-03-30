<template>
  <div>
    <card class="card" title="Change Password">
      <div>
        <form @submit.prevent>
          <h4>Change Your Password</h4>

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

            <div class="col-md-6">
              <fg-input
                type="password"
                label="New Password Confirmation"
                placeholder="New Password Confirmation"
                v-model="password_confirmation"
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
export default {
  data() {
    return {
      password: "",
      password_confirmation: ""
    };
  },
  computed: {
    ...mapState(["auth", "loading"]),
  },
  methods: {
    ...mapActions([
      "changePassword"
    ]),
    submit() {
      this.$confirm("Change Password?").then(() => {
        this.changePassword({ 
            password: this.password, 
            password_confirmation: this.password_confirmation 
        });
      });
    },
  },
};
</script>
<style>
</style>
