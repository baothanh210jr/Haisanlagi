<template>
  <div class="container">
    <Breadcrumb :items="[{ label: 'Trang chủ', to: '/' }, { label: 'Đơn hàng của tôi' }]" />
    <h1>Đơn hàng của tôi</h1>

    <form
      class="lookup"
      @submit.prevent="lookup"
    >
      <div className="grid w-full max-w-sm items-center gap-3">
        <Label html-for="phone">Số điện thoại</Label>
        <Input
          id="phone"
          v-model="phone"
          placeholder="Nhập SĐT đặt hàng"
          required
          class="text-xs "
        />
      </div>
      <Button type="submit">
        Tra cứu
      </Button>
    </form>

    <div
      v-if="orders.length"
      class="orders"
    >
      <h2>Danh sách đơn hàng</h2>
      <ul>
        <li
          v-for="o in orders"
          :key="o.id"
          :class="['order', selected?.id === o.id ? 'active' : '']"
          @click="select(o)"
        >
          <div>
            <strong>#{{ o.id }}</strong>
            <span
              class="badge"
              :class="o.status"
            >{{ o.status }}</span>
          </div>
          <div class="muted">
            {{ o.customer_name }} • {{ o.customer_address }}
          </div>
        </li>
      </ul>
    </div>

    <div
      v-if="selected"
      class="items"
    >
      <h2>Sản phẩm trong đơn #{{ selected.id }}</h2>
      <div
        v-if="orderItems.length === 0"
        class="empty"
      >
        Chưa có sản phẩm nào.
      </div>
      <div
        v-else
        class="table"
      >
        <div
          v-for="i in orderItems"
          :key="i.id"
          class="row"
        >
          <img
            v-if="imageSrc(i.product, 80, 80)"
            :src="imageSrc(i.product, 80, 80)"
            :alt="i.product?.name || 'Sản phẩm'"
          >
          <div class="info">
            <strong>{{ i.product?.name || 'Sản phẩm' }}</strong>
            <div>Giá: {{ formatPrice(i.unit_price) }}</div>
            <div>Số lượng: {{ i.quantity }}</div>
            <div>Tạm tính: {{ formatPrice(i.subtotal) }}</div>
          </div>
          <Button
            variant="destructive"
            size="sm"
            @click="removeItem(i.id)"
          >
            Xóa
          </Button>
        </div>
        <div class="summary">
          Tổng tiền (tính theo items): <strong>{{ formatPrice(itemsTotal) }}</strong>
        </div>
      </div>

      <div class="add">
        <h3>Thêm sản phẩm vào đơn</h3>
        <form
          class="add-form"
          @submit.prevent="addProduct"
        >
          <label class="field">
            <span>Chọn sản phẩm</span>
            <select
              v-model="selectedProductId"
              required
            >
              <option
                v-for="p in allProducts"
                :key="p.id"
                :value="p.id"
              >{{ p.name }} ({{ formatPrice(p.price) }})</option>
            </select>
          </label>
          <label class="field">
            <span>Số lượng</span>
            <Input
              v-model.number="qty"
              type="number"
              min="1"
              required
            />
          </label>
          <Button type="submit">
            Thêm vào đơn
          </Button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { readItems, createItems } from '@directus/sdk'
import Button from '~/components/ui/Button.vue'
import Breadcrumb from '~/components/ui/Breadcrumb.vue'
import Input from '~/components/ui/Input.vue'
const runtime = useRuntimeConfig()

const { $directus } = useNuxtApp()
const phone = ref('')
const orders = ref<any[]>([])
const selected = ref<any | null>(null)
const orderItems = ref<any[]>([])



async function lookup() {
  orders.value = []
  selected.value = null
  orderItems.value = []
  try {
    // @ts-ignore
    orders.value = await $directus.request(readItems('orders', {
      filter: { customer_phone: { _eq: phone.value } },
      sort: ['-id'],
      fields: ['id', 'customer_name', 'customer_address', 'status', 'total_amount']
    }))
  } catch {}
}

