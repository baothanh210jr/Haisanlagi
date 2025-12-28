import { computed, watch } from 'vue';

// Use Nuxt useState to share cart across all components instantly
// and keep reactivity without page reloads.

export type CartItem = {
  id: string | number;
  name: string;
  price: number;
  image?: string;
  image_default?: string;
  quantity: number;
  capacity?: string; // kg selected per item
};

const STORAGE_KEY = 'haisanlagi_cart';

export function useCart() {
  const items = useState<CartItem[]>('cart_items', () => []);

  // load from localStorage once on client if not yet populated
  if (process.client && items.value.length === 0) {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        items.value = JSON.parse(raw);
      } catch (e) {
        items.value = [];
      }
    }
  }

  // persist to localStorage on any change
  if (process.client) {
    watch(
      items,
      (val) => {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(val));
        } catch {}
      },
      { deep: true }
    );
  }

  const totalItems = computed(() => items.value.reduce((sum, i) => sum + i.quantity, 0));
  const totalPrice = computed(() => items.value.reduce((sum, i) => sum + i.quantity * i.price, 0));

  function addToCart(item: Omit<CartItem, 'quantity'>, quantity = 1) {
    const existing = items.value.find(
      (i) => String(i.id) === String(item.id) && i.capacity === item.capacity
    );
    if (existing) {
      existing.quantity += quantity;
    } else {
      items.value.push({ ...item, quantity });
    }
  }

  function removeFromCart(id: CartItem['id'], capacity?: string) {
    const targetId = String(id);
    items.value = items.value.filter(
      (i) => !(String(i.id) === targetId && (capacity === undefined || i.capacity === capacity))
    );
  }

  function updateQuantity(id: CartItem['id'], quantity: number, capacity?: string) {
    const q = Number.isFinite(quantity) && quantity > 0 ? Math.floor(quantity) : 1;
    const targetId = String(id);
    const item = items.value.find(
      (i) => String(i.id) === targetId && (capacity === undefined || i.capacity === capacity)
    );
    if (item) item.quantity = q;
  }

  function clearCart() {
    items.value = [];
  }
  return { items, totalItems, totalPrice, addToCart, updateQuantity, removeFromCart, clearCart };
}
