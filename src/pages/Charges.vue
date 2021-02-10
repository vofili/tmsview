<template>
  <div>
    <card class="card" title="Charges">
      <div>
        <form @submit.prevent>
          <div class="row">
            <div class="col-md-5">
              <fg-input
                type="text"
                label="0 to 5,000"
                placeholder="0 to 5,000"
                v-model="terminal.charges.bands.band1"
              >
              </fg-input>
            </div>
            <div class="col-md-3">
              <fg-input
                type="text"
                label="5001 to 10,000"
                placeholder="5,001 to 10,000"
                v-model="terminal.charges.bands.band2"
              >
              </fg-input>
            </div>
            <div class="col-md-4">
              <fg-input
                type="text"
                label="10,001 to 15,000"
                placeholder="10,001 to 15,000"
                v-model="terminal.charges.bands.band3"
              >
              </fg-input>
            </div>
          </div>

          <div class="row">
            <div class="col-md-4">
              <fg-input
                type="text"
                label="15,001 to 20,000"
                placeholder="15,001 to 20,000"
                v-model="terminal.charges.bands.band4"
              >
              </fg-input>
            </div>
            <div class="col-md-4">
              <fg-input
                type="text"
                label="20,001 to 50,000"
                placeholder="20,001 to 50,000"
                v-model="terminal.charges.bands.band5"
              >
              </fg-input>
            </div>

            <div class="col-md-4">
              <fg-input
                type="text"
                label="50,0001 to 100,000"
                placeholder="50,0001 to 100,000"
                v-model="terminal.charges.bands.band6"
              >
              </fg-input>
            </div>
          </div>

          <div class="row">
            <div class="col-md-4">
              <fg-input
                type="text"
                label="100,001 to 150,000"
                placeholder="100,001 to 150,000"
                v-model="terminal.charges.bands.band7"
              >
              </fg-input>
            </div>
          </div>

          <div class="row">
            <div class="col-md-4">
              <fg-input
                type="text"
                label="Transfer Fee"
                placeholder="Transfer Fee"
                v-model="terminal.charges.transferFee"
              >
              </fg-input>
            </div>
            <div class="col-md-4">
              <fg-input
                type="text"
                label="Merchant Commission"
                placeholder="Merchant Commission"
                v-model="terminal.charges.merchantCommission"
              >
              </fg-input>
            </div>

            <div class="col-md-4">
              <fg-input
                type="text"
                label="Tms Fee"
                :disabled="true"
                placeholder="Tms Fee"
                v-model="terminal.charges.tmsCharge"
              >
              </fg-input>
            </div>
          </div>

          <div class="text-center">
            <p-button type="info" round @click.native.prevent="submit">
              <div
                class="spinner-grow"
                role="status"
                v-if="loading.show === true"
              ></div>
              Update
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
export default {
//   data() {
//     return {
//       charges: {
        
//       },
//     };
//   },
  computed: {
    ...mapState(["loading", "terminal"]),
  },
  methods: {
    ...mapActions([
      "saveCharges", "getCharges"
    ]),
    submit() {
      this.$confirm("Save Charges?").then(() => {
        this.saveCharges(this.charges);
      });
    },
  },
  async mounted() {
    this.getCharges()
  },
};
</script>
<style>
</style>
