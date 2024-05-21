import type { Router, LocationQueryRaw } from 'vue-router';
import NProgress from 'nprogress'; // progress bar

import { useUserStore } from '@/store';
import { isLogin } from '@/utils/auth';

export default function setupUserLoginInfoGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    NProgress.start();
    const userStore = useUserStore();
    if (isLogin()) {
      next();
      // console.log(userStore)
      // if (userStore.role) {
      //   next();
      // } else {
      //   try {
      //     await userStore.info();
      //     next();
      //   } catch (error) {
      //     await userStore.logout();
      //     next({
      //       name: 'login',
      //       query: {
      //         redirect: to.name,
      //         ...to.query,
      //       } as LocationQueryRaw,
      //     });
      //   }
      // }
    } else {
      next();
      // if (to.name === 'login') {
      //   next();
      //   return;
      // }
      // next({
      //   name: 'login',
      //   query: {
      //     redirect: to.name,
      //     ...to.query,
      //   } as LocationQueryRaw,
      // });
    }
  });
}
