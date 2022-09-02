import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/perro',
    name: 'Adjustments',
    component: () => import('../components/adjustments.vue')
  },
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('../components/dashboard/container.vue')
  },
  {
    path: '/reports',
    name: 'Reports',
    component: () => import('../components/reports/container.vue')
  },
  {
    path: '/quotations',
    name: 'Quotations',
    component: () => import('../components/quotations/table.vue')
  },
  {
    path: '/new-sales',
    name: 'Sales',
    component: () => import('../components/sales/table2.vue')
  },
  {
    path: '/canceled',
    name: 'Canceled', 
    component: () => import('../components/canceled/table.vue')
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('../components/settings/container.vue')
  },
  {
    path: '/clients',
    name: 'Clients',
    component: () => import('../components/clients/table.vue')
  },
  {
    path: '/clients/client/:id',
    name: 'clientDetail',
    component: () => import('../components/clients/companies/clientDetail.vue')
  },
  {
    path: '/calendar',
    name: 'calendar',
    component: () => import('../components/activities/calendar.vue')
  },
  {
    path: '/calls',
    name: 'Call',
    component: () => import('../components/calls/table.vue')
  },
  {
    path: '/messages',
    name: 'Messages',
    component: () => import('../components/messages/container.vue')
  },
  {
    path: '/activities',
    name: 'Activities',
    component: () => import('../components/activities/table.vue')
  },
  {
    path: '/activity-log',
    name: 'Activity Log',
    component: () => import('../components/activitylog/container.vue')
  },
  {
    path: '/notes',
    name: 'Notes',
    component: () => import('../components/notes/container.vue')
  },
  {
    path: '/physical-inventory',
    name: 'Physical Inventory',
    component: () => import('../components/physical_inventory/container.vue')
  },
  {
    path: '/inventory-reports',
    name: 'Inventory Reports',
    component: () => import('../components/reports/inventory.vue')
  },
  {
    path: '/inventory',
    name: 'Inventory',
    component: () => import('../components/inventory/container.vue')
  },
  {
    path: '/products',
    name: 'Products',
    component: () => import('../components/products/container.vue')
  },
]

const router = new VueRouter({
  routes
})



export default router
