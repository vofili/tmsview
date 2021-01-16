<template>
  <div>
    <div>
      <button
        class="btn btn-info m-2"
        @click="doDisable"
        v-if="agent.disabled === false"
      >
        Disable Agent
      </button>
      <button
        class="btn btn-info m-2"
        @click="doEnable"
        v-if="agent.disabled === true"
      >
        Enable Agent
      </button>
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
                v-model="agent.firstName"
              >
              </fg-input>
            </div>
            <div class="col-md-4">
              <fg-input
                type="text"
                label="Last Name"
                placeholder="Last Name"
                v-model="agent.lastName"
              >
              </fg-input>
            </div>
            <div class="col-md-4">
              <fg-input
                type="text"
                label="Email"
                placeholder="Email"
                v-model="agent.email"
              >
              </fg-input>
            </div>
          </div>

          <div class="row">
            <div class="col-md-4">
              <fg-input
                type="text"
                label="Business Name"
                placeholder="Business Name"
                v-model="agent.businessName"
              >
              </fg-input>
            </div>
            <div class="col-md-4">
              <fg-input
                type="text"
                label="Address"
                placeholder="Address"
                v-model="agent.address"
              >
              </fg-input>
            </div>
            <div class="col-md-4">
              <fg-input
                type="text"
                label="Phone Number"
                placeholder="Phone Number"
                v-model="agent.phoneNumber"
              >
              </fg-input>
            </div>
          </div>

          <div class="row">
            <div class="col-md-4">
              <label>Country</label>
              <select
                class="form-control op-border"
                id="rate-type"
                v-model="agent.country"
                required
                @change="getStates()"
              >
                <option value="">country</option>
                <option
                  v-for="(ct, index) in utils.countries"
                  :key="index"
                  :value="ct.code"
                >
                  {{ ct.name }}
                </option>
              </select>
            </div>

            <div class="col-md-4">
              <label>State</label>
              <select
                class="form-control op-border"
                id="rate-type"
                v-model="agent.state"
                required
                @change="fetchLgas()"
              >
                <option value="">State</option>
                <option v-for="st in utils.allStates" :key="st" :value="st">
                  {{ st }}
                </option>
              </select>
            </div>

            <div class="col-md-4">
              <label>Local Government</label>
              <select
                class="form-control op-border"
                id="rate-type"
                v-model="agent.localGovernment"
                required
              >
                <option value="">Select Local Government</option>
                <option v-for="lg in utils.lgas" :key="lg.id" :value="lg.name">
                  {{ lg.name }}
                </option>
              </select>
              <span v-if="utils.lgaLoading"> Fetching Lga's </span>
            </div>
          </div>

          <div class="text-center">
            <p-button type="info" round @click.native.prevent="submit">
              <div
                class="spinner-grow"
                role="status"
                v-if="loading.show === true"
              ></div>
              Update Agent
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
      agent: {
        businessName: "",
        email: "",
        address: "",
        phoneNumber: "",
        country: "",
        lastName: "",
        firstName: "",
        state: "",
        localGovernment: "",
      },
    };
  },
  computed: {
    ...mapState(["auth", "loading", "utils"]),
  },
  methods: {
    ...mapActions([
      "getStates",
      "getLgas",
      "getCountries",
      "getMerchant",
      "updateAgent",
      "setNotification",
      "enableAgent",
      "disableAgent"
    ]),
    submit() {
      this.$confirm("Update Agent?").then(() => {
        this.updateAgent(this.agent);
      });
    },
    fetchLgas() {
      this.agent.lga = "";
      this.getLgas(this.agent.state);
    },
    doDisable(){
        this.$confirm("Disable Agent! Are you sure?").then(() => {
            this.disableAgent({ id: this.agent._id })
            this.getAgent()
      });
    },
    doEnable(){
        this.$confirm("Enable Agent?").then(() => {
            this.enableAgent({ id: this.agent._id})
            this.getAgent()
      });
    },
    async getAgent() {
      try {
        const res = await axios.get(
          `${process.env.VUE_APP_API_URL}/agent/${this.$route.params.agentId}`
        );
        const { agent } = res.data;
        this.agent = agent;
      } catch (err) {
        const { data } = err.response.data;
        console.log(data);
        if (data) {
          this.setNotification({
            type: "danger",
            message: data.message || "Unable to Fetch Agent Data",
          });
        }
      }
    },
  },
  async mounted() {
    this.getCountries();
    this.getStates();
    // this.$route.params.agentId
    await this.getAgent();
    this.getLgas(this.agent.state);
  },
};
</script>
<style>
</style>
