<template>
  <div class="main">
    <div>
      <router-link class="btn btn-info m-2" :to="`/dashboard/create-user`">
        Create User
      </router-link>
    </div>
    <div class="row m-2">
      <div class="form-row align-items-center">
        <div class="col-auto mt-2">
          <label>First Name</label>
          <div class="input-group mb-2">
            <input
              type="text"
              class="form-control"
              id="inlineFormInputGroup"
              placeholder="Merchant Name"
              v-model="firstName"
            />
          </div>
        </div>

        <div class="col-auto mt-2">
          <label>Email</label>
          <div class="input-group mb-2">
            <input
              type="text"
              class="form-control"
              id="inlineFormInputGroup"
              placeholder="Email"
              v-model="email"
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
      <div class="spinner-grow" role="status" v-if="loading === true"></div>
      <div class="alert alert-danger" role="alert" v-if="error === true">
        {{ errorMsg }}
      </div>
      <!-- <h4>Transactions</h4> -->
      <div class="p-4 col-12">
        <button class="btn btn-info m-2" @click="refresh('refresh')">
          Refresh
        </button>
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
                  <th scope="col" class="text-center">Company Name</th>
                  <th scope="col" class="text-center">Email</th>
                  <th scope="col" class="text-center">Phone Number</th>
                  <th scope="col" class="text-center">UserType</th>
                  <th scope="col" class="text-center">Disabled</th>
                  <th scope="col" class="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(user, index) in users" :key="user._id">
                  <th class="text-center">{{(limit * (page - 1) ) + (index + 1) }}</th>
                  <td class="text-center">{{ user.firstName }}</td>
                  <td class="text-center">{{ user.lastName }}</td>
                  <td class="text-center">{{ user.companyName }}</td>
                  <td class="text-center">{{ user.email }}</td>
                  <td class="text-center">{{ user.phoneNumber }}</td>
                  <td class="text-center">{{ user.userType }}</td>
                  <td class="text-center">{{ user.disabled }}</td>
                  <td class="text-center">
                    <drop-down class="nav-item" title="Options" id="list">
                      <div class="p-2">
                        <router-link :to="`/dashboard/user/${user._id}`">
                          View user
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
  </div>
</template>
<script>
import axios from "axios";
import moment from "moment";
import Paginate from "vuejs-paginate";
export default {
  components: {
    Paginate,
  },
  data() {
    return {
      error: false,
      users: [],
      errorMsg: "",
      loading: false,
      moment,
      page: 1,
      totalDocs: 37,
      limit: 20,
      totalPages: 0,
      hasPrevPage: false,
      hasNextPage: true,
      prevPage: null,
      nextPage: null,
      totalDocs: 0,
      firstName: "",
      email: "",
    };
  },
  methods: {
    async refresh(mode) {
      try {
        this.errorMsg = "";
        this.error = false;
        this.loading = true;
        let payload = {
          page: this.page,
          firstName: this.firstName,
          email: this.email,
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
          }
        }
        const res = await axios.post(
          `${process.env.VUE_APP_API_URL}/users`,
          payload
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
        } = res.data.users;
        this.users = docs;
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
        this.errorMsg = "Unable to Fetch Users";
      }
      this.loading = false;
    },
  },
  async mounted() {
    try {
      this.loading = true;
      const res = await axios.post(`${process.env.VUE_APP_API_URL}/users`, {
        page: this.page,
      });
      const {
        docs,
        hasNextPage,
        hasPrevPage,
        totalPages,
        prevPage,
        nextPage,
        totalDocs,
        page,
      } = res.data.users;
      this.users = docs;
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
      this.errorMsg = "Unable to Fetch Users";
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
.list {
  list-style-type: none;
}
</style>
