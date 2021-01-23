<template>
  <div>
    <div class="col-12">
      <button class="btn btn-info m-2" @click="doDisable" v-if="institution.disabled === false">Disable Institution</button>
      <button class="btn btn-info m-2" @click="doEnable" v-if="institution.disabled === true">Enable Institution</button>
       <router-link class="btn btn-info m-2" :to="`/dashboard/institutions`"> Back to Institutions </router-link>
    </div>
    <card class="card" title="Merchant">
      <div>
        <form @submit.prevent>
          <div class="row">
            <div class="col-md-5">
              <fg-input
                type="text"
                label="Merchant Name"
                placeholder="Merchant Name"
                v-model="institution.institutionName"
              >
              </fg-input>
            </div>
            <div class="col-md-3">
              <fg-input
                type="text"
                label="Company Name"
                placeholder="Company Name"
                v-model="institution.companyName"
              >
              </fg-input>
            </div>
            <div class="col-md-4">
              <fg-input
                type="text"
                label="Reg Number"
                placeholder="Reg Number"
                v-model="institution.regNumber"
              >
              </fg-input>
            </div>
          </div>

          <div class="row">
              <div class="col-md-4">
              <fg-input
                type="text"
                label="Email"
                placeholder="Email"
                v-model="institution.email"
              >
              </fg-input>
            </div>
            <div class="col-md-4">
              <fg-input
                type="text"
                label="Address"
                placeholder="Address"
                v-model="institution.address"
              >
              </fg-input>
            </div>
            <div class="col-md-4">
              <fg-input
                type="text"
                label="Wallet Id"
                placeholder="WalletId"
                :disabled="true"
                v-model="institution.walletId"
              >
              </fg-input>
            </div>
          </div>

          <div class="row">
            <div class="col-md-12">
              <fg-input
                type="text"
                label="Phone Number"
                placeholder="Phone Number"
                v-model="institution.phoneNumber"
              >
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
                <option
                  v-for="(ct, index) in utils.countries"
                  :key="index"
                  :value="ct.code"
                >
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
              <span v-if="utils.lgaLoading"> Fetching Lga's </span>
            </div>
          </div>

          <div class="text-center">
            <p-button type="info" round @click.native.prevent="submit">
              <div
                class="spinner-grow"
                role="status"
                v-if="loading.show === true"
              ></div>
              Update Institution
            </p-button>
          </div>
          <div class="clearfix"></div>
        </form>
      </div>
    </card>
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";
import axios from "axios";
export default {
  data() {
    return {
      institution: {
        institutionName: "",
        reqNumber: "",
        companyName: "",
        email: "",
        address: "",
        phoneNumber: "",
        country: "",
        state: "",
        localGovernment: "",
      },
    };
  },
  computed: {
    ...mapState(["auth", "loading", "utils"]),
  },
  methods: {
    ...mapActions([
      "editInstitution",
      "getStates",
      "getLgas",
      "getCountries",
      "setLoading",
      "disableInstitution",
      "enableInstitution"
    ]),
    submit() {
        this.$confirm("Edit Institution Details?").then(() => {
            const data = { id: this.$route.params.id, ...this.institution}
            this.editInstitution(data);
      });
    },
    fetchLgas() {
      this.institution.lga = "";
      this.getLgas(this.institution.state);
    },
    doDisable(){
        this.$confirm("Disable Institution! Are you sure?").then(() => {
            this.disableInstitution({ id: this.$route.params.id })
            this.getInstitution()
      });
    },
    doEnable(){
        this.$confirm("Enable Institution?").then(() => {
            this.enableInstitution({ id: this.$route.params.id })
            this.getInstitution()
      });
    },
    async getInstitution(){
         this.setLoading(true);
        const res = await axios.get(
        `${process.env.VUE_APP_API_URL}/institution/${this.$route.params.id}`
        );
        const { institution } = res.data;
        this.institution = institution;
        this.getLgas(this.institution.state);
        this.setLoading(false);
    }
  },
  async mounted() {
    this.getCountries();
    this.getStates();
    await this.getInstitution()
  },
};
</script>
<style>
</style>
