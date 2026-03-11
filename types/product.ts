export interface Product {
  id:               string
  name:             string
  slug:             string
  sku:              string
  description:      string
  collections:      string[]
  priceINR:         number
  priceUSD:         number
  originalPriceINR: number
  originalPriceUSD: number
  discountValue:    number
  ribbon:           string
  images:           string[]
  specs:            { title: string; value: string }[]
  options:          { name: string; type: string; choices: string[] }[]
  tags:             string[]
  inStock:          boolean
  stock:            number
  published:        boolean
  featured:         boolean
  createdAt?:       string
  updatedAt?:       string
}