<template>
  <div class="row transaction">
    <div class="col-12 d-flex align-items-center">
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
                <th scope="col" class="text-center">Transaction Type</th>
                <th scope="col" class="text-center">Terminal Id</th>
                <th scope="col" class="text-center">Card Number</th>
                <th scope="col" class="text-center">Stan</th>
                <th scope="col" class="text-center">Amount</th>
                <th scope="col" class="text-center">Location</th>
                <!-- <th scope="col"  class="text-center">Status</th> -->
                <th scope="col" class="text-center">Response Code</th>
                <th scope="col" class="text-center">Message</th>
                <th scope="col" class="text-center">Date</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(transaction, index) in transactions"
                :key="transaction._id"
              >
                <th class="text-center">{{ index + 1 }}</th>
                <td class="text-center">{{ transaction.product }}</td>
                <td class="text-center">{{ transaction.terminalId }}</td>
                <td class="text-center">{{ transaction.maskedPan }}</td>
                <td class="text-center">{{ transaction.stan }}</td>
                <td class="text-center">
                  {{ `₦${format.format(transaction.amount.toFixed(2) / 100)}` }}
                </td>
                <td class="text-center">
                  {{
                    transaction.location
                      ? `${transaction.location.city}, ${transaction.location.country}`
                      : "NULL"
                  }}
                </td>
                <!-- <td  class="text-center">{{ transaction.status}}</td>                 -->
                <td class="text-center">
                  {{
                    transaction.response
                      ? transaction.response.responseCode
                      : ""
                  }}
                </td>
                <td class="text-center">
                  {{
                    transaction.response ? transaction.response.description : ""
                  }}
                </td>
                <td class="text-center">
                  {{ moment(transaction.createdAt).format("Y-M-D h:mm:ss a") }}
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
      transactions: [],
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
  methods: {
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
          `${process.env.VUE_APP_API_URL}/transactions/details`,
          payload
        );
        const {
          docs,
          hasNextPage,
          hasPrevPage,
          totalPages,
          prevPage,
          nextPage,
        } = res.data.transactions;
        this.transactions = docs;
        this.hasPrevPage = hasPrevPage;
        this.hasNextPage = hasNextPage;
        this.totalPages = totalPages;
        this.prevPage = prevPage;
        this.nextPage = nextPage;
      } catch (err) {
        console.log(err);
        this.error = true;
        this.errorMsg = "Unable to Fetch Transactions";
      }
      this.loading = false;
    },
  },
  async mounted() {
    try {
      this.loading = true;
      const res = await axios.post(
        `${process.env.VUE_APP_API_URL}/transactions/details`,
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
      } = res.data.transactions;
      this.transactions = docs;
      this.hasPrevPage = hasPrevPage;
      this.hasNextPage = hasNextPage;
      this.totalPages = totalPages;
      this.prevPage = prevPage;
      this.nextPage = nextPage;
    
    } catch (err) {
      console.log(err);
      this.error = true;
      this.errorMsg = "Unable to Fetch Transactions";
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
