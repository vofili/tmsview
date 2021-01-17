<template>
  <div>
    <div class="col-12">
      <button class="btn btn-info mr-2" @click="doDisable" v-if="terminal.disabled === false">Disable Terminal</button>
      <button class="btn btn-info m-2" @click="doEnable" v-if="terminal.disabled === true">Enable Terminal</button>
        <button class="btn btn-info m-2" @click="doDelete">Delete Terminal</button>
    </div>
    <card class="card" :title="`Terminal ${terminal.terminalId}`">
      <div>
        <form @submit.prevent>
          <div class="row">
            <div class="col-md-4">
              <fg-input
                type="text"
                label="Terminal Id"
                :disabled="true"
                placeholder="Terminal Id"
                v-model="terminal.terminalId"
              >
              </fg-input>
            </div>
            <div class="col-md-4">
              <fg-input
                type="text"
                label="Merchant Name"
                placeholder="AgentId"
                :disabled="true"
                v-model="terminal.agentId"
              >
              </fg-input>
            </div>
            <div class="col-md-4">
              <fg-input
                type="text"
                label="Agent Name"
                :disabled="true"
                placeholder="Agent Name"
                v-model="terminal.agentName"
              >
              </fg-input>
            </div>
          </div>

          <div class="row">
            <div class="col-md-8">
              <fg-input
                type="text"
                label="Merchant Name"
                :disabled="true"
                placeholder="Merchant Name"
                v-model="terminal.tmsMerchantName"
              >
              </fg-input>
            </div>
            <div class="col-md-4">
              <fg-input
                type="text"
                label="Merchant Id"
                placeholder="Merchant Id"
                :disabled="true"
                v-model="terminal.merchantId"
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
                v-model="terminal.country"
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
                v-model="terminal.state"
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
                v-model="terminal.localGovernment"
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
              Update Terminal
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
      terminal: {
        terminalId: "",
        merchantId: "",
        agentId: "",
        agentName: "",
        appVersion: "",
        currentVersion: "",
        country: "",
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
      "updateTerminal",
      "getStates",
      "getLgas",
      "getCountries",
      "setLoading",
      "disableTerminal",
      "enableTerminal",
      "deleteTerminal"
    ]),
    submit() {
        this.$confirm("Edit Teriminal Details?").then(() => {
            this.updateTerminal(this.terminal);
      });
    },
    fetchLgas() {
      this.terminal.lga = "";
      this.getLgas(this.terminal.state);
    },
    doDisable(){
        this.$confirm("Disable Terminal! Are you sure?").then(() => {
            this.disableTerminal({ id: this.terminal._id })
            this.getTerminal()
      });
    },
    doEnable(){
        this.$confirm("Enable Terminal?").then(() => {
            this.enableTerminal({ id: this.terminal._id })
            this.getTerminal()
      });
    },
    doDelete(){
        this.$confirm("Delete Terminal?").then(() => {
            this.deleteTerminal({ id: this.terminal._id })
            this.getTerminal()
      });
    },
    async getTerminal(){
         this.setLoading(true);
        const res = await axios.get(
        `${process.env.VUE_APP_API_URL}/terminal/${this.$route.params.terminalId}`
        );
        const { terminal } = res.data;
        this.terminal = terminal;
        this.getLgas(this.terminal.state);
        this.setLoading(false);
    }
  },
  async mounted() {
    this.getCountries();
    this.getStates();
    await this.getTerminal()
  },
};
</script>
<style>
</style>
