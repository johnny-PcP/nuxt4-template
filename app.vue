<!--
  應用程式根組件

  這是 Nuxt 3 應用程式的根組件，包含了全域的佈局結構
  - NuxtRouteAnnouncer: 無障礙路由宣告
  - NuxtLayout: 佈局系統
  - NuxtLoadingIndicator: 載入進度指示器
  - NuxtPage: 頁面內容
-->
<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtLoadingIndicator
        :throttle="0"
        color="gray"
      />
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
