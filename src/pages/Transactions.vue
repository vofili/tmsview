<template>
  <div class="transaction">
    <div class="row">
      <div
        class="col-md-6 col-xl-3"
        v-for="stats in statsCards"
        :key="stats.title"
      >
        <stats-card>
          <div
            class="icon-big text-center"
            :class="`icon-${stats.type}`"
            slot="header"
          >
            <i :class="stats.icon"></i>
          </div>
          <div class="numbers" slot="content">
            <p>{{ stats.title }}</p>
            {{ stats.value }}
          </div>
          <div class="stats" slot="footer">
            <i :class="stats.footerIcon"></i> {{ stats.footerText }}
          </div>
        </stats-card>
      </div>
    </div>
    <div class="row">
      <div class="col-12 d-flex align-items-center">
        <div class="form-row align-items-center">
          <div class="col-auto">
            <label for="inlineFormInput">Status</label>
            <select class="form-control" v-model="status">
              <option value="">Select Status</option>
              <option value="successful">Successful</option>
              <option value="failed">Failed</option>
              <option value="pending">Pending</option>
            </select>
          </div>
          <div
            class="col-auto mt-2"
            v-if="auth.user.userType === 'super-admin'"
          >
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
            <label>Stan</label>
            <div class="input-group mb-2">
              <input
                type="text"
                class="form-control"
                id="inlineFormInputGroup"
                placeholder="Stan"
                v-model="stan"
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
          <div class="col-auto mt-2">
            <button
              type="submit"
              class="btn btn-primary mb-2 mt-4"
              @click="refresh('download')"
            >
              Download
            </button>
          </div>
        </div>
      </div>
      <div class="spinner-grow" role="status" v-if="loading === true"></div>
      <div class="alert alert-danger" role="alert" v-if="error === true">
        {{ errorMsg }}
      </div>
      <!-- <h4>Transactions</h4> -->
      <div class="p-4 col-12">
        <button class="btn btn-info" @click="refresh('refresh')">
          Refresh
        </button>
      </div>

      <div class="col-12">
        <card class="card-plain">
          <div class="table-full-width table-responsive">
            <table class="table">
              <thead class="tms-dark">
                <tr>
                  <th scope="col" class="text-center">S/N</th>
                  <th scope="col" class="text-center">Transaction Type</th>
                  <th scope="col" class="text-center">Terminal Id</th>
                  <th scope="col" class="text-center">Card Number</th>
                  <th scope="col" class="text-center">Stan</th>
                  <th scope="col" class="text-center">Merchant Id</th>
                  <th scope="col" class="text-center">Amount</th>
                  <th scope="col" class="text-center">Reference</th>
                  <th scope="col" class="text-center">Location</th>
                  <th scope="col" class="text-center">Response Code</th>
                  <th scope="col" class="text-center">Message</th>
                  <th scope="col" class="text-center">Date</th>
                  <th
                    scope="col"
                    class="text-center"
                    v-if="auth.user.userType === 'super-admin'"
                  >
                    Notification
                  </th>
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
                    {{
                      transaction.terminalInformation
                        ? transaction.terminalInformation.merchantId
                        : ""
                    }}
                  </td>
                  <td class="text-center">
                    {{
                      `₦${format.format(transaction.amount.toFixed(2) / 100)}`
                    }}
                  </td>
                  <td class="text-center">
                    {{
                      transaction.reference
                        ? transaction.reference.split("|").join("| ")
                        : "Null"
                    }}
                  </td>
                  <td class="text-center">
                    {{
                      typeof transaction.location === "object" &&
                      transaction.location
                        ? `${transaction.location.streetNumber}, ${transaction.location.streetName}, ${transaction.location.city}, ${transaction.location.country}`
                        : transaction.location || "Unavailable"
                    }}
                  </td>

                  <td class="text-center">
                    {{
                      transaction.response
                        ? transaction.response.responseCode
                        : ""
                    }}
                  </td>
                  <td class="text-center">
                    {{
                      transaction.response
                        ? transaction.response.description
                        : ""
                    }}
                  </td>
                  <td class="text-center">
                    {{
                      moment(transaction.createdAt).format("Y-MM-D h:mm:ss a")
                    }}
                  </td>
                  <td
                    class="text-center"
                    v-if="auth.user.userType === 'super-admin'"
                  >
                    <button
                      v-if="transaction.notification === true"
                      class="btn btn-pimary"
                    >
                      Sent
                    </button>
                    <button
                      v-else
                      class="btn btn-warning"
                      @click="resendNotification(transaction._id)"
                      :disabled="loading"
                    >
                      Retry
                    </button>
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
  </div>
