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
): Promise<HttpResponse> => {
  return axios.get<LoginRes>(`/hh/works/pageBy/${pageSize}/${pageNum}`);
};

export const createSession = (params: any) => {
  return axios.post<LoginRes>('/hh/works/addBy', params);
};
