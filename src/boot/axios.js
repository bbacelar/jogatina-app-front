import Vue from 'vue';
import axios from 'axios';
import { Notify } from 'quasar';
import { getInstance } from '../auth';

const axiosInstance = axios.create({
  baseURL: process.env.API_URL
});

export default ({ store, router }) => {
  axiosInstance.interceptors.request.use(async (config) => {
    const authService = getInstance();
    const token = await authService.getTokenSilently();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }, (error) => {
    return Promise.reject(error);
  });

  axiosInstance.interceptors.response.use(
    response => response,
    error => {
      const { status } = error.response;
      switch (status) {
        case 400:
          Notify.create({
            type: 'warning',
            message: error.response.data.message || 'Bad request'
          });
          break;
        case 404:
          Notify.create({
            type: 'negative',
            message: error.response.data || 'Not found'
          });
          break;
        case 500:
          Notify.create({
            type: 'negative',
            message: 'Internal error'
          });
          break;
        default:
          Notify.create({
            type: 'negative',
            message: 'Unknown error'
          });
          break;
      }
      return Promise.reject(error);
    }
  );
};

Vue.prototype.$axios = axiosInstance;
export { axiosInstance };