</template>
<script>
import axios from "axios";
import moment from "moment";
import fileDownload from "js-file-download";
import { convertArrayToCSV } from "convert-array-to-csv";
import { mapActions, mapState } from "vuex";
import { StatsCard, ChartCard } from "@/components/index";
export default {
  components: {
    StatsCard,
  },
  data() {
    return {
      statsCards: [
        {
          type: "info",
          icon: "ti-save",
          title: "Total Transactions",
          value: "₦0",
          footerText: "All Trasactions",
          footerIcon: "ti-reload",
        },
        {
          type: "primary",
          icon: "ti-wallet",
          title: "Successful",
          value: "₦0",
          footerText: "Successful Transactions",
          footerIcon: "ti-reload",
        },
        {
          type: "warning",
          icon: "ti-server",
          title: "Pending Transactions",
          value: "₦0",
          footerText: "Pending Trasactions",
          footerIcon: "ti-reload",
        },
        {
          type: "danger",
          icon: "ti-pulse",
          title: "Failed",
          value: "₦0",
          footerText: "Failed Transactions",
          footerIcon: "ti-reload",
        },
      ],
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
      status: "",
      terminalId: "",
      stan: "",
      startDate: moment().format("YYYY-MM-DD"),
      endDate: moment().format("YYYY-MM-DD"),
    };
  },
  computed: {
    ...mapState(["auth"]),
  },
  methods: {
    ...mapActions(["setNotification"]),
    async resendNotification(id){
      this.loading = true
      try {
        const res = await axios.post(
          `${process.env.VUE_APP_API_URL}/transaction/resend-notification`, { id }
        );
        const { message } = res.data
        this.setNotification({
            type: "success",
            message,
        });
        this.refresh('')
      } catch (error) {
        if (error.response && error.response.data) {
          const { message } = error.response.data;
          this.setNotification({ type: "danger", message });
        } else {
          console.log(error)
          this.setNotification({
            type: "danger",
            message: "Unable to Send Notification",
          });
        }
      }
      this.loading = false
    },
    async refresh(mode) {
      try {
        this.loading = true;
        let payload = {
          page: this.page,
          status: this.status,
          terminalId: this.terminalId,
          stan: this.stan,
          startDate: this.startDate,
          endDate: this.endDate,
        };
        switch (mode) {
          case "next":
            payload = { ...payload, page: this.nextPage };
            break;
          case "previous":
            payload = { ...payload, page: this.prevPage };
            break;
          case "download":
            payload = { ...payload, download: true };
            break;
        }
        const res = await axios.post(
          `${process.env.VUE_APP_API_URL}/transactions/details`,
          payload
        );
        if (mode === "download") {
          const csvTran = convertArrayToCSV(res.data.transactions);
          fileDownload(csvTran, "transactions.csv");
        } else {
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
          const { failed, successful, total, pending } = res.data.summary;
          this.statsCards[0].value = `₦${total.toFixed(2) / 100}`;
          this.statsCards[1].value = `₦${successful.toFixed(2) / 100}`;
          this.statsCards[2].value = `₦${pending.toFixed(2) / 100}`;
          this.statsCards[3].value = `₦${failed.toFixed(2) / 100}`;
        }
      } catch (error) {
        if (error.response && error.response.data) {
          const { message } = error.response.data;
          this.setNotification({ type: "danger", message });
        } else {
          this.setNotification({
            type: "danger",
            message: "Unable to Fetch Transactions",
          });
        }
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
          startDate: this.startDate,
          endDate: this.endDate,
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
      const { failed, successful, total, pending } = res.data.summary;
      this.statsCards[0].value = `₦${total.toFixed(2) / 100}`;
      this.statsCards[1].value = `₦${successful.toFixed(2) / 100}`;
      this.statsCards[2].value = `₦${pending.toFixed(2) / 100}`;
      this.statsCards[3].value = `₦${failed.toFixed(2) / 100}`;
    } catch (error) {
      console.log(error)
      if (error.response && error.response.data) {
        const { message } = error.response.data;
        this.setNotification({ type: "danger", message });
      } else {
        this.setNotification({
          type: "danger",
          message: "Unable to Fetch Transactions",
        });
      }
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
tbody {
  background: #fff !important;
}
.tms-dark {
  background-color: #333f48;
  color: #fff;
}
</style>
