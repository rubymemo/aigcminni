<template>
     <view class="loading">
        <view></view>
        <view></view>
        <view></view>
        <view></view>
      </view>
</template>

<style lang="scss" scoped>
.loading,
.loading > view {
  position: relative;
  box-sizing: border-box;
}

.loading {
  display: block;
  font-size: 0;
  // color: #000;
  color: rgb(37, 106, 247);
}

.loading.la-dark {
  color: #333;
}

.loading > view {
  display: inline-block;
  float: none;
  background-color: currentColor;
  border: 0 solid currentColor;
}

.loading {
  width: 42px;
  height: 32px;
}

.loading > view:nth-child(1) {
  position: absolute;
  bottom: 32%;
  left: 18%;
  width: 14px;
  height: 14px;
  border-radius: 100%;
  transform-origin: center bottom;
  animation: ball-climbing-dot-jump 0.6s ease-in-out infinite;
}

.loading > view:not(:nth-child(1)) {
  position: absolute;
  top: 0;
  right: 0;
  width: 14px;
  height: 2px;
  border-radius: 0;
  transform: translate(60%, 0);
  animation: ball-climbing-dot-steps 1.8s linear infinite;
}

.loading > view:not(:nth-child(1)):nth-child(2) {
  animation-delay: 0ms;
}

.loading > view:not(:nth-child(1)):nth-child(3) {
  animation-delay: -600ms;
}

.loading > view:not(:nth-child(1)):nth-child(4) {
  animation-delay: -1200ms;
}

@keyframes ball-climbing-dot-jump {
  0% {
    transform: scale(1, 0.7);
  }

  20% {
    transform: scale(0.7, 1.2);
  }

  40% {
    transform: scale(1, 1);
  }

  50% {
    bottom: 125%;
  }

  46% {
    transform: scale(1, 1);
  }

  80% {
    transform: scale(0.7, 1.2);
  }

  90% {
    transform: scale(0.7, 1.2);
  }

  100% {
    transform: scale(1, 0.7);
  }
}

@keyframes ball-climbing-dot-steps {
  0% {
    top: 0;
    right: 0;
    opacity: 0;
  }

  50% {
    opacity: 1;
  }

  100% {
    top: 100%;
    right: 100%;
    opacity: 0;
  }
}
</style>
