import { createRouter, createWebHistory } from 'vue-router';
// Layouts
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import AuthLayout from '@/layouts/AuthLayout.vue';
// Auth views
import LoginPage from '@/views/Auth/LoginPage.vue';
import RegisterPage from '@/views/Auth/RegisterPage.vue';
import ForgotPasswordPage from '@/views/Auth/ForgotPasswordPage.vue';
// Dashboard
import DashboardOverview from '@/views/Dashboard/DashboardOverview.vue';
// Incidents
import IncidentListPage from '@/views/Incidents/IncidentListPage.vue';
import IncidentDetailPage from '@/views/Incidents/IncidentDetailPage.vue';
// CRM
import CrmWhatsappPage from '@/views/CRM/CrmWhatsappPage.vue';
import ConversationDetailPage from '@/views/CRM/ConversationDetailPage.vue';
import ChatbotTrainingPage from '@/views/CRM/ChatbotTrainingPage.vue';
// Complaints
import ComplaintListPage from '@/views/Complaints/ComplaintListPage.vue';
import ComplaintDetailPage from '@/views/Complaints/ComplaintDetailPage.vue';
// Map
import MapPage from '@/views/Map/MapPage.vue';
// Personnel
import PersonnelListPage from '@/views/Personnel/PersonnelListPage.vue';
import PersonnelDetailPage from '@/views/Personnel/PersonnelDetailPage.vue';
// Devices
import DeviceListPage from '@/views/Devices/DeviceListPage.vue';
import DeviceDetailPage from '@/views/Devices/DeviceDetailPage.vue';
// Reports
import ReportsPage from '@/views/Reports/ReportsPage.vue';
// Notifications
import NotificationsPage from '@/views/Notifications/NotificationsPage.vue';
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
      { path: '', redirect: '/app/dashboard' },
      { path: 'dashboard', component: DashboardOverview },
      // Incidents
      { path: 'incidents', component: IncidentListPage },
      { path: 'incidents/:id', component: IncidentDetailPage },
      // CRM
      { path: 'crm', component: CrmWhatsappPage },
      { path: 'crm/conversations/:id', component: ConversationDetailPage },
      { path: 'crm/training', component: ChatbotTrainingPage },
      // Complaints
      { path: 'complaints', component: ComplaintListPage },
      { path: 'complaints/:id', component: ComplaintDetailPage },
      // Map
      { path: 'map', component: MapPage },
      // Personnel
      { path: 'personnel', component: PersonnelListPage },
      { path: 'personnel/:id', component: PersonnelDetailPage },
      // Devices
      { path: 'devices', component: DeviceListPage },
      { path: 'devices/:id', component: DeviceDetailPage },
      // Reports
      { path: 'reports', component: ReportsPage },
      // Notifications
      { path: 'notifications', component: NotificationsPage },
    ],
  },
  // Not Found
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFoundPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
