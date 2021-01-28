<template>
  <card class="card" title="Add Merchant">
    <div>
      <form @submit.prevent>
        <div class="row">
          <div class="col-md-4">
            <label>Select an Institution</label>
            <multiselect v-model="selectedInstitution" :custom-label="optionLabel" track-by="_id" :options="utils.institutions" :allow-empty="false" placeholder="Select an Institution">
              <template slot="singleLabel" slot-scope="{ option }"> {{ option.institutionName }} </template>
            </multiselect>
          </div>

          <div class="col-md-4">
            <fg-input type="text"
                        label="Merchant Name"
                      placeholder="Merchant Name"
                      v-model="merchant.merchantName">
            </fg-input>
          </div>
          <div class="col-md-4">

            <fg-input type="text"
                      label="Company Name"
                      placeholder="Company Name"
                      v-model="merchant.companyName">
            </fg-input>
          </div>
        </div>

        <div class="row">
          <div class="col-md-4">
            <fg-input type="text"
                      label="Email"
                      placeholder="Email"
                      v-model="merchant.email">
            </fg-input>
          </div>
          <div class="col-md-4">
            <fg-input type="text"
                      label="Address"
                      placeholder="Address"
                      v-model="merchant.address">
            </fg-input>
          </div>
          <div class="col-md-4">
            <fg-input type="text"
                      label="Phone Number"
                      placeholder="Phone Number"
                      v-model="merchant.phoneNumber">
            </fg-input>
          </div>
        </div>


        <div class="row">
           <div class="col-md-4">
              <label>Country</label>
            <select
              class="form-control op-border"
              id="rate-type"
              v-model="merchant.country"
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
              v-model="merchant.state"
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
              v-model="merchant.localGovernment"
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


        <div class="row">
          <div class="col-md-6 p-2">
                <input
                  type="password"
                  class="form-control border"
                  label="Password"
                  placeholder="Password"
                  v-model="merchant.password"
                />
              </div>
              <div class="col-md-6 p-2">
                <input
                  type="password"
                  class="form-control border"
                  label="Password Confirmation"
                  placeholder="Password Confirmation"
                  v-model="merchant.password_confirmation"
                />
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
            Add Merchant
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
      merchant: {
        merchantName: "",
        companyName: "",
        email: "",
        address: "",
        phoneNumber: "",
        country: "",
        state: "",
        localGovernment: ""
      },
      selectedInstitution: ""
    };
  },
  computed: {
    ...mapState(["auth", "loading", "utils"]),
  },
  methods: {
    ...mapActions(["createMerchant", "getStates", "getLgas", "getCountries", "getInstitutions"]),
    submit() {
      if(this.selectedInstitution !== ""){
        this.merchant.institutionId =  this.selectedInstitution._id
      }
      this.createMerchant(this.merchant)
    },
    fetchLgas() {
      this.merchant.lga = "";
      this.getLgas(this.merchant.state);
    },
    optionLabel ({ institutionName, state, country }) {
      return `${institutionName}, ${state}, ${country}`
    },
  },
  mounted(){
    this.getInstitutions();
    this.getCountries();
  }
};
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
