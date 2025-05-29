<template>
  <div class="auth-page">
    <div class="auth-tabs">
      <button @click="toggleForm('login')" :class="{ active: activeForm === 'login' }">
        ログイン
      </button>
      <button @click="toggleForm('signup')" :class="{ active: activeForm === 'signup' }">
        アカウント作成
      </button>
    </div>

    <div class="auth-form">
      <!-- ログインフォーム -->
      <Login v-if="activeForm === 'login'" />

      <!-- サインアップフォーム -->
      <Signup v-if="activeForm === 'signup'" />
    </div>
  </div>
</template>

<script>
// コンポーネントをインポート
import Login from './Login.vue';
import Signup from './Signup.vue';

export default {
  name: 'AuthPage',
  components: {
    Login,
    Signup,
  },
  data() {
    return {
      activeForm: 'login', // 初期表示はログイン画面
    };
  },
  methods: {
    toggleForm(form) {
      this.activeForm = form; // ログインかサインアップを切り替え
    },
  },
};
</script>

<style scoped>
.auth-tabs {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.auth-tabs button {
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  background-color: #f0f0f0;
  margin: 0 5px;
  border-radius: 5px;
}

.auth-tabs button.active {
  background-color: #007bff;
  color: white;
}

.auth-form {
  display: flex;
  justify-content: center;
}
</style>
