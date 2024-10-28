<template>
  <div>
    <h2>Детали задачи {{ id }}</h2>
    <div v-if="task">
      <p><strong>Название задачи: </strong>
        <span v-if="!isEditing">{{ task.title }}</span>
        <input v-else v-model="editedTask.title" />
      </p>
      <p><strong>Описание: </strong>
        <span v-if="!isEditing">{{ task.description }}</span>
        <textarea v-else v-model="editedTask.description"></textarea>
      </p>
      <p><strong>Ответственный (ID): </strong>
        <span v-if="!isEditing">{{ task.responsible_user_id }}</span>
        <input v-else v-model="editedTask.responsible_user_id" type="number" />
      </p>

      <p><strong>Постановщик (ID): </strong> {{ task.creator_user_id }}</p>
      <p><strong>Дата постановки: </strong> {{ formatDate(task.created_at) }}</p>

      <p><strong>Дата завершения: </strong>
        <span v-if="!isEditing">{{ task.complete_at ? formatDate(task.complete_at) : 'Не завершена' }}</span>
        <input v-else type="date" v-model="editedTask.complete_at" />
      </p>
    </div>
    <p v-else>Загрузка...</p>

    <button @click="backToTasks">Назад к списку задач</button>
    <button v-if="!isEditing && !editModeEnabled" @click="checkEditPermissions">Изменить</button>
    <div v-if="isEditing">
      <button @click="saveChanges">Сохранить изменения</button>
      <button @click="cancelEdit">Отмена</button>
    </div>
    <p v-if="!editModeEnabled && isEditing">У вас нет прав на редактирование этой задачи.</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: ['id'],
  data() {
    return {
      task: null,
      isEditing: false,
      editModeEnabled: false,
      editedTask: {
        responsible_user_id: "",
        title: "",
        description: "",
        complete_at: ""
      },
    };
  },
  async created() {
    await this.fetchTaskDetails();
  },
  methods: {
    async fetchTaskDetails() {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get(`/tasks/${this.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        this.task = response.data;
        // Инициализируем отредактированные данные
        this.editedTask = { ...this.task };
      } catch (error) {
        console.error("Ошибка при получении задачи:", error.response?.data?.message || "Произошла ошибка");
      }
    },
    async checkEditPermissions() {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.patch(`/tasks/${this.id}`, {}, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 200) {
          this.editModeEnabled = true;
          this.isEditing = true;
        }
      } catch (error) {
        if (error.response?.status === 403) {
          alert("У вас нет прав на редактирование этой задачи.");
        } else {
          console.error("Ошибка проверки прав на редактирование:", error.response?.data?.message || "Произошла ошибка");
        }
      }
    },
    async saveChanges() {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.patch(`/tasks/${this.id}`, {
          responsible_user_id: this.editedTask.responsible_user_id,
          title: this.editedTask.title,
          description: this.editedTask.description,
          complete_at: this.editedTask.complete_at,
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 200) {
          this.task = { ...this.editedTask };
          this.isEditing = false;
          alert("Задача успешно обновлена");
        }
      } catch (error) {
        console.error("Ошибка при сохранении задачи:", error.response?.data?.message || "Произошла ошибка");
      }
    },
    cancelEdit() {
      this.isEditing = false;
      this.editedTask = { ...this.task };
    },
    formatDate(date) {
      return new Date(date).toLocaleString();
    },
    backToTasks() {
      this.$router.push({ name: 'Tasks' });
    },
  },
};
</script>

<style scoped>
button {
  padding: 5px 10px;
  margin-top: 15px;
  margin-right: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>
