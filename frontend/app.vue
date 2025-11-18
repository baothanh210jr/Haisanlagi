<template>
  <div class="">
    <HeaderBar />
    <NuxtLayout>
      <NuxtPage :key="$route.fullPath" />
    </NuxtLayout>
    <FooterBar />
  </div>
  <Toast />
</template>
