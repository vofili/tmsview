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

        <h4>Configuration Panel</h4>

        <div class="p-4">
            <div class="row">
                <div class="form-group form-check">
                    <input type="checkbox" v-model="config.disableAll" class="form-check-input" id="exampleCheck1">
                    <label class="form-check-label" for="exampleCheck1">Disable All Terminals</label>
                </div>
            </div>

            <div class="row">
                <div class="form-group form-check">
                    <input type="checkbox" v-model="config.forceConfigAll" class="form-check-input" id="exampleCheck1">
                    <label class="form-check-label" for="exampleCheck1">Force Configure All Terminals</label>
                </div>
            </div>

            <div class="row">
                <div class="form-group form-check">
                    <input type="checkbox" v-model="config.upgradeAll" class="form-check-input" id="exampleCheck1">
                    <label class="form-check-label" for="exampleCheck1">Upgrade All Terminals</label>
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
        contactlessCvmLimit: "",
        contactlessTransLimit: "",
        processorMerchantLocation: "",
        disableAll: false,
        forceConfigAll: false,
        upgradeAll: false
      },
    };
  },
  computed: {
    ...mapState(["auth", "loading", "utils"]),
  },
  methods: {
    ...mapActions(["saveConfig", "setNotification", "setLoading" ]),
    submit() {
      this.saveConfig(this.config)
    },
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
