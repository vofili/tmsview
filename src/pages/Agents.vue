<template>
  <div class="row transaction">
    <div class="spinner-grow" role="status" v-if="loading === true"></div>
    <div class="alert alert-danger" role="alert" v-if="error === true">
      {{ errorMsg }}
    </div>
    <div class="col-12" v-if="auth.merchant !== null">
      <p>Merchant Name: {{ auth.merchant.merchantName }}</p>
    </div>
    <!-- <h4>Transactions</h4> -->
    <div class="p-4 col-12">
      <!-- <button class="btn btn-info m-2" @click="refresh('refresh')">Refresh</button> -->
      <router-link
        class="btn btn-info m-2"
        :to="`/dashboard/merchant/${$route.params.merchantId}/create-agent`"
      >
        Add Agents To Merchant</router-link
      >
    </div>

    <div class="col-12">
      <card class="card-plain">
        <div class="table-full-width table-responsive">
          <table class="table">
            <thead class="thead-dark">
              <tr>
                <th scope="col" class="text-center">S/N</th>
                <th scope="col" class="text-center">First Name</th>
                <th scope="col" class="text-center">Last Name</th>
                <th scope="col" class="text-center">Email</th>
                <th scope="col" class="text-center">Agent Id / Wallet Id</th>
                <th scope="col" class="text-center">Business Name</th>
                <th scope="col" class="text-center">Phone Number</th>
                <th scope="col" class="text-center">Address</th>
                <th scope="col" class="text-center">State</th>
                <th scope="col" class="text-center">Country</th>
                <th scope="col" class="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(agent, index) in agents" :key="agent._id">
                <th class="text-center">{{ index + 1 }}</th>
                <td class="text-center">{{ agent.firstName }}</td>
                <td class="text-center">{{ agent.lastName }}</td>
                <td class="text-center">{{ agent.email }}</td>
                <td class="text-center">{{ agent.agentId }}</td>
                <td class="text-center">{{ agent.businessName }}</td>
                <td class="text-center">{{ agent.phoneNumber }}</td>
                <td class="text-center">{{ agent.address }}</td>
                <td class="text-center">{{ agent.state }}</td>
                <td class="text-center">{{ agent.country }}</td>
                <td class="text-center">
                  <router-link :to="`/dashboard/agent/${agent._id}`">
                    View Agent
                  </router-link>
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
import { mapState, mapActions, mapMutations } from "vuex";
export default {
  components: {},
  data() {
    return {
      error: false,
      agents: [],
      errorMsg: "",
      moment,
      format: new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      page: 1,
      //   totalDocs: 37,
      limit: 20,
      totalPages: 0,
      hasPrevPage: false,
      hasNextPage: true,
      prevPage: null,
      nextPage: null,
    };
  },
  computed: {
    ...mapState(["loading", "auth"]),
  },
  methods: {
    ...mapActions(["getMerchant"]),
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
          `${process.env.VUE_APP_API_URL}/merchant/get-agents`,
          { ...payload, merchantId: this.$route.params.merchantId, }
        );
        const {
          docs,
          hasNextPage,
          hasPrevPage,
          totalPages,
          prevPage,
          nextPage,
        } = res.data.agents;
        this.agents = docs;
        this.hasPrevPage = hasPrevPage;
        this.hasNextPage = hasNextPage;
        this.totalPages = totalPages;
        this.prevPage = prevPage;
        this.nextPage = nextPage;
      } catch (err) {
        console.log(err);
        this.error = true;
        this.errorMsg = "Unable to Fetch Agent";
      }
      this.loading = false;
    },
  },
  async mounted() {
    this.getMerchant(this.$route.params.merchantId);
    try {
      this.loading = true;
      const res = await axios.post(
        `${process.env.VUE_APP_API_URL}/merchant/get-agents`,
        {
          page: this.page,
          merchantId: this.$route.params.merchantId,
        }
      );
      const {
        docs,
        hasNextPage,
        hasPrevPage,
        totalPages,
        prevPage,
        nextPage,
      } = res.data.agents;
      this.agents = docs;
      this.hasPrevPage = hasPrevPage;
      this.hasNextPage = hasNextPage;
      this.totalPages = totalPages;
      this.prevPage = prevPage;
      this.nextPage = nextPage;
    } catch (err) {
      console.log(err);
      this.error = true;
      this.errorMsg = "Unable to Fetch Agents";
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
