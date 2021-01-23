<template>
  <card class="card" title="Upload Terminals">
    <div>
      <form @submit.prevent>

        <div class="row">
          
          <div class="col-md-6">
            <label>Select a Merchant</label>
            <multiselect v-model="selectedMerchant" :custom-label="optionLabel" track-by="_id" :options="utils.merchants" :allow-empty="false" placeholder="Select a Merchant" @close="getAgents">
              <template slot="singleLabel" slot-scope="{ option }"> {{ option.merchantName }} </template>
            </multiselect>
          </div>
          <div class="col-md-6">
            <label>Select Agent</label>
            <multiselect v-model="selectedAgent" :custom-label="optionLabel2" track-by="_id" :options="auth.agents" :allow-empty="false" placeholder="Select an Agent" >
              <template slot="singleLabel" slot-scope="{ option }"> {{ option.firstName }} </template>
            </multiselect>
          </div>
        </div>

        <div class="row">          
          <div class="col-md-6">
            <label>Add File</label>
            <div>
                <input type="file" class="form-control" accept=".csv" :file="this.file"
                      @change="fileChange">
            </div>
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
            Upload Terminal
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
      file: "",
      selectedMerchant: "",
      selectedAgent: ""
    };
  },
  computed: {
    ...mapState(["auth", "loading", "utils"]),
  },
  methods: {
    ...mapActions(["uploadTerminal", "getMerchants", "getStates", "getLgas", "getCountries", "getAllMerchantAgents", "setNotification"]),
    submit() {
      const formData = new FormData();
      formData.append('csvFile', this.file);
      if(this.selectedMerchant !== ""){
        formData.append('tmsMerchantId', this.selectedMerchant._id)
      }
      if(this.selectedAgent !== ""){
        formData.append('tmsAgentId', this.selectedAgent._id)
      }
      this.uploadTerminal(formData)
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
    },
    fileChange(e) {
      const file = e.target.files[0];
        this.file = file;
      
    },
  },
  mounted(){
    this.getMerchants();
    this.getCountries();
  }
};
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
