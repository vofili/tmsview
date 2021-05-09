<template>
  <div class="row transaction">
    <div class="row mb-4 pl-2">
      <div class="col-md-6 mt-2">
        <label>Upload Terminal Application</label>
        <div>
          <input
            type="file"
            class="form-control"
            :file="this.file"
            @change="fileChange"
          />
        </div>
      </div>
      <div class="col-md-6 mt-2">
        <label>Version</label>
        <div class="input-group mb-2">
          <input
            type="text"
            class="form-control"
            id="inlineFormInputGroup"
            placeholder="Terminal Version"
            v-model="version"
          />
        </div>
      </div>
    </div>
    <div class="col-12 d-flex align-items-center">
      <div class="row align-items-center">
        <div class="col-md-6 mt-2">
          <label>Merchant Name</label>
          <multiselect
            v-model="selectedMerchant"
            :custom-label="optionLabel"
            track-by="_id"
            :options="utils.merchants"
            :allow-empty="false"
            placeholder="Select a Merchant"
            @close="setMerchant"
          >
            <template slot="singleLabel" slot-scope="{ option }">
              {{ option.merchantName }}
            </template>
          </multiselect>
        </div>
        <div class="col-md-3 mt-2">
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
        <div class="col-md-3 mt-2">
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
          <button
            type="submit"
            class="btn btn-primary mb-2 mt-4"
            @click="refresh('filter')"
          >
            Refresh
          </button>
        </div>
        <div class="col-auto mt-2">
          <button
            type="submit"
            class="btn btn-primary mb-2 mt-4"
            @click="refresh('download')"
          >
            Export Report
          </button>
        </div>
        <div class="col-auto mt-2">
          <button class="btn btn-primary mb-2 mt-4" @click="clear">
            Clear Form
          </button>
        </div>
        <div class="col-auto mt-2">
          <button
            type="submit"
            :disabled="terminals.length === 0"
            class="btn btn-primary mb-2 mt-4"
            @click="schedule"
          >
            Schedule
          </button>
        </div>
      </div>
    </div>
    <div class="spinner-grow" role="status" v-if="loading.show === true"></div>
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
                <th scope="col" class="text-center">Merchant</th>
                <th scope="col" class="text-center">Terminal Id</th>
                <th scope="col" class="text-center">Merchant Id</th>
                <th scope="col" class="text-center">Serial Number</th>
                <th scope="col" class="text-center">Version</th>
                <th scope="col" class="text-center">App Name</th>
                <th scope="col" class="text-center">Agent Name</th>
                <th scope="col" class="text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(terminal, index) in terminals" :key="terminal._id">
                <th class="text-center">{{ index + 1 }}</th>
                <td class="text-center">
                  {{ terminal.tmsMerchantName || "" }}
                </td>
                <td class="text-center">{{ terminal.terminalId }}</td>
                <td class="text-center">{{ terminal.merchantId }}</td>
                <td class="text-center">{{ terminal.serialNo }}</td>
                <td class="text-center">{{ terminal.appVersion }}</td>
                <td class="text-center">{{ terminal.appName }}</td>
                <td class="text-center">{{ terminal.agentName || "" }}</td>
                <td class="text-center">
                  {{ terminal.forceUpgrade === true ? "Pending" : "Completed" }}
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
import { mapState, mapActions } from "vuex";
import Multiselect from "vue-multiselect";
import fileDownload from "js-file-download";
import { convertArrayToCSV } from "convert-array-to-csv";
export default {
  components: {
    Multiselect,
  },
  data() {
    return {
      selectedMerchant: "",
      version: "",
      file: "",
      error: false,
      terminals: [],
      errorMsg: "",
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
      hasNextPage: false,
      prevPage: null,
      nextPage: null,
      terminalId: "",
      merchantId: "",
      serialNo: "",
      agentId: "",
      tmsMerchantId: "",
    };
  },
  computed: {
    ...mapState(["utils", "loading"]),
  },
  methods: {
    ...mapActions(["getMerchants", "setNotification", "setLoading"]),
    async refresh(mode) {
      try {
        this.setLoading(true);
        let payload = {
          page: this.page,
          terminalId: this.terminalId,
          merchantId: this.merchantId,
          tmsMerchantId: this.tmsMerchantId,
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
          `${process.env.VUE_APP_API_URL}/terminals/get-upgrade-list`,
          payload
        );
        if (mode === "download") {
          const csvTran = convertArrayToCSV(res.data.terminals);
          fileDownload(csvTran, "terminalUpgrades.csv");
        } else {
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
        }
      } catch (err) {
        console.log(err);
        this.error = true;
        this.setNotification({
          type: "danger",
          message: "Unable to Fetch Terminal",
        });
      }
      this.setLoading(false);
    },
    fileChange(e) {
      const file = e.target.files[0];
      this.file = file;
    },
    optionLabel({ merchantName, state, country }) {
      return `${merchantName}, ${state}, ${country}`;
    },
    schedule() {
      this.$confirm("Upgrade Terminals ?").then(async () => {
        const terminalsPayload = {
          terminalId: this.terminalId,
          merchantId: this.merchantId,
          tmsMerchantId: this.tmsMerchantId,
        }
        // this.terminals.map((item) => item.terminalId);
        const formData = new FormData();
        formData.append("app", this.file);
        formData.append("terminalsPayload", JSON.stringify(terminalsPayload));
        formData.append("version", this.version);
        // console.log(formData.get("terminalsPayload"));
        await this.scheduleDownloads(formData);
      });
    },
    async scheduleDownloads(data) {
      this.setLoading(true);
      try {
        const res = await axios.post(`${process.env.VUE_APP_API_URL}/terminal/schedule-downloads`, data);
        const { message } = res.data;
        this.setNotification({ type: "success", message });
        this.refresh("")        
      } catch (err) {
        if(err.response){
          const { message, errors } = err.response.data;
          this.setNotification({ type: "danger", message });
          if (errors) {
            Object.values(errors).forEach((element) => {
              this.setNotification({ type: "danger", message: JSON.stringify(element)});
            });
          }
        }else{
          this.setNotification({ type: "danger", message: err });
        }
      }
      this.setLoading(false);
    },
    setMerchant() {
      if (this.selectedMerchant !== "")
        this.tmsMerchantId = this.selectedMerchant._id || "";
    },
    clear() {
      Object.assign(this.$data, this.$options.data.call(this));
    },
  },
  mounted() {
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
</style>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>