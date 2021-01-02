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
            <multiselect v-model="selectedMerchant" :custom-label="optionLabel" track-by="_id" :options="utils.merchants" :allow-empty="false" placeholder="Select a Merchant">
              <template slot="singleLabel" slot-scope="{ option }"> {{ option.merchantName }} </template>
            </multiselect>
          </div>
          <div class="col-md-6">
            <fg-input type="text"
                      label="Agent Location"
                      placeholder="Agent Location"
                      v-model="terminal.agentLocation">
            </fg-input>
          </div>
        </div>

        <!-- <div class="row">
          <div class="col-md-4">
            <fg-input type="text"
                      label="City"
                      placeholder="City"
                      v-model="terminal.city">
            </fg-input>
          </div>
          <div class="col-md-4">
            <fg-input type="text"
                      label="Country"
                      placeholder="Country"
                      v-model="terminal.country">
            </fg-input>
          </div>
          <div class="col-md-4">
            <fg-input type="number"
                      label="Postal Code"
                      placeholder="ZIP Code"
                      v-model="terminal.postalCode">
            </fg-input>
          </div>
        </div>

        <div class="row">
          <div class="col-md-12">
            <div class="form-group">
              <label>About Me</label>
              <textarea rows="5" class="form-control border-input"
                        placeholder="Here can be your description"
                        v-model="terminal.aboutMe">

              </textarea>
            </div>
          </div>
        </div> -->
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
          agentLocation: ""
      },
      selectedMerchant: "",
    };
  },
  computed: {
    ...mapState(["auth", "loading", "utils"]),
  },
  methods: {
    ...mapActions(["createTerminal", "getMerchants"]),
    submit() {
      if(this.selectedMerchant !== ""){
        this.terminal.agentId = this.selectedMerchant._id
      }
      this.createTerminal(this.terminal)
    },
    optionLabel ({ merchantName, state, country }) {
      return `${merchantName}, ${state}, ${country}`
    }
  },
  mounted(){
    this.getMerchants()
  }
};
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
