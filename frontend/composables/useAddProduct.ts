import type { ProductItem } from '~/types/Product'

const { addToCart } = useCart()
const { success } = useToast()

export function useAddProduct(p: ProductItem) {
  const selectedCapacity = ref(0)
  addToCart({
    id: p.id,
    name: p.name,
    price: (p?.price || 0) * (selectedCapacity.value || 0),
    image: p.image,
    capacity: selectedCapacity.value,
  })
  success(`Đã thêm ${selectedCapacity.value}kg \"${p.name}\" vào giỏ hàng`, {
    actionText: 'Xem giỏ hàng',
    actionTo: '/gio-hang',
    layout: 'drawer',
    timeout: 0,
  })
}
