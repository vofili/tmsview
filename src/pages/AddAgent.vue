<template>
  <card class="card" title="Add Merchant's Agent">
    <div>
      <form @submit.prevent>
        <div class="row">
          <div class="col-md-6" v-if="auth.merchant !== null">
            <fg-input type="text"
                        label="Merchant Name"
                      placeholder="Merchant Name"
                      :disabled="true"
                      v-model="auth.merchant.merchantName">
            </fg-input>
          </div>
          <div class="col-md-6" v-if="auth.merchant !== null">

            <fg-input type="text"
                      label="Merchant Company Name"
                      placeholder="Company Name"
                      :disabled="true"
                      v-model="auth.merchant.companyName">
            </fg-input>
          </div>
        </div>

        <div class="row">
          <div class="col-md-4">
            <fg-input type="text"
                      label="First Name"
                      placeholder="First Name"
                      v-model="agent.firstName">
            </fg-input>
          </div>
           <div class="col-md-4">
            <fg-input type="text"
                      label="Last Name"
                      placeholder="Last Name"
                      v-model="agent.lastName">
            </fg-input>
          </div>
          <div class="col-md-4">
            <fg-input type="text"
                      label="Email"
                      placeholder="Email"
                      v-model="agent.email">
            </fg-input>
          </div>
        </div>

        <div class="row">            
          <div class="col-md-4">
            <fg-input type="text"
                      label="Business Name"
                      placeholder="Business Name"
                      v-model="agent.businessName">
            </fg-input>
          </div>
          <div class="col-md-4">
            <fg-input type="text"
                      label="Address"
                      placeholder="Address"
                      v-model="agent.address">
            </fg-input>
          </div>
          <div class="col-md-4">
            <fg-input type="text"
                      label="Phone Number"
                      placeholder="Phone Number"
                      v-model="agent.phoneNumber">
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
            Add Agent
          </p-button>
        </div>
        <div class="clearfix"></div>
      </form>
    </div>
  </card>
</template>
<script>
import { mapState, mapActions } from "vuex"
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
        localGovernment: ""
      }
    };
  },
  computed: {
    ...mapState(["auth", "loading", "utils"]),
  },
  methods: {
    ...mapActions(["getStates", "getLgas", "getCountries", "getMerchant", "createMerchantAgent"]),
    submit() {
        const data = {
            ...this.agent,
            merchantId: this.auth.merchant._id
        }
      this.createMerchantAgent(data)
    },
    fetchLgas() {
      this.agent.lga = "";
      this.getLgas(this.agent.state);
    },
  },
  mounted(){
    this.getCountries();
    this.getMerchant(this.$route.params.merchantId )
  }
};
</script>
<style>
</style>
