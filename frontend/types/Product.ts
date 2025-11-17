export interface ProductItem {
  id: number | string
  name: string
  slug: string
  price: number
  image?: any
  description?: string
  category?: number | string
  capacity_options?: number[]
}
