import { getActiveStorage, StorageKeys } from '@kinde/expo/utils';
import axios from 'axios';
import Constants from 'expo-constants';
import { router } from 'expo-router';

const { PUBLIC_API_URL } = Constants.expoConfig?.extra ?? {};

const API = axios.create({
  baseURL: `${PUBLIC_API_URL}`,
  timeout: 10000,
});

API.interceptors.request.use(
  async (config) => {
    const storage = getActiveStorage();
    const token = await storage?.getSessionItem(StorageKeys.accessToken);

    if (!token) {
      return Promise.reject(new Error('No access token available'));
    }
    config.headers.Authorization = `Bearer ${token}`;

    console.log('🚀 Request:', {
      method: config.method?.toUpperCase(),
      baseURL: config.baseURL,
      url: config.url,
      fullURL: `${config.baseURL}${config.url}`,
      data: config.data,
      headers: config.headers,
    });
    return config;
  },
  (error) => {
    console.error('❌ Request Interceptor Error:', error);
    console.log('Error', JSON.stringify(error.data, null, 2));
    return Promise.reject(error);
  },
);

// Response interceptor
API.interceptors.response.use(
  (response) => {
    console.log('✅ Response:', {
      status: response.status,
      data: response.data,
      headers: response.headers,
    });
    return response;
  },
  async (error) => {
    const errorStatus = error.response?.status;

    console.error('❌ Response Error:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      config: {
        method: error.config?.method,
        url: error.config?.url,
        baseURL: error.config?.baseURL,
        data: error.config?.data,
      },
    });

    if (errorStatus === 401 || errorStatus === 403) {
      console.warn('Unauthorized access. You may need to log in again.');

      try {
        const storage = getActiveStorage();
        await storage?.destroySession();
        router.replace('/(root)');
      } catch (storageError) {
        console.error('Error removing token:', storageError);
      }
    }
    return Promise.reject(error);
  },
);

export default API;
