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
              <option value="pendingNotification">Unsent Notification</option>
              <option value="wasRequeried">Requeried Transactions</option>
            </select>
          </div>
          <div class="col-auto">
            <label for="inlineFormInput">Limit</label>
            <select class="form-control" v-model="limit">
              <option value="50">50</option>
              <option value="100">100</option>
              <option value="200">200</option>
              <option value="300">300</option>
              <option value="500">500</option>
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
            <label>Reference</label>
            <div class="input-group mb-2">
              <input
                type="text"
                class="form-control"
                id="inlineFormInputGroup"
                placeholder="Reference"
                v-model="reference"
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
      <div class="p-4 col-6">
        <button class="btn btn-info m-2" @click="sendbatchNotification()">
          Send Batch Notification
        </button>
        <button class="btn btn-info m-2" @click="sendbatchRequery()">
          Send Batch Requery
        </button>
      </div>

      <div class="col-12">
        <card class="card-plain">
          <div class="table-full-width table-responsive">
            <table class="table">
              <thead class="tms-dark">
                <tr>
                  <th scope="col" class="text-center">
                    <input type="checkbox" @click="checkAll" />
                  </th>
                  <th scope="col" class="text-center">S/N</th>
                  <th scope="col" class="text-center">Transaction Type</th>
                  <th scope="col" class="text-center">Terminal Id</th>
                  <th scope="col" class="text-center">Card Number</th>
                  <th scope="col" class="text-center">Stan</th>
                  <th scope="col" class="text-center">Merchant Id</th>
                  <th scope="col" class="text-center">Amount</th>
                  <th scope="col" class="text-center">Reference</th>
                  <th scope="col" class="text-center">Card Type</th>
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
                  <th scope="col" class="text-center">Retries</th>
                  <th scope="col" class="text-center">Resend</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(transaction, index) in transactions"
                  :key="transaction._id"
                >
                  <th class="text-center">
                    <input
                      type="checkbox"
                      name=""
                      :value="transaction._id"
                      v-model="unsentList"
                    />
                  </th>
                  <th class="text-center">
                    {{ limit * (page - 1) + (index + 1) }}
                  </th>
                  <td class="text-center">
                    {{ transaction.product.toUpperCase() }}
                  </td>
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
                  <td class="text-center ref">
                    {{ transaction.reference || "Null" }}
                  </td>
                  <td class="text-center">
                    {{ transaction.cardType || "NULL" }}
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
                      Resend
                    </button>
                  </td>
                  <td>{{transaction.retryCount}}</td>
                  <td>
                  <button
                       
                      class="btn btn-warning"
                       @click="resendNotificationv2(transaction._id)"
                    >
                      Resend
                    </button>
                    </td>
                </tr>
              </tbody>
            </table>
          </div>
        </card>
      </div>

      <div class="mt-2 d-flex justify-content-end align-items-center">
        <!-- <div class="p-2" v-if="hasPrevPage === true">
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
        </div> -->
        <div class="p-2">
          <div class="btn">Total Records: {{ totalDocs }}</div>
        </div>
      </div>
    </div>
    <!-- <div class="p-2 d-flex">
      <div v-for="item in pageNumbers" :key="item">
        <div class="btn m-1" @click="refresh(item)">{{ item }}</div>
      </div>
    </div> -->
    <paginate
      v-model="page"
      :page-count="Math.ceil(totalDocs / Number(limit))"
      :page-range="5"
      :margin-pages="2"
      :click-handler="refresh"
      :prev-text="'Prev'"
      :next-text="'Next'"
      :container-class="'p-2 list d-flex align-items-center h4'"
      :page-class="'my-1 mx-4'"
    >
    </paginate>
  </div>
