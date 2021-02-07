<template>
  <div class="row transaction">
    <div  class="spinner-grow" role="status" v-if="loading === true"></div>
    <div class="alert alert-danger" role="alert" v-if="error === true">
      {{ errorMsg }}
    </div>
    <!-- <h4>Transactions</h4> -->
    <div class="p-4 col-12">
      <button class="btn btn-info m-2" @click="refresh('refresh')">Refresh</button>
      <router-link class="btn btn-info m-2"  :to="`/dashboard/create-merchant`">
        Add Merchant</router-link>
    </div>

    <div class="col-12">
      <card class="card-plain">
        <div class="table-full-width table-responsive">
          <table class="table">
            <thead class="thead-dark">
              <tr>
                <th scope="col" class="text-center">S/N</th>
                <th scope="col" class="text-center">Merchant Name</th>
                <th scope="col" class="text-center">Company Name</th>
                <th scope="col" class="text-center">Institution</th>
                <th scope="col" class="text-center">Email</th>
                <th scope="col" class="text-center">Wallet Id</th>
                <th scope="col" class="text-center">Phone Number</th>
                <th scope="col" class="text-center">Address</th>
                <th scope="col" class="text-center">State</th>
                <th scope="col" class="text-center">Country</th>
                <th scope="col" class="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(merchant, index) in merchants"
                :key="merchant._id"
              >
                <th class="text-center">{{ index + 1 }}</th>
                <td class="text-center">{{ merchant.merchantName }}</td>
                <td class="text-center">{{ merchant.companyName }}</td>
                <td class="text-center">{{ merchant.institutionName || 'NULL' }}</td>
                <td class="text-center">{{ merchant.email }}</td>
                <td class="text-center">{{ merchant.walletId }}</td>
                <td class="text-center">{{ merchant.phoneNumber }}</td>
                <td class="text-center">{{ merchant.address }}</td>
                <td class="text-center">{{ merchant.state }}</td>
                <td class="text-center">{{ merchant.country }}</td>
                <td class="text-center">
                  <drop-down class="nav-item" title="Options" id="list">
                    <div class="p-2">                        
                        <router-link :to="`/dashboard/merchant/${merchant._id}`"> View Merchant </router-link>
                    </div>
                    <div class="p-2">
                        <router-link :to="`/dashboard/merchant/${merchant._id}/agents`"> View Agents </router-link>
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
      merchants: [],
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
          `${process.env.VUE_APP_API_URL}/auth/get-merchants`,
          payload
        );
        const {
          docs,
          hasNextPage,
          hasPrevPage,
          totalPages,
          prevPage,
          nextPage,
        } = res.data.merchants;
        this.merchants = docs;
        this.hasPrevPage = hasPrevPage;
        this.hasNextPage = hasNextPage;
        this.totalPages = totalPages;
        this.prevPage = prevPage;
        this.nextPage = nextPage;
      } catch (err) {
        console.log(err);
        this.error = true;
        this.errorMsg = "Unable to Fetch Merchants";
      }
      this.loading = false;
    },
  },
  async mounted() {
    try {
      this.loading = true;
      const res = await axios.post(
        `${process.env.VUE_APP_API_URL}/auth/get-merchants`,
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
      } = res.data.merchants;
      this.merchants = docs;
      this.hasPrevPage = hasPrevPage;
      this.hasNextPage = hasNextPage;
      this.totalPages = totalPages;
      this.prevPage = prevPage;
      this.nextPage = nextPage;
    
    } catch (err) {
      console.log(err);
      this.error = true;
      this.errorMsg = "Unable to Fetch Merchants";
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
#list {
    list-style-type: none;
}
tbody {
  background: #fff !important;
}
</style>
