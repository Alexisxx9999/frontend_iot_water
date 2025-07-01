import IncidentListPage from '@/views/Incidents/IncidentListPage.vue';
import IncidentDetailPage from '@/views/Incidents/IncidentDetailPage.vue';

export default [
  {
    path: '/incidents',
    name: 'IncidentList',
    component: IncidentListPage
  },
  {
    path: '/incidents/:id',
    name: 'IncidentDetail',
    component: IncidentDetailPage,
    props: true
  }
]; 