</template>
<script>
import axios from "axios";
import moment from "moment";
import fileDownload from "js-file-download";
import { convertArrayToCSV } from "convert-array-to-csv";
import { mapActions, mapState } from "vuex";
import { StatsCard, ChartCard } from "@/components/index";
import Paginate from "vuejs-paginate";
export default {
  components: {
    StatsCard,
    Paginate,
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
      limit: 50,
      totalPages: 0,
      hasPrevPage: false,
      hasNextPage: true,
      prevPage: null,
      nextPage: null,
      totalDocs: 0,
      pageNumbers: [],
      status: "",
      terminalId: "",
      reference: "",
      stan: "",
      startDate: moment().format("YYYY-MM-DD"),
      endDate: moment().format("YYYY-MM-DD"),
      unsentList: [],
      allChecked: false,
    };
  },
  computed: {
    ...mapState(["auth"]),
  },
  methods: {
    ...mapActions(["setNotification"]),
    async resendNotification(id) {
      this.loading = true;
      try {
        const res = await axios.post(
          `${process.env.VUE_APP_API_URL}/transaction/resend-notification`,
          { id }
        );
        const { message } = res.data;
        this.setNotification({
          type: "success",
          message,
        });
        this.refresh("");
      } catch (error) {
        if (error.response && error.response.data) {
          const { message } = error.response.data;
          this.setNotification({ type: "danger", message });
        } else {
          console.log(error);
          this.setNotification({
            type: "danger",
            message: "Unable to Send Notification",
          });
        }
      }
      this.loading = false;
    },
    async refresh(mode) {
      try {
        this.loading = true;
        let payload = {
          page: this.page,
          status: this.status,
          terminalId: this.terminalId,
          stan: this.stan,
          reference: this.reference,
          startDate: this.startDate,
          endDate: this.endDate,
          limit: this.limit
        };
        if (typeof mode === "number") {
          payload = { ...payload, page: mode };
        } else {
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
            totalDocs,
            page,
          } = res.data.transactions;
          this.transactions = docs;
          this.hasPrevPage = hasPrevPage;
          this.hasNextPage = hasNextPage;
          this.totalPages = totalPages;
          this.prevPage = prevPage;
          this.nextPage = nextPage;
          this.totalDocs = totalDocs;
          this.page = page;
          const { failed, successful, total, pending } = res.data.summary;
          this.statsCards[0].value = `₦${this.format.format(total.toFixed(2) / 100)}`;
          this.statsCards[1].value = `₦${this.format.format(successful.toFixed(2) / 100)}`;
          this.statsCards[2].value = `₦${this.format.format(pending.toFixed(2) / 100)}`;
          this.statsCards[3].value = `₦${this.format.format(failed.toFixed(2) / 100)}`;
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
    async sendbatchNotification() {
      this.$confirm("Send Batch Notification?").then(async () => {
        this.loading = true;
        try {
          const res = await axios.post(
            `${process.env.VUE_APP_API_URL}/transaction/send-batch-notification`,
            { ids: this.unsentList }
          );
          const { message } = res.data;
          this.setNotification({
            type: "success",
            message,
          });
          this.refresh("");
        } catch (error) {
          if (error.response && error.response.data) {
            const { message } = error.response.data;
            this.setNotification({ type: "danger", message });
          } else {
            console.log(error);
            this.setNotification({
              type: "danger",
              message: "Unable to Send Notification",
            });
          }
        }
        this.loading = false;
      });
    },
    async sendbatchRequery() {
      this.$confirm("Send Batch Requery?").then(async () => {
        this.loading = true;
        try {
          const res = await axios.post(
            `${process.env.VUE_APP_API_URL}/transaction/tms/kimono-batch-requery`,
            { ids: this.unsentList }
          );
          const { message } = res.data;
          this.setNotification({
            type: "success",
            message,
          });
          this.refresh("");
        } catch (error) {
          if (error.response && error.response.data) {
            const { message } = error.response.data;
            this.setNotification({ type: "danger", message });
          } else {
            console.log(error);
            this.setNotification({
              type: "danger",
              message: "Unable to Send Requery",
            });
          }
        }
        this.loading = false;
      });
    },
    checkAll() {
      if (this.allChecked === false) {
        this.unsentList = this.transactions.map((el) => el._id);
      } else {
        this.unsentList = [];
      }
      this.allChecked = !this.allChecked;
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
          limit: this.limit
        }
      );
      const {
        docs,
        hasNextPage,
        hasPrevPage,
        totalPages,
        prevPage,
        nextPage,
        totalDocs,
        page,
      } = res.data.transactions;
      this.transactions = docs;
      this.hasPrevPage = hasPrevPage;
      this.hasNextPage = hasNextPage;
      this.totalPages = totalPages;
      this.prevPage = prevPage;
      this.nextPage = nextPage;
      this.totalDocs = totalDocs;
      this.page = page;
      const { failed, successful, total, pending } = res.data.summary;
      this.statsCards[0].value = `₦${this.format.format(total.toFixed(2) / 100)}`;
      this.statsCards[1].value = `₦${this.format.format(successful.toFixed(2) / 100)}`;
      this.statsCards[2].value = `₦${this.format.format(pending.toFixed(2) / 100)}`;
      this.statsCards[3].value = `₦${this.format.format(failed.toFixed(2) / 100)}`;
    } catch (error) {
      console.log(error);
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
.ref {
  font-size: 8px;
}
button {
  padding: 0.2rem 10px !important;
}
.list {
  list-style-type: none;
}
</style>
