<template>
  <div class="row transaction">
    <div class="col-12 d-flex align-items-center">
        <div class="form-row align-items-center">
          <div class="col-auto">
            <label for="inlineFormInput">Type</label>
            <select class="form-control" v-model="type">
              <option value="">Select Type</option>
              <option value="credit">Credit</option>
              <option value="debit">Debit</option>
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
                v-model="terminalId"
              />
            </div>
          </div>
          <div class="col-auto mt-2">
            <label>Wallet Id</label>
            <div class="input-group mb-2">
              <input
                type="text"
                class="form-control"
                id="inlineFormInputGroup"
                placeholder="walletId"
                v-model="walletId"
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
                v-model="startDate"
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
                v-model="endDate"
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
    </div>
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
                <th scope="col" class="text-center">Wallet Id</th>
                <th scope="col" class="text-center">Terminal Id</th>
                <th scope="col" class="text-center">Type</th>
                <th scope="col" class="text-center">Amount</th>
                <th scope="col" class="text-center">Previous Balance</th>
                <th scope="col" class="text-center">New Balance</th>
                <th scope="col" class="text-center">Date</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(hist, index) in history"
                :key="hist._id"
              >
                <th class="text-center">{{ index + 1 }}</th>
                <td class="text-center">{{ hist.walletId }}</td>
                <td class="text-center">{{ hist.terminalId }}</td>
                <td class="text-center">{{ hist.type }}</td>
                <td class="text-center">{{ `₦${format.format(hist.amount.toFixed(2) )}`  }}</td>
                <td class="text-center">
                  {{ `₦${format.format(hist.previousBalance.toFixed(2) )}` }}
                </td>
                <td class="text-center">
                  {{ `₦${format.format(hist.newBalance.toFixed(2) )}` }}
                </td>
                <td class="text-center">
                  {{ moment(hist.createdAt).format("Y-M-D h:mm:ss a") }}
                </td>
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
export default {
  components: {},
  data() {
    return {
      error: false,
      history: [],
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
      type: "",
      terminalId: "",
      walletId: "",
      startDate: moment().format('YYYY-MM-DD'),
      endDate: moment().format('YYYY-MM-DD')
    };
  },
  methods: {
    async refresh(mode) {
      try {
        this.loading = true;
        let payload = { page: this.page, type: this.type, terminalId: this.terminalId, walletId: this.walletId,
          startDate: this.startDate, endDate: this.endDate
        };
        switch (mode) {
          case "next":
            payload = {...payload, page: this.nextPage };
            break;
          case "previous":
            payload = {...payload, page: this.prevPage };
            break;
        }
        const res = await axios.post(
          `${process.env.VUE_APP_API_URL}/transactions/wallet-reports`,
          payload
        );
        const {
          docs,
          hasNextPage,
          hasPrevPage,
          totalPages,
          prevPage,
          nextPage,
        } = res.data.history;
        this.history = docs;
        this.hasPrevPage = hasPrevPage;
        this.hasNextPage = hasNextPage;
        this.totalPages = totalPages;
        this.prevPage = prevPage;
        this.nextPage = nextPage;
      } catch (err) {
        console.log(err);
        this.error = true;
        this.errorMsg = "Unable to Fetch History";
      }
      this.loading = false;
    },
  },
  async mounted() {
    try {
      this.loading = true;
      const res = await axios.post(
        `${process.env.VUE_APP_API_URL}/transactions/wallet-reports`,
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
      } = res.data.history;
      this.history = docs;
      this.hasPrevPage = hasPrevPage;
      this.hasNextPage = hasNextPage;
      this.totalPages = totalPages;
      this.prevPage = prevPage;
      this.nextPage = nextPage;
    
    } catch (err) {
      console.log(err);
      this.error = true;
      this.errorMsg = "Unable to Fetch History";
    }
    this.loading = false;
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
