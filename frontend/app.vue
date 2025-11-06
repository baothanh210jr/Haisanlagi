<template>
  <div class="bg-red-500">
    <HeaderBar />
    <NuxtLayout>
      <NuxtPage :key="$route.fullPath" />
    </NuxtLayout>
    <FooterBar />
  </div>
  <Toast />
</template>
