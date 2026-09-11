<template>
  <div class="row justify-content-center">
    <div class="col-md-8">
      <div class="card border-0 shadow-sm p-4">
        <h3 class="fw-bold mb-4">Thông tin cá nhân & Hồ sơ</h3>

        <form v-if="profile" @submit.prevent="updateProfile">
          <div class="row mb-3">
            <div class="col-md-6">
              <label class="form-label fw-semibold">Họ và Tên:</label>
              <input v-model="profile.FullName" type="text" class="form-control" />
            </div>
            <div class="col-md-6">
              <label class="form-label fw-semibold">Email liên hệ:</label>
              <input v-model="profile.Email" type="email" class="form-control" />
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label fw-semibold">Tên tài khoản (Username):</label>
            <input v-model="profile.Username" type="text" class="form-control bg-light" readonly />
          </div>

          <div class="mb-3">
            <label class="form-label fw-semibold">Ảnh đại diện (Avatar File):</label>
            <input v-model="profile.Avatar" type="text" class="form-control" placeholder="avatar1.jpg" />
          </div>

          <div class="mb-3">
            <label class="form-label fw-semibold">Tiểu sử & Giới thiệu bản thân:</label>
            <textarea v-model="profile.Bio" class="form-control" rows="3" placeholder="Mô tả ngắn về bạn..."></textarea>
          </div>

          <!-- Preview Bio (Stored XSS rendering preserved via v-html) -->
          <div class="card bg-light border-0 p-3 mb-4">
            <h6 class="fw-semibold text-secondary mb-2">Xem trước hiển thị Bio:</h6>
            <div v-html="profile.Bio" class="text-dark"></div>
          </div>

          <button type="submit" class="btn btn-primary px-4 fw-bold">Lưu thay đổi</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ProfileView',
  data() {
    return {
      userId: 2,
      profile: null
    };
  },
  mounted() {
    const user = JSON.parse(localStorage.getItem('user') || '{"id": 2}');
    this.userId = user.id;
    this.loadProfile();
  },
  methods: {
    async loadProfile() {
      try {
        const res = await axios.get(`/api/users/${this.userId}`);
        this.profile = res.data;
      } catch (err) {
        alert('Không thể tải thông tin hồ sơ: ' + (err.response?.data?.error || err.message));
      }
    },
    async updateProfile() {
      try {
        await axios.put(`/api/users/${this.userId}`, {
          fullName: this.profile.FullName,
          email: this.profile.Email,
          bio: this.profile.Bio,
          avatar: this.profile.Avatar
        });
        alert('Cập nhật thông tin hồ sơ thành công!');
        this.loadProfile();
      } catch (err) {
        alert('Lỗi cập nhật hồ sơ: ' + (err.response?.data?.error || err.message));
      }
    }
  }
};
</script>
