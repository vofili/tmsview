<template>
  <card class="card" title="Add terminal">
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

        <div class="row">
          
          <div class="col-md-6">
            <label>Merchant Name</label>
            <multiselect v-model="selectedMerchant" :custom-label="optionLabel" track-by="_id" :options="utils.merchants" :allow-empty="false" placeholder="Select a Merchant" @close="getAgents">
              <template slot="singleLabel" slot-scope="{ option }"> {{ option.merchantName }} </template>
            </multiselect>
          </div>

          <div class="col-md-6">
            <label>Agent Name</label>
            <multiselect v-model="selectedAgent" :custom-label="optionLabel2" track-by="_id" :options="auth.agents" :allow-empty="false" placeholder="Select an Agent" >
              <template slot="singleLabel" slot-scope="{ option }"> {{ option.firstName }} </template>
            </multiselect>
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
              <option v-for="(ct, index) in utils.countries" :key="index" :value="ct.code">
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
            <span v-if="utils.lgaLoading">
              Fetching Lga's
            </span>
          </div>
        </div>
        
        <div class="text-center">
          <p-button type="info" round
                    @click.native.prevent="submit">
            <div
                  class="spinner-grow"
                  role="status"
                  v-if="loading.show === true"
                ></div>
            Add Terminal
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
      this.createTerminal(this.terminal)
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
