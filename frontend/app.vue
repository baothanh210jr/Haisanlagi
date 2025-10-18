<template>
  <HeaderBar />
  <NuxtLayout>
    <NuxtPage :key="$route.fullPath" />
  </NuxtLayout>
  <FooterBar />
  <Toast />
</template>
