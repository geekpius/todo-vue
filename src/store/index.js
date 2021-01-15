import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

const baseUrl = "http://127.0.0.1:8000";

export default new Vuex.Store({
  state: {
    tasks: []
  },
  getters: {
    getTaskList: state => {
      return state.tasks;
    }
  },
  mutations: {
    SET_TASK_LIST: (state, payload) => {
      state.tasks.push(...payload);
    },
    SET_TASK: (state, payload) => {
      state.tasks.push(payload);
    },
    DELETE_TASK: (state, payload) => {
      let index = state.tasks.findIndex(task => task.id == payload);
      state.tasks.splice(index, 1);
    }
  },
  actions: {
    saveTask: async ({ commit }, payload) => {
      try {
        axios.defaults.headers.post['Content-Type'] = 'application-json';
        let response = await axios.post(`${baseUrl}/api/tasks`, payload);
        commit("SET_TASK", response.data.data);
        return response;
      } catch (error) {
        if (error.response.status === 400) {
          return { error: "Form validations did not pass." };
        } else {
          return { error: "Something went wrong." };
        }
      }
    },
    fetchAllTasks: async ({ commit }) => {
      try {
        let response = await axios.get(`${baseUrl}/api/tasks`);
        commit("SET_TASK_LIST", response.data.data);
      } catch (error) {
        console.log(error);
      }
    },
    fetchTask: async ({ commit }, id) => {
      try {
        let response = await axios.get(`${baseUrl}/api/tasks/${id}`);
        commit("SET_TASK", response.data.data);
        return response;
      } catch (error) {
        if (error.response.status === 404) {
          return { error: "No record found." };
        } else {
          return { error: "Something went wrong." };
        }
      }
    },
    updateTask: async (_, payload) => {
      try {
        let response = await axios.put(`${baseUrl}/api/tasks/${payload.id}`, {task:payload.task});
        return response;
      } catch (error) {
        if (error.response.status === 404) {
          return { error: "No record found." };
        } else {
          return { error: "Something went wrong." };
        }
      }
    },
    deleteTask: async ({ commit }, id) => {
      try {
        let response = await axios.delete(`${baseUrl}/api/tasks/${id}`);
        commit("DELETE_TASK", id);
        return response;
      } catch (error) {
        if (error.response.status === 404) {
          return { error: "No record found." };
        } else {
          return { error: "Something went wrong." };
        }
      }
    }
  },
  modules: {}
});
