<template>
  <card class="card" title="Add Institution">
    <div>
      <form @submit.prevent>
        <div class="row">
          <div class="col-md-5">
            <fg-input type="text"
                        label="Institution Name"
                      placeholder="Institution Name"
                      v-model="institution.institutionName">
            </fg-input>
          </div>
          <div class="col-md-3">

            <fg-input type="text"
                      label="Company Name"
                      placeholder="Company Name"
                      v-model="institution.companyName">
            </fg-input>
          </div>
          <div class="col-md-4">
            <fg-input type="text"
                      label="Reg Number"
                      placeholder="Reg Number"
                      v-model="institution.regNumber">
            </fg-input>
          </div>
        </div>

        <div class="row">
            <div class="col-md-6">
            <fg-input type="text"
                      label="Email"
                      placeholder="Email"
                      v-model="institution.email">
            </fg-input>
          </div>
          <div class="col-md-6">
            <fg-input type="text"
                      label="Address"
                      placeholder="Address"
                      v-model="institution.address">
            </fg-input>
          </div>
        </div>

        <div class="row">
          <div class="col-md-12">
            <fg-input type="text"
                      label="Phone Number"
                      placeholder="Phone Number"
                      v-model="institution.phoneNumber">
            </fg-input>
          </div>
        </div>

        <div class="row">
           <div class="col-md-4">
              <label>Country</label>
            <select
              class="form-control op-border"
              id="rate-type"
              v-model="institution.country"
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
              v-model="institution.state"
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
              v-model="institution.localGovernment"
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
                  class="spinner-grow"npm
                  role="status"
                  v-if="loading.show === true"
                ></div>
            Add Institution
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
      institution: {
        institutionName: "",
        regNumber: "",
        companyName: "",
        email: "",
        address: "",
        phoneNumber: "",
        country: "",
        state: "",
        localGovernment: ""
      }
    };
  },
  computed: {
    ...mapState(["auth", "loading", "utils"]),
  },
  methods: {
    ...mapActions(["createInstitution", "getStates", "getLgas", "getCountries"]),
    submit() {
      this.createInstitution(this.institution)
    },
    fetchLgas() {
      this.institution.lga = "";
      this.getLgas(this.institution.state);
    },
  },
  mounted(){
    this.getCountries();
  }
};
</script>
<style>
</style>
