<template>
  <div>
    <div class="col-12">
      <button class="btn btn-info m-2" @click="doDisable" v-if="merchant.disabled === false">Disable Merchant</button>
      <button class="btn btn-info m-2" @click="doEnable" v-if="merchant.disabled === true">Enable Merchant</button>
       <router-link class="btn btn-info m-2" :to="`/dashboard/merchant/${$route.params.id}/agents`"> View Agents </router-link>
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
                v-model="merchant.merchantName"
              >
              </fg-input>
            </div>
            <div class="col-md-3">
              <fg-input
                type="text"
                label="Company Name"
                placeholder="Company Name"
                v-model="merchant.companyName"
              >
              </fg-input>
            </div>
            <div class="col-md-4">
              <fg-input
                type="text"
                label="Email"
                placeholder="Email"
                v-model="merchant.email"
              >
              </fg-input>
            </div>
          </div>

          <div class="row">
            <div class="col-md-8">
              <fg-input
                type="text"
                label="Address"
                placeholder="Address"
                v-model="merchant.address"
              >
              </fg-input>
            </div>
            <div class="col-md-4">
              <fg-input
                type="text"
                label="Wallet Id"
                placeholder="WalletId"
                :disabled="true"
                v-model="merchant.walletId"
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
                v-model="merchant.phoneNumber"
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
                v-model="merchant.country"
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
              Update Merchant
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
      merchant: {
        merchantName: "",
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
      "editMerchant",
      "getStates",
      "getLgas",
      "getCountries",
      "setLoading",
      "disableMerchant",
      "enableMerchant"
    ]),
    submit() {
        this.$confirm("Edit Merchant Details?").then(() => {
            const data = { id: this.$route.params.id, ...this.merchant}
            this.editMerchant(data);
      });
    },
    fetchLgas() {
      this.merchant.lga = "";
      this.getLgas(this.merchant.state);
    },
    doDisable(){
        this.$confirm("Disable Merchant! Are you sure?").then(() => {
            this.disableMerchant({ id: this.$route.params.id })
            this.getMerchant()
      });
    },
    doEnable(){
        this.$confirm("Enable Merchant?").then(() => {
            this.enableMerchant({ id: this.$route.params.id })
            this.getMerchant()
      });
    },
    async getMerchant(){
         this.setLoading(true);
        const res = await axios.get(
        `${process.env.VUE_APP_API_URL}/merchant/${this.$route.params.id}`
        );
        const { merchant } = res.data;
        this.merchant = merchant;
        this.getLgas(this.merchant.state);
        this.setLoading(false);
    }
  },
  async mounted() {
    this.getCountries();
    this.getStates();
    await this.getMerchant()
  },
};
</script>
<style>
</style>
