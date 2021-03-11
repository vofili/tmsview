<template>
  <div>
    <div class="spinner-grow" role="status" v-if="loading.show === true"></div>
    <!--Stats cards-->
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

    <div class="col-12">
        <chart-card
          title="Transaction Statistics"
          sub-title="Performance for Today"
          :chart-data="chartData"
          chart-type="Pie"
          v-if="loading.show === false"
        >
          <span slot="footer"> <i class="ti-timer"></i>Updated Today {{ moment().format('YYYY-MM-DD') }} </span>
          <div slot="legend">
            <i class="fa fa-circle text-info"></i> Success
            <i class="fa fa-circle text-danger"></i> Failed
            <i class="fa fa-circle text-warning"></i> Pending
          </div>
        </chart-card>
      </div>    

    <!--Charts-->
    <div class="row">
      <div class="col-12" v-if="loading.show === false">
        <chart-card title="Transactions"
                    sub-title="Transactions for This Year"
                    :chart-data="usersChart.data"
                    :chart-options="usersChart.options">
          <span slot="footer">
            <i class="ti-reload"></i> {{ moment().year() }} Records
          </span>
          <div slot="legend">
            <i class="fa fa-circle text-info"></i> All Transactions
            <!-- <i class="fa fa-circle text-danger"></i> Pending
            <i class="fa fa-circle text-warning"></i> Failed -->
          </div>
        </chart-card>
      </div>

      <!-- <div class="col-md-6 col-12">
        <chart-card
          :title="`${new Date().getFullYear()} Transactions`"
          sub-title="All products"
          :chart-data="activityChart.data"
          :chart-options="activityChart.options"
        >
          <span slot="footer">
            <i class="ti-check"></i> Data information certified
          </span>
          <div slot="legend">
            <i class="fa fa-circle text-info"></i> Success
            <i class="fa fa-circle text-warning"></i> Failed
          </div>
        </chart-card>
      </div> -->
    </div>
  </div>
</template>
<script>
import { StatsCard, ChartCard } from "@/components/index";
import { mapState, mapActions } from "vuex";
import axios from "axios";
import Chartist from 'chartist';
import moment from "moment"
export default {
  components: {
    StatsCard,
    ChartCard,
  },
  /**
   * Chart data used to render stats, charts. Should be replaced with server data
   */
  data() {
    return {
      moment,
      statsCards: [
        {
          type: "info",
          icon: "ti-save",
          title: "Total Transactions",
          value: "0",
          footerText: "Data for Today",
          footerIcon: "ti-reload",
        },
        {
          type: "primary",
          icon: "ti-wallet",
          title: "Successful",
          value: "0",
          footerText: "Data for Today",
          footerIcon: "ti-reload",
        },
        {
          type: "warning",
          icon: "ti-server",
          title: "Pending Transactions",
          value: "0",
          footerText: "Data for Today",
          footerIcon: "ti-reload",
        },
        {
          type: "danger",
          icon: "ti-pulse",
          title: "Failed",
          value: "0",
          footerText: "Data for Today",
          footerIcon: "ti-reload",
        },
      ],
      usersChart: {
        data: {
          labels: [
            "Jan",
            "Feb",
            "March",
            "April",
            "May",
            "June",
            "July",
            "Aug",
            "Sept",
            "Oct",
            "Nov",
            "Dec"
          ],
          series: [ [], [], [] ]
        },
        options: {
          low: 0,
          high: 1000,
          showArea: true,
          height: "245px",
          axisX: {
            showGrid: false
          },
          lineSmooth: Chartist.Interpolation.simple({
            divisor: 3
          }),
          showLine: true,
          showPoint: false
        }
      },
      // activityChart: {
      //   data: {
      //     labels: [
      //       "Jan",
      //       "Feb",
      //       "Mar",
      //       "Apr",
      //       "Mai",
      //       "Jun",
      //       "Jul",
      //       "Aug",
      //       "Sep",
      //       "Oct",
      //       "Nov",
      //       "Dec",
      //     ],
      //     series: [
      //       [542, 543, 520, 680, 653, 753, 326, 434, 568, 610, 756, 895],
      //       [230, 293, 380, 480, 503, 553, 600, 664, 698, 710, 736, 795],
      //     ],
      //   },
      //   options: {
      //     seriesBarDistance: 10,
      //     axisX: {
      //       showGrid: false,
      //     },
      //     height: "245px",
      //   },
      // },
      preferencesChart: {
        data: {
          labels: ["0%", "0%", "0%"],
          series: [0, 0, 0],
        },
        options: {},
      },
      chartData: {},
    };
  },
  computed: {
    ...mapState(["utils", "loading"]),
  },
  methods: {
    ...mapActions(["getMerchants", "setNotification", "setLoading"]),
  },
  async mounted() {
    try {
      this.setLoading(true);

      const res = await axios.post(
        `${process.env.VUE_APP_API_URL}/transaction-dashboard`
      );
      const { summary, chartData, seriesData  } = res.data;
      const { failed, successful, total, pending } = summary;
      this.statsCards[0].value = total;
      this.statsCards[1].value = successful;
      this.statsCards[2].value = pending;
      this.statsCards[3].value = failed;

      this.chartData = chartData;
      this.usersChart = seriesData
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
    this.setLoading(false);
  },
};
</script>
<style>
</style>
