import axios from 'axios';
import type { TableData } from '@arco-design/web-vue/es/table/interface';
import { LoginRes } from './user';
import { HttpResponse } from './interceptor';

export interface ContentDataRecord {
  x: string;
  y: number;
}

export function queryContentData() {
  return axios.get<ContentDataRecord[]>('/api/content-data');
}

export interface PopularRecord {
  key: number;
  clickNumber: string;
  title: string;
  increases: number;
}

export const getSessionList = (
  pageNum: number,
  pageSize: number,
  ownerId: string,
): Promise<HttpResponse> => {
  return axios.get(`/hh/dialog/pageMeBy/${pageSize}/${pageNum}`, {
    params: { ownerId },
  });
};

export const sendMessage = (params: any) => {
  return axios.post('/hh/comfyui_api/postPrompt', params);
};

// 查询生成记录
export const getSessionHistory = (promptId: string) => {
  return axios.get(`/hh/comfyui_api/historyByPromptId/${promptId}`);
};

// 创建会话
export const createNewSession = (params: any) => {
  return axios.post('/hh/dialog/addItemBy', params);
};

// 更新会话
export const updateSession = (dialogId: number | string, params: any) => {
  return axios.post(`/hh/dialog/replaceAllItemBy/${dialogId}`, params);
};

export const getSessionCommit = (id) => {
  return axios.get(`/hh/dialog/findItemHistory/${id}`);
};

export const deleteSessionItem = (id) => {
  return axios.delete(`/hh/dialog/removeById/${id}`);
};

export const editSessionTitle = (params) => {
  return axios.put(`/hh/dialog/editById`, params);
};

export const sendMessageV2 = (params: any) => {
  return axios.post('/hh/comfyui_api_v2/doPrompt', params);
};

export const getHistoryByPromptId = (promptId: string) => {
  return axios.get(`/hh/comfyui_api_v2/historyByPromptId/${promptId}`);
};

export const uploadImageV2 = (params: any) => {
  return axios.post('/hh/comfyui_api_v2/uploadImage', params);
};

export const getWorkFlow = (type: string) => {
  return axios.get(`/hh/prompt_workflow/listByType/${type}`);
};

export const getDownloadUrl = (url: string) => {
  return axios.get('/hh/dialog_dl/listUrls', { params: { url } });
};

export const downloadImage = (url: string) => {
  return axios(url, { responseType: 'blob' }).then(console.log)
}