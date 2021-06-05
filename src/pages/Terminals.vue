<template>
  <div class="row transaction">
    <div>
      <router-link class="btn btn-info m-2" to="/dashboard/add-terminal">
        Add Terminal</router-link
      >
      <router-link class="btn btn-info m-2" to="/dashboard/upload-terminal">
        Upload Terminal</router-link
      >
      <router-link
        class="btn btn-info m-2"
        to="/dashboard/terminal-configuration"
      >
        Terminal Configuration</router-link
      >
      <router-link
        class="btn btn-info m-2"
        to="/dashboard/terminal-remote-download"
      >
        Remote Download
      </router-link>
      <button class="btn btn-info" @click="refresh('refresh')">Refresh</button>
    </div>
    <div class="col-12 d-flex align-items-center">
      <div class="form-row align-items-center">
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
          <label>Serial Number</label>
          <div class="input-group mb-2">
            <input
              type="text"
              class="form-control"
              id="inlineFormInputGroup"
              placeholder="Serial Number"
              v-model="serialNo"
            />
          </div>
        </div>
        <div class="col-auto mt-2">
          <label>Merchant Id</label>
          <div class="input-group mb-2">
            <input
              type="text"
              class="form-control"
              id="inlineFormInputGroup"
              placeholder="Merchant Id"
              v-model="merchantId"
            />
          </div>
        </div>

        <div class="col-auto mt-2">
          <label>Agent Id</label>
          <div class="input-group mb-2">
            <input
              type="text"
              class="form-control"
              id="inlineFormInputGroup"
              placeholder="Agent Id"
              v-model="agentId"
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
                <th scope="col" class="text-center">Agent Id</th>
                <th scope="col" class="text-center">Agent Name</th>
                <th scope="col" class="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(terminal, index) in terminals" :key="terminal._id">
                <th class="text-center">
                  {{ limit * (page - 1) + (index + 1) }}
                </th>
                <td class="text-center">{{ terminal.terminalId }}</td>
                <td class="text-center">{{ terminal.serialNo }}</td>
                <!-- <td class="text-center">{{ terminal.currentVersion }}</td> -->
                <td class="text-center">{{ terminal.merchantId }}</td>
                <td class="text-center">
                  {{ terminal.tmsMerchantName || "" }}
                </td>
                <td class="text-center">{{ terminal.agentId || "" }}</td>
                <td class="text-center">{{ terminal.agentName || "" }}</td>
                <td class="text-center">
                  <drop-down class="nav-item" title="Options" id="list">
                    <div class="p-2">
                      <router-link
                        :to="`/dashboard/view-terminal/${terminal.terminalId}`"
                      >
                        View
                      </router-link>
                    </div>
                  </drop-down>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </card>
    </div>

    <div class="mt-2 d-flex justify-content-end align-items-center">
      <div class="p-2">
        <div class="btn">Total Records: {{ totalDocs }}</div>
      </div>
    </div>
    <paginate
      v-model="page"
      :page-count="Math.ceil(totalDocs / 20)"
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
import { mapState, mapActions } from "vuex";
import { convertArrayToCSV } from "convert-array-to-csv";
import fileDownload from "js-file-download";
import Paginate from "vuejs-paginate";
export default {
  components: {
    Paginate,
  },
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
      totalDocs: 0,
      terminalId: "",
      merchantId: "",
      serialNo: "",
      agentId: "",
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
        this.errorMsg = "";
        this.error = false;
        let payload = {
          page: this.page,
          terminalId: this.terminalId,
          merchantId: this.merchantId,
          serialNo: this.serialNo,
          agentId: this.agentId,
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
          `${process.env.VUE_APP_API_URL}/terminals/get`,
          payload
        );
        if (mode === "download") {
          const csvTran = convertArrayToCSV(res.data.terminals);
          fileDownload(csvTran, "terminals.csv");
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
          } = res.data.terminals;
          this.terminals = docs;
          this.hasPrevPage = hasPrevPage;
          this.hasNextPage = hasNextPage;
          this.totalPages = totalPages;
          this.prevPage = prevPage;
          this.nextPage = nextPage;
          this.totalDocs = totalDocs;
          this.page = page;
        }
      } catch (err) {
        console.log(err);
        this.error = true;
        this.errorMsg = "Unable to Fetch Terminals";
      }
      this.loading = false;
    },
    getMerchantName(id) {
      const merchant = this.utils.merchants.filter((el) => el._id === id);
      return merchant.length !== 0 ? merchant[0].merchantName : "";
    },
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
        totalDocs,
        page,
      } = res.data.terminals;
      this.terminals = docs;
      this.hasPrevPage = hasPrevPage;
      this.hasNextPage = hasNextPage;
      this.totalPages = totalPages;
      this.prevPage = prevPage;
      this.nextPage = nextPage;
      this.totalDocs = totalDocs;
      this.page = page;
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
#list {
  list-style-type: none;
}
tbody {
  background: #fff !important;
}
.list {
  list-style-type: none;
}
</style>
