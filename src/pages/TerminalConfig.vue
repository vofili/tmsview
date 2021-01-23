<template>
  <card class="card" title="Terminal Configurations">
    <div>
      <form @submit.prevent>
        <div class="row">
          <div class="col-md-5">
            <fg-input type="text"
                        label="Terminal Id"
                      placeholder="Terminal Id"
                      v-model="terminal.terminalId">
            </fg-input>
          </div>
          <div class="col-md-3">

            <fg-input type="text"
                      label="Serial Number"
                      placeholder="Serial No"
                      v-model="terminal.serialNo">
            </fg-input>
          </div>
          <div class="col-md-4">
            <fg-input type="text"
                      label="merchant Id"
                      placeholder="Merchant Id"
                      v-model="terminal.merchantId">
            </fg-input>
          </div>
        </div>

        <div class="text-center">
          <p-button type="info" round
                    @click.native.prevent="submit">
            <div
                  class="spinner-grow"
                  role="status"
                  v-if="loading.show === true"
                ></div> Save Configuration
          </p-button>
        </div>
        <div class="clearfix"></div>
      </form>
    </div>
  </card>
</template>
<script>
import { mapState, mapActions } from "vuex"
import Multiselect from 'vue-multiselect'
export default {
  components: {
    Multiselect
  },
  data() {
    return {
      terminal: {
          terminalId: "",
          serialNo: "",
          merchantId: "",
          agentId: "",
          country: "",
          state: "",
          localGovernment: ""
      },
      selectedMerchant: "",
      selectedAgent: ""
    };
  },
  computed: {
    ...mapState(["auth", "loading", "utils"]),
  },
  methods: {
    ...mapActions(["createTerminal", "getMerchants", "getStates", "getLgas", "getCountries", "getAllMerchantAgents"]),
    submit() {
      if(this.selectedMerchant !== ""){
        this.terminal.tmsMerchantId = this.selectedMerchant._id
      }
      if(this.selectedAgent !== ""){
        this.terminal.tmsAgentId = this.selectedAgent._id
      }
      this.saveConfig(this.terminal)
    },
    optionLabel ({ merchantName, state, country }) {
      return `${merchantName}, ${state}, ${country}`
    }, 
    optionLabel2 ({ firstName, lastName, agentId }) {
      return `${firstName}, ${lastName}, ${agentId}`
    }, 
    fetchLgas() {
      this.terminal.lga = "";
      this.getLgas(this.terminal.state);
    },
    getAgents(){
      // console.log(this.selectedMerchant)
      this.getAllMerchantAgents({ merchantId: this.selectedMerchant._id})
    }
  },
  mounted(){
    this.getMerchants();
    this.getCountries();
  }
};
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
