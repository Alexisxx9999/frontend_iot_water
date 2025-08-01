import { createRouter, createWebHistory } from 'vue-router';
// Layouts
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import AuthLayout from '@/layouts/AuthLayout.vue';
// Auth views
import LoginPage from '@/views/Auth/LoginPage.vue';
import RegisterPage from '@/views/Auth/RegisterPage.vue';
import ForgotPasswordPage from '@/views/Auth/ForgotPasswordPage.vue';
// Dashboard
// import DashboardOverview from '@/views/Dashboard/DashboardOverview.vue';
// Importar los nuevos componentes de nodos
import NodeListPage from '@/views/Nodes/NodeListPage.vue';
import NodeUpdatePage from '@/views/Nodes/NodeUpdatePage.vue';
import NodeCreatePage from '@/views/Nodes/NodeCreatePage.vue';
// Home CRUD
import HomeListPage from '@/views/Home/HomeListPage.vue';
import HomeCreatePage from '@/views/Home/HomeCreatePage.vue';
import HomeEditPage from '@/views/Home/HomeEditPage.vue';
import HomeDetailPage from '@/views/Home/HomeDetailPage.vue';
// Sectors CRUD
import SectorListPage from '@/views/Sectors/SectorListPage.vue';
import SectorCreatePage from '@/views/Sectors/SectorCreatePage.vue';
import SectorEditPage from '@/views/Sectors/SectorEditPage.vue';
// Notifications
// import NotificationsPage from '@/views/Notifications/NotificationsPage.vue';
import GatewayListPage from '@/views/Gateways/GatewayListPage.vue';
import GatewayCreatePage from '@/views/Gateways/GatewayCreatePage.vue';
import GatewayEditPage from '@/views/Gateways/GatewayEditPage.vue';
import LecturaListPage from '@/views/Lecturas/LecturaListPage.vue';
import LecturaCreatePage from '@/views/Lecturas/LecturaCreatePage.vue';
import LecturaUpdatePage from '@/views/Lecturas/LecturaUpdatePage.vue';
// Not Found
import NotFoundPage from '@/views/NotFoundPage.vue';

const routes = [
  {
    path: '/',
    redirect: '/auth/login'
  },
  {
    path: '/auth',
    component: AuthLayout,
    children: [
      { path: 'login', component: LoginPage },
      { path: 'register', component: RegisterPage },
      { path: 'forgot-password', component: ForgotPasswordPage },
    ],
  },
  {
    path: '/app',
    component: DefaultLayout,
    children: [
      { path: '', redirect: '/app/home' },
      // { path: 'dashboard', component: DashboardOverview },
      // Incidents
      // { path: 'incidents', component: IncidentListPage },
      // { path: 'incidents/:id', component: IncidentDetailPage },
      // CRM
      // { path: 'crm', component: CrmWhatsappPage },
      // { path: 'crm/conversations/:id', component: ConversationDetailPage },
      // { path: 'crm/training', component: ChatbotTrainingPage },
      // Complaints
      // { path: 'complaints', component: ComplaintListPage },
      // { path: 'complaints/:id', component: ComplaintDetailPage },
      // Map
      // { path: 'map', component: MapPage },
      // Nodos
      { path: 'dashboard', component: () => import('@/views/Dashboard/DashboardPage.vue') },
      { path: 'nodes', component: NodeListPage },
      { path: 'nodes/create', component: NodeCreatePage },
      { path: 'nodes/update/:id', component: NodeUpdatePage },
      // Roles
      { path: 'roles', name: 'RoleList', component: () => import('@/views/Roles/RoleListPage.vue') },
      { path: 'roles/create', name: 'RoleCreate', component: () => import('@/views/Roles/RoleCreatePage.vue') },
      { path: 'roles/:id/edit', name: 'RoleEdit', component: () => import('@/views/Roles/RoleUpdatePage.vue'), props: true },
      // Home CRUD
      { path: 'home', component: HomeListPage },
      { path: 'home/create', component: HomeCreatePage },
      { path: 'home/edit/:id', component: HomeEditPage },
      { path: 'home/detail/:id', component: HomeDetailPage },
      // Sectors CRUD
      { path: 'sectors', component: SectorListPage },
      { path: 'sectors/create', component: SectorCreatePage },
      { path: 'sectors/edit/:id', component: SectorEditPage },
      // Notifications
      // { path: 'notifications', component: NotificationsPage },
      // Gateways
      { path: 'gateways', component: GatewayListPage },
      { path: 'gateways/create', component: GatewayCreatePage },
      { path: 'gateways/:id/edit', component: GatewayEditPage },
      // Devices
      { path: 'devices', component: () => import('@/views/Devices/DeviceListPage.vue') },
      { path: 'devices/create', component: () => import('@/views/Devices/DeviceCreatePage.vue') },
      { path: 'devices/:id', component: () => import('@/views/Devices/DeviceDetailPage.vue') },
      { path: 'devices/:id/edit', component: () => import('@/views/Devices/DeviceEditPage.vue') },
      // Lecturas
      { path: 'lecturas', component: LecturaListPage },
      { path: 'lecturas/create', component: LecturaCreatePage },
      { path: 'lecturas/update/:id', component: LecturaUpdatePage },
      // Personal
      { path: 'personnel', name: 'PersonnelList', component: () => import('@/views/personnel/PersonnelListPage.vue') },
      { path: 'personnel/create', name: 'PersonnelCreate', component: () => import('@/views/personnel/PersonnelCreatePage.vue') },
      { path: 'personnel/:id/edit', name: 'PersonnelEdit', component: () => import('@/views/personnel/PersonnelUpdatePage.vue'), props: true },
    ],
  },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFoundPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
