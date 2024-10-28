<template>
  <div class="register">
    <h2>Регистрация</h2>
    <form @submit.prevent="registerUser">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Пароль" required />
      <button type="submit">Зарегистрироваться</button>
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
    async registerUser() {
      try {
        const response = await axios.post('/api/user/registration', {
          email: this.email,
          password: this.password,
        });
        console.log('Регистрация успешна:', response.data);
        // перенаправление на страницу входа или другую логику
      } catch (error) {
        console.error('Ошибка регистрации:', error);
      }
    },
  },
};
</script>

