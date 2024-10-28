<template>
  <div>
    <h2 v-if="isLogin">Вход</h2>
    <h2 v-else>Регистрация</h2>

    <form @submit.prevent="handleSubmit">
      <div v-if="!isLogin">
        <label>Имя:</label>
        <input type="text" v-model="formData.name" required />
      </div>
      
      <label>Email:</label>
      <input type="email" v-model="formData.email" required />

      <label>Пароль:</label>
      <input type="password" v-model="formData.password" required />

      <button type="submit">{{ isLogin ? 'Войти' : 'Зарегистрироваться' }}</button>
    </form>

    <p @click="toggleAuthMode">
      {{ isLogin ? 'Нет аккаунта? Зарегистрируйтесь' : 'Уже есть аккаунт? Войдите' }}
    </p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      isLogin: true,  // Режим по умолчанию: авторизация
      formData: {
        name: '',
        email: '',
        password: ''
      }
    };
  },
  methods: {
    // Переключение между регистрацией и входом
    toggleAuthMode() {
      this.isLogin = !this.isLogin;
      this.clearFormData();
    },
    // Очистка формы после смены режима
    clearFormData() {
      this.formData = { name: '', email: '', password: '' };
    },
    // Обработка отправки формы
    async handleSubmit() {
      try {
        if (this.isLogin) {
          await this.loginUser();
        } else {
          await this.registerUser();
        }
      } catch (error) {
        console.error("Ошибка:", error.response.data.message || "Произошла ошибка");
      }
    },
    // Метод регистрации
    async registerUser() {
      const response = await axios.post('/user/registration', {
        name: this.formData.name,
        email: this.formData.email,
        password: this.formData.password
      });
      if (response.status === 201) {
        alert(response.data.message);
        this.toggleAuthMode();  // Переход на форму авторизации
      }
    },
    // Метод входа
    async loginUser() {
      const response = await axios.post('/user/login', {
        email: this.formData.email,
        password: this.formData.password
      });
      if (response.status === 200) {
        const token = response.data.token;
        localStorage.setItem('authToken', token); // Сохранение токена в localStorage
        alert("Успешный вход");
        this.$router.push('/tasks');  // Перенаправление на страницу с задачами
      }
    }
  }
};
</script>

<style scoped>

</style>

