<template>
  <div class="container">
    <Breadcrumb :items="[{ label: 'Trang chủ', to: '/' }, { label: 'Thanh toán' }]" />
    <div
      v-if="items.length === 0"
      class="empty"
    >
      Giỏ hàng trống. Vui lòng thêm sản phẩm trước.
    </div>
    <div v-else>
      <h2>Thông tin chuyển khoản</h2>
      <div
        v-if="bank"
        class="bank"
      >
        <p><strong>Ngân hàng:</strong> {{ bank.bank_name }}</p>
        <p><strong>Số tài khoản:</strong> {{ bank.account_number }}</p>
        <p><strong>Chủ tài khoản:</strong> {{ bank.account_holder }}</p>
        <p><em>{{ bank.description }}</em></p>
      </div>

      <h2>Thông tin khách hàng</h2>
      <form
        class="form"
        @submit.prevent="submit"
      >
        <label>
          Họ và tên
          <Input
            v-model="name"
            required
          />
        </label>
        <label>
          Số điện thoại
          <Input
            v-model="phone"
            required
          />
        </label>
        <label>
          Địa chỉ
          <Input
            v-model="address"
            required
          />
        </label>
        <div class="summary">
          Tổng tiền: <strong>{{ formatPrice(totalPrice) }}</strong>
        </div>
        <Button type="submit">
          Tạo đơn hàng
        </Button>
      </form>

      <div
        v-if="orderId"
        class="success"
      >
        Đã tạo đơn hàng #{{ orderId }}. Vui lòng chuyển khoản theo thông tin trên và ghi chú mã đơn hàng.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { readItems, createItem, createItems } from '@directus/sdk'
import { useCart } from '~/composables/useCart'
import Breadcrumb from '~/components/ui/Breadcrumb.vue'
import Input from '~/components/ui/Input.vue'
import Button from '~/components/ui/Button.vue'

const { items, totalPrice, clearCart } = useCart()
const { $directus } = useNuxtApp()

type Bank = { id: number | string, bank_name: string, account_number: string, account_holder: string, description?: string }

const name = ref('')
const phone = ref('')
const address = ref('')
const orderId = ref<string | number | null>(null)

const { data: bank } = await useAsyncData('bank', async () => {
  try {
    // Lấy tài khoản ngân hàng đầu tiên cấu hình trong Directus
    // @ts-ignore
    const res = await $directus.request(readItems('bank_accounts', { limit: 1 }))
    return res[0] as Bank
  } catch {
    return null
  }
}, { staleTime: 300_000 })

async function submit() {
  if (!name.value || !phone.value || !address.value) return
  if (items.value.length === 0) return
  try {
    // Tạo order
    // @ts-ignore
    const orderResp = await $directus.request(createItem('orders', {
      customer_name: name.value,
      customer_phone: phone.value,
      customer_address: address.value,
      total_amount: totalPrice.value,
      status: 'pending'
    }, { fields: ['id'] }))
    let createdOrderId = orderResp?.id
    console.log('orderResp:', orderResp)

    // Fallback nếu API trả 204 (không có body)
    if (!createdOrderId) {
      // @ts-ignore
      const latest = await $directus.request(readItems('orders', {
        filter: { customer_phone: { _eq: phone.value }, status: { _eq: 'pending' } },
        sort: ['-id'],
        limit: 1,
        fields: ['id']
      }))
      createdOrderId = latest?.[0]?.id
    }
    if (!createdOrderId) throw new Error('Không thể lấy mã đơn hàng vừa tạo')
    orderId.value = createdOrderId

    // Tạo order_items
    // @ts-ignore
    await $directus.request(createItems('order_items', items.value.map(i => ({
      order: createdOrderId,
      product: i.id,
      quantity: i.quantity,
      unit_price: i.price,
      subtotal: i.quantity * i.price
    }))))

    clearCart()
  } catch (e) {
    console.error(e)
    alert('Tạo đơn hàng thất bại. Vui lòng thử lại!')
  }
}

function formatPrice(n: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n)
}
</script>

<style scoped>
/* Dùng Tailwind container, bỏ CSS container cứng */
.topbar { display: flex; justify-content: flex-start; margin-bottom: 10px; }
.backlink { display: inline-flex; align-items: center; gap: 6px; padding: 8px 12px; border: 1px solid #e5e7eb; border-radius: 8px; text-decoration: none; color: #374151; background: #fff; transition: all .15s ease; }
.backlink:hover { background: #f9fafb; transform: translateY(-1px); box-shadow: 0 6px 12px rgba(0,0,0,0.06); }
.empty { padding: 16px; background: #f5f5f5; border-radius: 8px; }
.bank { padding: 16px; border: 1px solid #eee; border-radius: 8px; margin-bottom: 16px; }
.form { display: grid; gap: 12px; }
label { display: grid; gap: 6px; }
.summary { text-align: right; }
.success { margin-top: 12px; padding: 12px; background: #e9fce9; border: 1px solid #b6e2b6; border-radius: 8px; }
</style>