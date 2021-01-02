<template>
  <div class="row transaction">
    <!-- <div class="col-12 d-flex align-items-center">
      <form>
        <div class="form-row align-items-center">
          <div class="col-auto">
            <label for="inlineFormInput">Status</label>
            <select class="form-control">
              <option value="">Select Status</option>
              <option value="successful">Successful</option>
              <option value="failed">Failed</option>
              <option value="pending">Pending</option>
            </select>
          </div>
          <div class="col-auto mt-2">
            <label>Terminal Id</label>
            <div class="input-group mb-2">
              <input
                type="text"
                class="form-control"
                id="inlineFormInputGroup"
                placeholder="Terminal Id"
              />
            </div>
          </div>
          <div class="col-auto mt-2">
            <label>Stan</label>
            <div class="input-group mb-2">
              <input
                type="text"
                class="form-control"
                id="inlineFormInputGroup"
                placeholder="Stan"
              />
            </div>
          </div>
          <div class="col-auto mt-2">
            <label>Start Date</label>
            <div class="input-group mb-2">
              <input
                type="date"
                class="form-control"
                id="inlineFormInputGroup"
                placeholder="Start Date"
              />
            </div>
          </div>

          <div class="col-auto mt-2">
            <label>End Date</label>
            <div class="input-group mb-2">
              <input
                type="date"
                class="form-control"
                id="inlineFormInputGroup"
                placeholder="End Date"
              />
            </div>
          </div>

          <div class="col-auto mt-2">
            <button
              type="submit"
              class="btn btn-primary mb-2 mt-4"
              @click="refresh('filter')"
            >
              Filter
            </button>
          </div>
        </div>
      </form>
    </div> -->
    <div  class="spinner-grow" role="status" v-if="loading === true"></div>
    <div class="alert alert-danger" role="alert" v-if="error === true">
      {{ errorMsg }}
    </div>
    <!-- <h4>Transactions</h4> -->
    <div class="p-4 col-12">
      <button class="btn btn-info" @click="refresh('refresh')">Refresh</button>
    </div>

    <div class="col-12">
      <card class="card-plain">
        <div class="table-full-width table-responsive">
          <table class="table">
            <thead class="thead-dark">
              <tr>
                <th scope="col" class="text-center">S/N</th>
                <th scope="col" class="text-center">Terminal Id</th>
                <th scope="col" class="text-center">Serial No</th>
                <!-- <th scope="col" class="text-center">Current Version</th> -->
                <th scope="col" class="text-center">Merchant Id</th>
                <th scope="col" class="text-center">Merchant Name</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(terminal, index) in terminals"
                :key="terminal._id"
              >
                <th class="text-center">{{ index + 1 }}</th>
                <td class="text-center">{{ terminal.terminalId }}</td>
                <td class="text-center">{{ terminal.serialNo }}</td>
                <!-- <td class="text-center">{{ terminal.currentVersion }}</td> -->
                <td class="text-center">{{ terminal.merchantId }}</td>
                <td class="text-center">{{ getMerchantName(terminal.agentId) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </card>
    </div>

    <div class="mt-2 d-flex justify-content-end align-items-center">
      <div class="p-2" v-if="hasPrevPage === true">
        <button
          type="submit"
          class="btn btn-primary mb-2 mt-4"
          @click="refresh('previous')"
        >
          Previous Page
        </button>
      </div>
      <div class="p-2" v-if="hasNextPage === true">
        <button
          type="submit"
          class="btn btn-primary mb-2 mt-4"
          @click="refresh('next')"
        >
          Next Page
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import moment from "moment";
import { mapState, mapActions } from "vuex"
export default {
  components: {},
  data() {
    return {
      error: false,
      terminals: [],
      errorMsg: "",
      loading: false,
      moment,
      format: new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      page: 1,
      totalDocs: 37,
      limit: 20,
      totalPages: 0,
      hasPrevPage: false,
      hasNextPage: true,
      prevPage: null,
      nextPage: null,
    };
  },
  computed: {
    ...mapState(["utils"]),
  },
  methods: {
    ...mapActions(["getMerchants"]),
    async refresh(mode) {
      try {
        this.loading = true;
        let payload = { page: this.page };
        switch (mode) {
          case "next":
            payload = { page: this.nextPage };
            break;
          case "previous":
            payload = { page: this.prevPage };
            break;
        }
        const res = await axios.post(
          `${process.env.VUE_APP_API_URL}/terminals/get`,
          payload
        );
        const {
          docs,
          hasNextPage,
          hasPrevPage,
          totalPages,
          prevPage,
          nextPage,
        } = res.data.terminals;
        this.terminals = docs;
        this.hasPrevPage = hasPrevPage;
        this.hasNextPage = hasNextPage;
        this.totalPages = totalPages;
        this.prevPage = prevPage;
        this.nextPage = nextPage;
      } catch (err) {
        console.log(err);
        this.error = true;
        this.errorMsg = "Unable to Fetch Terminals";
      }
      this.loading = false;
    },
    getMerchantName(id){
        const merchant = this.utils.merchants.filter(el => el._id === id);
        return merchant.length !== 0 ? merchant[0].merchantName : ""
    }
  },
  async mounted() {
    try {
      this.loading = true;
      const res = await axios.post(
        `${process.env.VUE_APP_API_URL}/terminals/get`,
        {
          page: this.page,
        }
      );
      const {
        docs,
        hasNextPage,
        hasPrevPage,
        totalPages,
        prevPage,
        nextPage,
      } = res.data.terminals;
      this.terminals = docs;
      this.hasPrevPage = hasPrevPage;
      this.hasNextPage = hasNextPage;
      this.totalPages = totalPages;
      this.prevPage = prevPage;
      this.nextPage = nextPage;
    
    } catch (err) {
      console.log(err);
      this.error = true;
      this.errorMsg = "Unable to Fetch Terminals";
    }
    this.loading = false;
    this.getMerchants();
  },
};
</script>
<style scoped >
.transaction {
  font-size: 12px;
}
th {
  font-size: 12px !important;
}
.spinner-grow {
  position: fixed;
}
</style>