async function select(o: any) {
  selected.value = o
  orderItems.value = []
  try {
    // @ts-ignore
    orderItems.value = await $directus.request(readItems('order_items', {
      filter: { order: { _eq: o.id } },
      fields: ['id', 'quantity', 'unit_price', 'subtotal', 'product.id', 'product.name', 'product.image', 'product.image_default']
    }))
  } catch {}
}

async function removeItem(id: number | string) {
  if (!selected.value) return
  try {
    await fetch(`${useRuntimeConfig().public.directusUrl}/items/order_items/${id}`, { method: 'DELETE' })
    orderItems.value = orderItems.value.filter(i => i.id !== id)
  } catch (e) {
    console.error(e)
    alert('Xóa sản phẩm thất bại!')
  }
}

async function addProduct() {
  if (!selected.value || !selectedProductId.value || qty.value < 1) return
  try {
    const product = allProducts.value.find(p => p.id === selectedProductId.value)
    if (!product) return
    // @ts-ignore
    const created = await $directus.request(createItems('order_items', [{
      order: selected.value.id,
      product: product.id,
      quantity: qty.value,
      unit_price: product.price,
      subtotal: product.price * qty.value
    }]))
    // optimistic update
    orderItems.value.push({ id: (Array.isArray(created) ? created[0]?.id : created?.id) || Math.random(), quantity: qty.value, unit_price: product.price, subtotal: product.price * qty.value, product: { id: product.id, name: product.name, image: product.image, image_default: product.image_default } })
    qty.value = 1
    selectedProductId.value = null
  } catch (e) {
    console.error(e)
    alert('Thêm sản phẩm thất bại!')
  }
}

function formatPrice(n: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n)
}

const itemsTotal = computed(() => orderItems.value.reduce((s, i) => s + (i.subtotal || 0), 0))

function imageSrc(p: { image?: any, image_default?: any } | null, width = 80, height = 80) {
  if (!p) return ''
  const toId = (val: any) => typeof val === 'string' ? val : (val && typeof val === 'object' ? val.id : null)
  const imageId = toId(p.image)
  if (imageId) return `${runtime.public.directusUrl}/assets/${imageId}?fit=cover&width=${width}&height=${height}&quality=80`
  const defId = toId(p.image_default)
  if (defId) return `${runtime.public.directusUrl}/assets/${defId}?fit=cover&width=${width}&height=${height}&quality=80`
  return ''
}
</script>

<style scoped>
/* Dùng Tailwind container, bỏ CSS container cứng */
.topbar { display: flex; justify-content: flex-start; margin-bottom: 10px; }
.backlink { display: inline-flex; align-items: center; gap: 6px; padding: 8px 12px; border: 1px solid #e5e7eb; border-radius: 8px; text-decoration: none; color: #374151; background: #fff; transition: all .15s ease; }
.backlink:hover { background: #f9fafb; transform: translateY(-1px); box-shadow: 0 6px 12px rgba(0,0,0,0.06); }
.lookup { display: flex; gap: 10px; align-items: end; margin: 16px 0; }
.field { display: grid; gap: 6px; }
.field input, .field select { padding: 8px; border: 1px solid #ddd; border-radius: 6px; }
.orders ul { list-style: none; padding: 0; margin: 0; display: grid; gap: 8px; }
.order { border: 1px solid #eee; border-radius: 8px; padding: 10px; cursor: pointer; }
.order.active { border-color: #f59e0b; box-shadow: 0 8px 16px rgba(245,158,11,0.2); }
.badge { margin-left: 8px; padding: 2px 6px; border-radius: 6px; font-size: 12px; text-transform: uppercase; }
.badge.pending { background: #fde68a; color: #7c2d12; }
.badge.paid { background: #dcfce7; color: #14532d; }
.items .table { margin-top: 10px; }
.row { display: grid; grid-template-columns: 80px 1fr 120px; align-items: center; gap: 12px; padding: 10px 0; border-bottom: 1px solid #eee; }
.row img { width: 80px; height: 80px; object-fit: cover; border-radius: 8px; }
.info { color: #374151; }
.summary { text-align: right; padding: 12px 0; }
.add { margin-top: 16px; }
.add-form { display: grid; grid-template-columns: 1fr 140px 120px; gap: 10px; align-items: end; }
</style>