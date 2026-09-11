<template>
  <div class="app-container bg-light min-vh-100 d-flex flex-column">
    <!-- Top Navigation Bar -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm sticky-top">
      <div class="container">
        <router-link class="navbar-brand d-flex align-items-center gap-2 fw-bold text-white fs-4" to="/">
          <span class="fs-3">🛍️</span> VulnShop
        </router-link>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <router-link class="nav-link" to="/">Trang chủ & Sản phẩm</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/cart">Giỏ hàng</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/orders">Đơn hàng</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/profile">Hồ sơ cá nhân</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/documents">Trung tâm tài liệu</router-link>
            </li>
          </ul>
          <div class="d-flex align-items-center gap-2">
            <template v-if="user">
              <span class="text-white me-2">Xin chào, <strong>{{ user.username }}</strong></span>
              <button class="btn btn-outline-light btn-sm" @click="logout">Đăng xuất</button>
            </template>
            <template v-else>
              <router-link class="btn btn-light btn-sm fw-semibold text-primary" to="/login">Đăng nhập</router-link>
            </template>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content Body -->
    <main class="container py-4 flex-grow-1">
      <router-view />
    </main>

    <!-- Professional Footer with Subtle Research Disclaimer -->
    <footer class="bg-dark text-white-50 py-4 mt-auto">
      <div class="container text-center">
        <p class="mb-1 text-white">© 2026 VulnShop E-Commerce Platform. All rights reserved.</p>
        <p class="small text-muted mb-0">
          ℹ️ <em>Ghi chú: Hệ thống web này được thiết kế phục vụ mục đích học tập, thực hành và nghiên cứu bảo mật (Security Research & Vulnerability Testing).</em>
        </p>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      user: null
    };
  },
  mounted() {
    this.loadUser();
  },
  methods: {
    loadUser() {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        try {
          this.user = JSON.parse(savedUser);
        } catch (e) {
          this.user = null;
        }
      } else {
        this.user = null;
      }
    },
    logout() {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      this.user = null;
      this.$router.push('/login');
    }
  },
  watch: {
    $route() {
      this.loadUser();
    }
  }
};
</script>

<style scoped>
.navbar-brand {
  letter-spacing: -0.5px;
}
.nav-link {
  font-weight: 500;
  transition: color 0.2s ease-in-out;
}
.nav-link:hover {
  color: #fff !important;
}
</style>
