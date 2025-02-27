import axios from 'axios';
import { MiGPTConfig, ServerStatus, ApiResponse } from 'shared';

const API_BASE_URL = 'http://localhost:3001/api';

export const api = {
  // 获取服务状态
  getStatus: async (): Promise<ApiResponse<ServerStatus>> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/status`);
      return response.data;
    } catch (error) {
      console.error('获取状态失败:', error);
      return { success: false, message: '获取状态失败' };
    }
  },

  // 启动服务
  startService: async (config: MiGPTConfig): Promise<ApiResponse<ServerStatus>> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/start`, config);
      return response.data;
    } catch (error) {
      console.error('启动服务失败:', error);
      return { success: false, message: '启动服务失败' };
    }
  },

  // 停止服务
  stopService: async (): Promise<ApiResponse<ServerStatus>> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/stop`);
      return response.data;
    } catch (error) {
      console.error('停止服务失败:', error);
      return { success: false, message: '停止服务失败' };
    }
  },

  // 更新配置
  updateConfig: async (config: MiGPTConfig): Promise<ApiResponse<MiGPTConfig>> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/updateConfig`, config);
      return response.data;
    } catch (error) {
      console.error('更新配置失败:', error);
      return { success: false, message: '更新配置失败' };
    }
  },
  
  // 获取当前配置
  getConfig: async (): Promise<ApiResponse<MiGPTConfig>> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/config`);
      return response.data;
    } catch (error) {
      console.error('获取配置失败:', error);
      return { success: false, message: '获取配置失败' };
    }
  },

  // 获取配置历史记录
  getConfigHistory: async (): Promise<ApiResponse<{id: string; date: string; config: MiGPTConfig}[]>> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/configHistory`);
      return response.data;
    } catch (error) {
      console.error('获取配置历史失败:', error);
      return { success: false, message: '获取配置历史失败' };
    }
  },

  // 获取特定历史配置
  getHistoryConfig: async (id: string): Promise<ApiResponse<MiGPTConfig>> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/configHistory/${id}`);
      return response.data;
    } catch (error) {
      console.error('获取历史配置失败:', error);
      return { success: false, message: '获取历史配置失败' };
    }
  },

  // 应用历史配置
  applyHistoryConfig: async (id: string): Promise<ApiResponse<MiGPTConfig>> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/configHistory/${id}/apply`);
      return response.data;
    } catch (error) {
      console.error('应用历史配置失败:', error);
      return { success: false, message: '应用历史配置失败' };
    }
  }
};