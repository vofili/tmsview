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
                      v-model="config.nibbsPort">
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

            <fg-input type="number"
                      label="Contactless Trans Limit"
                      placeholder="Contactless Trans Limit"
                      v-model="config.contactlessTransLimit">
            </fg-input>
          </div>

          <div class="col-md-3">

            <fg-input type="text"
                      label="Processor Merchant Location"
                      placeholder="Processor Merchant Location"
                      v-model="config.processorMerchantLocation">
            </fg-input>
          </div>
        </div>

         <div class="row">
          <div class="col-md-4">
            <fg-input type="number"
                        label="Curerncy Code"
                      placeholder="Currency Code"
                      v-model="config.currencyCode">
            </fg-input>
          </div>
          <div class="col-md-4">

            <fg-input type="number"
                      label="Country Code"
                      placeholder="Country Code"
                      v-model="config.countryCode">
            </fg-input>
          </div>
          <div class="col-md-4">
              <fg-input
                type="text"
                label="Terminal Capability"
                placeholder="Terminal Capability"
                v-model="config.terminalCapability"
              >
              </fg-input>
            </div>
        </div>

        <div class="row">
          <div class="col-12">
            <h4>Routes</h4>
            <div class="row">
              <div class="col-12">
                <!-- <div class="border routes-input p-2" ref="editable" contenteditable @input="changeRoute"> {{ config.routes }} </div> -->
                <textarea class="form-chontrol border" id="" cols="50" rows="10" v-model="config.routes"></textarea>
              </div>
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
                ></div> Save Configuration
          </p-button>
        </div>

        <div class="row">
          <div class="col-md-6">
            <h4>Configuration Panel</h4>

            <div class="p-4">
                <div class="row">
                    <div class="form-group form-check">
                        <input type="checkbox" v-model="config.disableAll" class="form-check-input">
                        <label class="form-check-label" for="exampleCheck1">Disable All Terminals</label>
                    </div>
                </div>

                <div class="row">
                    <div class="form-group form-check">
                        <input type="checkbox" v-model="config.forceConfigAll" class="form-check-input">
                        <label class="form-check-label" for="exampleCheck1">Force Configure All Terminals</label>
                    </div>
                </div>

                <div class="row">
                    <div class="form-group form-check">
                        <input type="checkbox" v-model="config.upgradeAll" class="form-check-input">
                        <label class="form-check-label" for="exampleCheck1">Upgrade All Terminals</label>
                    </div>
                </div>

                <div class="row">
                    <div class="form-group form-check">
                        <input type="checkbox" v-model="config.allNibbsRoute" class="form-check-input">
                        <label class="form-check-label" for="exampleCheck1">Route All to Nibbs</label>
                    </div>
                </div>
            </div>
          </div>
          
        </div>

        <div class="text-center">
          <p-button type="info" round
                    @click.native.prevent="saveConfig2">
            <div
                  class="spinner-grow"
                  role="status"
                  v-if="loading.show === true"
                ></div> Save Config Panel
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
import axios from "axios"
export default {
  components: {
    Multiselect
  },
  data() {
    return {
      config: {
        tmsBaseUrl: "",
        nibbsIp: "",
        nibbsPort: "",
        nibbsEnv: "",
        nibbsKey: "",
        posDataCode: "",
        terminalCapability: "",
        contactlessCvmLimit: "",
        contactlessTransLimit: "",
        processorMerchantLocation: "",
        countryCode: "", 
        currencyCode: "",
        disableAll: false,
        forceConfigAll: false,
        upgradeAll: false,
        allNibbsRoute: false,
        routes: []
      },
    };
  },
  computed: {
    ...mapState(["auth", "loading", "utils"]),
  },
  methods: {
    ...mapActions(["saveConfig", "setNotification", "setLoading" ]),
    submit() {
      // console.log(this.config.routes)
      this.saveConfig({
        tmsBaseUrl: this.config.tmsBaseUrl,
        nibbsIp: this.config.nibbsIp,
        nibbsPort: this.config.nibbsPort,
        nibbsEnv: this.config.nibbsEnv,
        nibbsKey: this.config.nibbsKey,
        posDataCode: this.config.posDataCode,
        terminalCapability: this.config.terminalCapability,
        contactlessCvmLimit: this.config.contactlessCvmLimit,
        contactlessTransLimit: this.config.contactlessTransLimit,
        processorMerchantLocation: this.config.processorMerchantLocation,
        countryCode: this.config.countryCode , 
        currencyCode: this.config.currencyCode,
        routes: this.config.routes
      })
    },
    saveConfig2(){
      this.saveConfig({
        disableAll: this.config.disableAll,
        forceConfigAll: this.config.forceConfigAll,
        upgradeAll: this.config.upgradeAll,
        allNibbsRoute: this.config.allNibbsRoute,
      })
    },
    changeRoute(){
      const routes = this.$refs.editable.innerText
      this.config.routes = routes
    }
  },
  async mounted(){
     try {
      this.setLoading(true)
      const res = await axios.get( `${process.env.VUE_APP_API_URL}/terminal/configuration/get`);
      const {config } = res.data;
      this.config = config
    } catch (err) {
      console.log(err);
      const { message } = err.response.data
      this.setNotification( { type: "danger", message })
    }
    this.setLoading(false);
  }
};
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style scoped>
  .routes-input{
    height: 200px;
    overflow-x: scroll;
  }
</style>
