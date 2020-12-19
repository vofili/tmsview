<template>
  <div class="row">
    <div class="alert alert-danger" role="alert" v-if="error === true">
      {{ errorMsg }}
    </div>
    <!-- <h4>Transactions</h4> -->
    <div class="spinner-grow" role="status" v-if="loading === true"></div>

    <button class="btn btn-info" @click="refresh()">Refresh</button>

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
                <th scope="row">{{ index + 1 }}</th>
                <td class="text-center">{{ transaction.product }}</td>
                <td class="text-center">{{ transaction.terminalId }}</td>
                <td class="text-center">{{ transaction.maskedPan }}</td>
                <td class="text-center">{{ transaction.stan }}</td>
                <td class="text-center">
                  {{ `₦${new Intl.NumberFormat().format(transaction.amount)}` }}
                </td>
                <!-- <td  class="text-center">{{ transaction.status}}</td>                 -->
                <td class="text-center">
                  {{ transaction.response ? transaction.response.responseCode : "" }}
                </td>
                <td class="text-center">
                  {{ transaction.response ? transaction.response.description : "" }}
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
    };
  },
  methods: {
    async refresh() {
      try {
        this.loading = true;
        const res = await axios.get(
          "https://advanced-tms.herokuapp.com/api/v1/transactions"
        );
        const { transactions } = res.data;
        this.transactions = transactions;
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
      const res = await axios.get(
        "https://advanced-tms.herokuapp.com/api/v1/transactions"
      );
      const { transactions } = res.data;
      this.transactions = transactions;
    } catch (err) {
      console.log(err);
      this.error = true;
      this.errorMsg = "Unable to Fetch Transactions";
    }
    this.loading = false;
  },
};
</script>
<style>
</style>
