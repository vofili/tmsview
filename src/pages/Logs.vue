<template>
  <div class="row transaction">
    <div class="col-12 d-flex align-items-center">
        <div class="form-row align-items-center">
          <div class="col-auto">
            <label for="inlineFormInput">Limit</label>
            <select class="form-control" v-model="limit">
              <option value="30">30</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
          <div class="col-auto mt-2">
            <label>Message</label>
            <div class="input-group mb-2">
              <input
                type="text"
                class="form-control"
                id="inlineFormInputGroup"
                placeholder="Message"
                v-model="message"
              />
            </div>
          </div>
          <div class="col-auto mt-2">
            <label>Field</label>
            <div class="input-group mb-2">
              <input
                type="text"
                class="form-control"
                id="inlineFormInputGroup"
                placeholder="field"
                v-model="field"
              />
            </div>
          </div>

           <div class="col-auto mt-2">
            <label>Value</label>
            <div class="input-group mb-2">
              <input
                type="text"
                class="form-control"
                id="inlineFormInputGroup"
                placeholder="value"
                v-model="value"
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
                <th scope="col" class="text-center">Message</th>
                <th scope="col" class="text-center">Log</th>
                <th scope="col" class="text-center">Date</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(log, index) in logs"
                :key="log._id"
              >
                <th class="text-center">{{ index + 1 }}</th>
                <td class="text-center">{{ log.message }}</td>
                <td class="text-center">
                    <textarea rows="10" cols="100">{{log.data}}</textarea>
                    {{ log.terminalId }}</td>
                <td class="text-center">
                  {{ moment(log.createdAt).format("Y-M-D h:mm:ss a") }}
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
import { mapState } from "vuex"
import Paginate from "vuejs-paginate";
export default {
  components: {
    Paginate
  },
  data() {
    return {
      error: false,
      logs: [],
      errorMsg: "",
      loading: false,
      moment,
      format: new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      page: 1,
      totalDocs: 37,
      limit: 30,
      totalPages: 0,
      hasPrevPage: false,
      hasNextPage: true,
      prevPage: null,
      nextPage: null,
      message: "",
      field: "",
      value: "",
      startDate: moment().format('YYYY-MM-DD'),
      endDate: moment().format('YYYY-MM-DD')
    };
  },
  computed: {
    ...mapState(["auth"])
  },
  methods: {
    async refresh(mode) {
      try {
        this.loading = true;
        let payload = { page: this.page, value: this.value, message: this.message, field: this.field,
          startDate: this.startDate, endDate: this.endDate, limit: this.limit
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
          `${process.env.VUE_APP_API_URL}/logs/fetch`,
          payload
        );     
        console.log(res)    
          const {
            docs,
            hasNextPage,
            hasPrevPage,
            totalPages,
            prevPage,
            nextPage,
            page,
            totalDocs
          } = res.data.logs;
          this.logs = docs;
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
        this.errorMsg = "Unable to Fetch History";
      }
      this.loading = false;
    },
  },
  async mounted() {
    try {
      this.loading = true;
      const res = await axios.post(
        `${process.env.VUE_APP_API_URL}/logs/fetch`,
        {
          page: this.page, limit: this.limit
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
        page
      } = res.data.logs;
      this.logs = docs;
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
tbody {
  background: #fff !important;
}
.list {
  list-style-type: none;
}
</style>
