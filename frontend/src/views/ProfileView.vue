<template>
  <div class="row justify-content-center">
    <div class="col-md-8">
      <div class="card p-4 shadow">
        <h3 class="card-title mb-3">Chỉnh Sửa Hồ Sơ (IDOR & Stored XSS Test)</h3>
        
        <div class="alert alert-warning">
          <strong>IDOR Vulnerability Test:</strong> Thay đổi User ID ở ô bên dưới để tải hoặc sửa hồ sơ của người dùng khác (ví dụ: chuyển ID thành 1 để sửa profile Admin).
        </div>

        <div class="mb-3 d-flex gap-2">
          <input v-model="targetUserId" type="number" class="form-control" style="width: 150px;" placeholder="User ID" />
          <button @click="loadProfile" class="btn btn-secondary">Tải Hồ Sơ Target</button>
        </div>

        <form v-if="profile" @submit.prevent="updateProfile">
          <div class="mb-3">
            <label class="form-label">Họ và Tên:</label>
            <input v-model="profile.FullName" type="text" class="form-control" />
          </div>

          <div class="mb-3">
            <label class="form-label">Email:</label>
            <input v-model="profile.Email" type="email" class="form-control" />
          </div>

          <div class="mb-3">
            <label class="form-label">Tên file Avatar:</label>
            <input v-model="profile.Avatar" type="text" class="form-control" />
          </div>

          <div class="mb-3">
            <label class="form-label">Tiểu sử (Bio - Test Stored XSS: &lt;h2&gt;Hacked&lt;/h2&gt;&lt;script&gt;alert('XSS')&lt;/script&gt;):</label>
            <textarea v-model="profile.Bio" class="form-control" rows="3"></textarea>
          </div>

          <div class="card bg-light p-3 mb-3">
            <h6>Xem trước Bio (Render unescaped v-html):</h6>
            <div v-html="profile.Bio"></div>
          </div>

          <button type="submit" class="btn btn-primary fw-bold">Cập Nhật Hồ Sơ Target (IDOR)</button>
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
      targetUserId: 2,
      profile: null
    };
  },
  mounted() {
    const user = JSON.parse(localStorage.getItem('user') || '{"id": 2}');
    this.targetUserId = user.id;
    this.loadProfile();
  },
  methods: {
    async loadProfile() {
      try {
        const res = await axios.get(`/api/users/${this.targetUserId}`);
        this.profile = res.data;
      } catch (err) {
        alert('Lỗi tải hồ sơ: ' + (err.response?.data?.error || err.message));
      }
    },
    async updateProfile() {
      try {
        await axios.put(`/api/users/${this.targetUserId}`, {
          fullName: this.profile.FullName,
          email: this.profile.Email,
          bio: this.profile.Bio,
          avatar: this.profile.Avatar
        });
        alert(`Đã cập nhật thành công hồ sơ của User ID ${this.targetUserId}!`);
        this.loadProfile();
      } catch (err) {
        alert('Lỗi cập nhật hồ sơ: ' + (err.response?.data?.error || err.message));
      }
    }
  }
};
</script>
