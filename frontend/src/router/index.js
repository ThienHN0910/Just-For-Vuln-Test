import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import ProductDetailView from '../views/ProductDetailView.vue';
import LoginView from '../views/LoginView.vue';
import ProfileView from '../views/ProfileView.vue';
import CartView from '../views/CartView.vue';
import OrdersView from '../views/OrdersView.vue';
import DocumentView from '../views/DocumentView.vue';

const routes = [
  { path: '/', name: 'Home', component: HomeView },
  { path: '/product/:id', name: 'ProductDetail', component: ProductDetailView },
  { path: '/login', name: 'Login', component: LoginView },
  { path: '/profile', name: 'Profile', component: ProfileView },
  { path: '/cart', name: 'Cart', component: CartView },
  { path: '/orders', name: 'Orders', component: OrdersView },
  { path: '/documents', name: 'Documents', component: DocumentView },
  { path: '/file-viewer', redirect: '/documents' }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
