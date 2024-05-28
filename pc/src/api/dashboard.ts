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
  ownerId: string
): Promise<HttpResponse> => {
  return axios.get(`/hh/dialog/pageMeBy/${pageSize}/${pageNum}`, { params: { ownerId } });
};

export const createSession = (params: any) => {
  return axios.post<LoginRes>('/hh/works/addBy', params);
};

export const uploadImage = (params: any) => {
  return axios.post(
    'http://101.126.93.249/api/hh/comfyui_api/uploadImage',
    params,
  );
};

export const sendMessage = (params: any) => {
  return axios.post('/hh/comfyui_api/postPrompt', params);
};

// 查询生成记录
export const getSessionHistory = (promptId: string) => {
  return axios.get(`/hh/comfyui_api/historyByPromptId/${promptId}`);
};

export const createNewSession = () => {

}