import DashboardLayout from "@/layout/dashboard/DashboardLayout.vue";
// GeneralViews
import NotFound from "@/pages/NotFoundPage.vue";

// Admin pages
import Dashboard from "@/pages/Dashboard.vue";
import UserProfile from "@/pages/UserProfile.vue";
import Notifications from "@/pages/Notifications.vue";
import Icons from "@/pages/Icons.vue";
import Maps from "@/pages/Maps.vue";
import Typography from "@/pages/Typography.vue";
import TableList from "@/pages/TableList.vue";
import Transactions from "@/pages/Transactions.vue";
import Login from "@/pages/Login.vue";
import Register from "@/pages/Register.vue"
import AddTerminal from "@/pages/AddTerminal.vue"
import WalletReports from "@/pages/WalletReports.vue";
import AddMerchant from "@/pages/AddMerchant.vue"
import Merchants from "@/pages/Merchant.vue"
import Terminals from "@/pages/Terminals.vue"
import EditMerchant from "@/pages/EditMerchant.vue"
import MerchantAgents from "@/pages/Agents.vue"
import CreateAgent from "@/pages/AddAgent.vue"
import ViewAgent from "@/pages/ViewAgent"

const routes = [
  {
    path: "/",
    name: "landing",
    redirect: "/login",
    component: Login
  },
  {
    path: "/login",
    name: "login",
    component: Login
  },
  {
    path: "/dashboard",
    component: DashboardLayout,
    children: [
      {
        path: "/",
        name: "dashboard",
        component: Dashboard
      },
      {
        path: "stats",
        name: "stats",
        component: UserProfile
      },
      {
        path: "add-terminal",
        name: "add-terminal",
        component: AddTerminal
      },
      {
        path: "transactions",
        name: "transactions",
        component: Transactions
      },
      {
        path: "wallet-reports",
        name: "wallet-reports",
        component: WalletReports
      },
      {
        path: "notifications",
        name: "notifications",
        component: Notifications
      },
      {
        path: "create-user",
        name: "crate-user",
        component: Register
      },
      {
        path: "create-merchant",
        name: "crate-merchant",
        component: AddMerchant
      },
      {
        path: "merchants",
        name: "merchant",
        component: Merchants
      },
      {
        path: "merchant/:id",
        name: "edit-merchant",
        component: EditMerchant
      },
      {
        path: "agent/:agentId",
        name: "View-Agent",
        component: ViewAgent
      },
      {
        path: "merchant/:merchantId/agents",
        name: "merchant-agents",
        component: MerchantAgents
      },
      {
        path: "merchant/:merchantId/create-agent",
        name: "merchant-agents",
        component: CreateAgent
      },      {
        path: "terminals",
        name: "terminals",
        component: Terminals
      },
      {
        path: "icons",
        name: "icons",
        component: Icons
      },
      {
        path: "maps",
        name: "maps",
        component: Maps
      },
      {
        path: "typography",
        name: "typography",
        component: Typography
      },
      {
        path: "table-list",
        name: "table-list",
        component: TableList
      }
    ]
  },
  { path: "*", component: NotFound }
];

/**
 * Asynchronously load view (Webpack Lazy loading compatible)
 * The specified component must be inside the Views folder
 * @param  {string} name  the filename (basename) of the view to load.
function view(name) {
   var res= require('../components/Dashboard/Views/' + name + '.vue');
   return res;
};**/

export default routes;
