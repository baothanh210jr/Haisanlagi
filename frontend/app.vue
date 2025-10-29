<template>
  <div class="bg-gradient-to-br from-red-500 to-orange-500">
    <HeaderBar />
    <NuxtLayout>
      <NuxtPage :key="$route.fullPath" />
    </NuxtLayout>
    <FooterBar />
  </div>
  <Toast />
</template>
