<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
      <div class="container">
        <router-link class="navbar-brand text-warning fw-bold" to="/">VulnShop 🎯</router-link>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <router-link class="nav-link" to="/">Sản Phẩm</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/cart">Giỏ Hàng 🛒</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/orders">Đơn Hàng (IDOR Test)</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/profile">Hồ Sơ (IDOR Test)</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link text-danger" to="/file-viewer">File Viewer (Path Traversal)</router-link>
            </li>
          </ul>
          <div class="d-flex align-items-center gap-2">
            <span v-if="user" class="text-light me-2">Chào, <strong>{{ user.username }}</strong></span>
            <button v-if="user" class="btn btn-outline-light btn-sm" @click="logout">Đăng Xuất</button>
            <router-link v-else class="btn btn-warning btn-sm" to="/login">Đăng Nhập (SQLi Test)</router-link>
          </div>
        </div>
      </div>
    </nav>

    <div class="container min-vh-100">
      <div class="alert alert-danger mb-4 shadow-sm">
        <strong>⚠️ CẢNH BÁO SECURITY TESTING:</strong> Ứng dụng này chứa các lỗ hổng bảo mật cố ý (SQL Injection, XSS, IDOR, Hardcoded Secrets, Path Traversal) dành cho mục đích nghiên cứu & kiểm thử bảo mật.
      </div>
      <router-view />
    </div>

    <footer class="bg-dark text-secondary text-center py-3 mt-5">
      <p class="mb-0">VulnShop - Testing Environment for Security Vulnerabilities</p>
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
