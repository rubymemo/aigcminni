import axios from 'axios';
import type { RouteRecordNormalized } from 'vue-router';
import { UserState } from '@/store/modules/user/types';

export interface LoginData {
  username: string;
  password: string;
}

export interface LoginRes {
  data: string;
}

// 给手机发验证码
export function getSendVerifyCode(mobile:string) {
  return axios.post<LoginRes>(`/cx/sendVerifyCode/${mobile}`);
}

export function login(data: LoginData) {
  return axios.post<string>('/cx/doLoginByMobile', data);
}

export function logout() {
  return axios.delete<LoginRes>('/cx/logout');
}

export function getUserInfo() {
  return axios.get<UserState>('/cx/meByMobile');
}

export function getMenuList() {
  return axios.post<RouteRecordNormalized[]>('/api/user/menu');
}
