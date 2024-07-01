import { AppRouteRecordRaw } from '../types';

const InfoLayout = () => import('@/layout/info-layout.vue');

const Info: AppRouteRecordRaw = {
  path: '/info',
  name: 'info',
  component: InfoLayout,
  children: [
    {
      path: 'user-setting',
      name: 'userSetting',
      component: () => import('@/views/info/user-setting/index.vue'),
      meta: {
        title: '用户设置',
        roles: ['*'],
      },
    },
    {
      path: 'user-message',
      name: 'userMessage',
      component: () => import('@/views/info/user-message/index.vue'),
      meta: {
        title: '消息中心',
        roles: ['*'],
      },
    },
    {
      path: 'history-creation',
      name: 'historyCreation',
      component: () => import('@/views/info/history-creation/index.vue'),
      meta: {
        title: '历史创作',
        roles: ['*'],
      },
    },
    {
      path: 'history-download',
      name: 'historyDownload',
      component: () => import('@/views/info/history-download/index.vue'),
      meta: {
        title: '历史下载',
        roles: ['*'],
      },
    },
  ], 
};

export default Info;
