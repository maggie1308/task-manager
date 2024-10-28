<template>
  <div>
    <h2>Список задач</h2>
    <button @click="logout" class="logout-button">Выйти</button>

    <div class="filters">
      <input v-model="filters.title" placeholder="Фильтр по названию задачи" @input="applyFilters" />
      <input v-model="filters.responsible_user_id" placeholder="Ответственный ID" @input="applyFilters" />
      <input v-model="filters.creator_user_id" placeholder="Постановщик ID" @input="applyFilters" />
      <input type="date" v-model="filters.created_at" placeholder="Дата постановки" @input="applyFilters" />
      <input type="date" v-model="filters.complete_at" placeholder="Дата окончания" @input="applyFilters" />
    </div>

    <table v-if="filteredTasks.length">
      <thead>
        <tr>
          <th>Название задачи</th>
          <th>Ответственный (ID)</th>
          <th>Постановщик (ID)</th>
          <th>Дата постановки</th>
          <th>Дата окончания</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="task in paginatedTasks" :key="task.id" @click="viewTaskDetails(task)">
          <td>{{ task.title }}</td>
          <td>{{ task.responsible_user_id }}</td>
          <td>{{ task.creator_user_id }}</td>
          <td>{{ formatDate(task.created_at) }}</td>
          <td>{{ task.complete_at ? formatDate(task.complete_at) : 'Не завершена' }}</td>
        </tr>
      </tbody>
    </table>

    <p v-else>Нет доступных задач.</p>

    <div v-if="filteredTasks.length > tasksPerPage" class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1">Назад</button>
      <span>Страница {{ currentPage }} из {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">Вперед</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      tasks: [],
      currentPage: 1,
      tasksPerPage: 10,
      filters: {
        title: "",
        responsible_user_id: "",
        creator_user_id: "",
        created_at: "",
        complete_at: "",
      },
    };
  },
  async created() {
    await this.fetchTasks();
  },
  computed: {
    filteredTasks() {
      return this.tasks.filter(task => {
        return (
          (this.filters.title ? task.title.includes(this.filters.title) : true) &&
          (this.filters.responsible_user_id
            ? task.responsible_user_id == this.filters.responsible_user_id
            : true) &&
          (this.filters.creator_user_id
            ? task.creator_user_id == this.filters.creator_user_id
            : true) &&
          (this.filters.created_at
            ? new Date(task.created_at).toLocaleDateString() ===
              new Date(this.filters.created_at).toLocaleDateString()
            : true) &&
          (this.filters.complete_at
            ? task.complete_at &&
              new Date(task.complete_at).toLocaleDateString() ===
                new Date(this.filters.complete_at).toLocaleDateString()
            : true)
        );
      });
    },
    paginatedTasks() {
      const start = (this.currentPage - 1) * this.tasksPerPage;
      return this.filteredTasks.slice(start, start + this.tasksPerPage);
    },
    totalPages() {
      return Math.ceil(this.filteredTasks.length / this.tasksPerPage);
    },
  },
  methods: {
    async fetchTasks() {
      try {
        const token = localStorage.getItem('authToken');

        if (!token) {
          alert('Пожалуйста, авторизуйтесь.');
          this.$router.push('/auth');
          return;
        }

        const response = await axios.get('/tasks', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        this.tasks = response.data;
      } catch (error) {
        console.error("Ошибка при получении задач:", error.response?.data?.message || "Произошла ошибка");
        if (error.response?.status === 401) {
          alert("Сессия истекла. Пожалуйста, войдите снова.");
          this.$router.push('/auth');
        }
      }
    },
    formatDate(date) {
      return new Date(date).toLocaleString();
    },
    applyFilters() {
      this.currentPage = 1;
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    logout() {
      localStorage.removeItem('authToken');
      this.$router.push('/auth');
    },
    viewTaskDetails(task) {
      this.$router.push({ name: 'TaskDetails', params: { id: task.id } });
    },
  },
};
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 8px;
  text-align: left;
  border: 1px solid #ddd;
}

th {
  background-color: #f4f4f4;
  font-weight: bold;
}

.pagination {
  margin-top: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}

button {
  padding: 5px 10px;
  margin: 0 5px;
}

.logout-button {
  margin-bottom: 15px;
  padding: 5px 10px;
  color: white;
  background-color: #d9534f;
  border: none;
  cursor: pointer;
}

.logout-button:hover {
  background-color: #c9302c;
}

.filters {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

input[type="text"], input[type="date"] {
  padding: 5px;
}
</style>
