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
  ],
};

export default Info;
