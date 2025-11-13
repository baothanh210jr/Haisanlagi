import type { RouterConfig } from '@nuxt/schema'

export default {
  // Use a function to override routes per Nuxt docs
  routes: (_routes) => [
    { name: 'home', path: '/', component: () => import('~/pages/index.vue') },
    {
      name: 'category-slug',
      path: '/hai-san/:slug',
      component: () => import('~/pages/category/[slug].vue'),
    },
    {
      name: 'product-slug',
      path: '/san-pham/:slug',
      component: () => import('~/pages/product/[slug].vue'),
    },
    {
      name: 'product-slug-en',
      path: '/product/:slug',
      component: () => import('~/pages/product/[slug].vue'),
    },
    { name: 'cart', path: '/gio-hang', component: () => import('~/pages/cart.vue') },
    { name: 'checkout', path: '/checkout', component: () => import('~/pages/checkout.vue') },
    { name: 'orders', path: '/orders', component: () => import('~/pages/orders.vue') },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0 }
  },
} satisfies RouterConfig
