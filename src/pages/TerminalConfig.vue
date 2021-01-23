<template>
  <card class="card" title="Terminal Configurations">
    <div>
      <form @submit.prevent>
        <div class="row">
          <div class="col-md-5">
            <fg-input type="text"
                        label="Tms Base Url"
                      placeholder="Tms Base Url"
                      v-model="config.tmsBaseUrl">
            </fg-input>
          </div>
          <div class="col-md-3">

            <fg-input type="text"
                      label="Nibbs Ip"
                      placeholder="Nibbs Ip"
                      v-model="config.nibbsIp">
            </fg-input>
          </div>
          <div class="col-md-4">
            <fg-input type="text"
                      label="Nibbs Port"
                      placeholder="Nibbs Port"
                      v-model="config.nibbsIp">
            </fg-input>
          </div>
        </div>

        <div class="row">
          <div class="col-md-5">
            <fg-input type="text"
                        label="Nibbs Env"
                      placeholder="Nibbs Env"
                      v-model="config.nibbsEnv">
            </fg-input>
          </div>
          <div class="col-md-3">

            <fg-input type="text"
                      label="Nibbs Key"
                      placeholder="Nibbs Key"
                      v-model="config.nibbsKey">
            </fg-input>
          </div>
          <div class="col-md-4">
            <fg-input type="text"
                      label="POS Data Code"
                      placeholder="POS Data Code"
                      v-model="config.posDataCode">
            </fg-input>
          </div>
        </div>

        <div class="row">
          <div class="col-md-5">
            <fg-input type="number"
                        label="Contactless Cvm Limit"
                      placeholder="Contactless Cvm Limit"
                      v-model="config.contactlessCvmLimit">
            </fg-input>
          </div>
          <div class="col-md-3">

            <fg-input type="text"
                      label="Contactless Trans Limit"
                      placeholder="Contactless Trans Limit"
                      v-model="config.contactlessTransLimit">
            </fg-input>
          </div>
          <div class="col-md-4">
            <fg-input type="text"
                      label="POS Data Code"
                      placeholder="POS Data Code"
                      v-model="config.posDataCode">
            </fg-input>
          </div>
        </div>

        <div class="text-center">
          <!-- <p-button type="info" round
                    @click.native.prevent="submit">
            <div
                  class="spinner-grow"
                  role="status"
                  v-if="loading.show === true"
                ></div> Save Configuration
          </p-button> -->
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
      config: {
      },
    };
  },
  computed: {
    ...mapState(["auth", "loading", "utils"]),
  },
  methods: {
    ...mapActions(["createTerminal", "getMerchants", "getStates", "getLgas", "getCountries", "getAllMerchantAgents"]),
    submit() {
      this.saveConfig(this.config)
    },
    // optionLabel ({ merchantName, state, country }) {
    //   return `${merchantName}, ${state}, ${country}`
    // }, 
    // optionLabel2 ({ firstName, lastName, agentId }) {
    //   return `${firstName}, ${lastName}, ${agentId}`
    // }, 
    // fetchLgas() {
    //   this.config.lga = "";
    //   this.getLgas(this.config.state);
    // }
  },
  mounted(){
  }
};
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
