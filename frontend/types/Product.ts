export interface Variants {
  id: number | string
  label: string
  price: number
  original_price?: number
}
;[]
export interface ProductItem {
  id: number | string
  name: string
  slug: string
  price: number
  image?: any
  description?: string
  category?: number | string
  variants: Variants[]
}
