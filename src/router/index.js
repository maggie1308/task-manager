import { createRouter, createWebHistory } from 'vue-router';
import Auth from '../views/Auth.vue';
import Tasks from '../views/Tasks.vue';
import TaskDetails from '../views/TaskDetails.vue'; // импортируем новый компонент

const routes = [
  { path: '/auth', name: 'Auth', component: Auth },
  { path: '/tasks', name: 'Tasks', component: Tasks },
  {
    path: '/tasks/:id', // динамический сегмент для ID задачи
    name: 'TaskDetails',
    component: TaskDetails,
    props: true, // передаем параметры как пропсы
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
