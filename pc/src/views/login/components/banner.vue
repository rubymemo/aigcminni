<template>
  <div class="banner">
    <img class="carousel-image" :src="bannerImage" />
  </div>
</template>

<script lang="ts" setup>
  import bannerImage from '@/assets/images/login-banner.png';
</script>

<style lang="less" scoped>
  .banner {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
   
    border-radius: 12px;

    .carousel-image {
      width: 100%;
      height: 100%;
    }
  }
  @media (min-width: @screen-md) and (max-width: @screen-lg) {
    .banner {
      width: auto;
      height: calc(100vh - 350px);
      // width: 800px;
    }
  }
  @media (min-width: @screen-lg) and (max-width: @screen-xl) {
    .banner {
      width: auto;
      height: calc(100vh - 200px);
      // width: 800px;
    }
  }
  @media (min-width: @screen-xl) {
    .banner {
      width: auto;
      height: calc(100vh - 126px);
      // width: 800px;
    }
  }

</style>
<!-- <style lang="less" scoped>
 
  // responsive

</style> -->
