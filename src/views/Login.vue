<template>
  <div class="login">
    <h2>Вход</h2>
    <form @submit.prevent="loginUser">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Пароль" required />
      <button type="submit">Войти</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      email: '',
      password: '',
    };
  },
  methods: {
    async loginUser() {
      try {
        const response = await axios.post('/api/user/login', {
          email: this.email,
          password: this.password,
        });
        localStorage.setItem('token', response.data.access_token);
        console.log('Вход успешен:', response.data);
        // перенаправление на страницу задач или другую логику
      } catch (error) {
        console.error('Ошибка входа:', error);
      }
    },
  },
};
</script>

