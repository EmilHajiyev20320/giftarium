import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CartItem } from '@/src/types'

export interface BoxType {
  id: string
  name: string
  description: string | null
  price: number
  size: string
  capacity: number
  image: string | null
  images: string[]
}

interface CustomBoxStore {
  boxType: BoxType | null
  items: CartItem[]
  postcardText: string
  setBoxType: (boxType: BoxType | null) => void
  setPostcardText: (text: string) => void
  addItem: (item: CartItem) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearBox: () => void
  getTotal: () => number
  getItemCount: () => number
}

export const useCustomBoxStore = create<CustomBoxStore>()(
  persist(
    (set, get) => ({
      boxType: null,
      items: [],
      postcardText: '',
      setBoxType: (boxType) => set({ boxType }),
      setPostcardText: (text) => set({ postcardText: text }),
      addItem: (item) => {
        const existingItem = get().items.find((i) => i.productId === item.productId)
        if (existingItem) {
          set({
            items: get().items.map((i) =>
              i.productId === item.productId
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
          })
        } else {
          set({ items: [...get().items, item] })
        }
      },
      removeItem: (productId) => {
        set({ items: get().items.filter((i) => i.productId !== productId) })
      },
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }
        set({
          items: get().items.map((i) =>
            i.productId === productId ? { ...i, quantity } : i
          ),
        })
      },
      clearBox: () => set({ items: [], boxType: null, postcardText: '' }),
      getTotal: () => {
        const itemsTotal = get().items.reduce((total, item) => total + item.price * item.quantity, 0)
        // Box type price will be determined by the system, not by user selection
        return itemsTotal
      },
      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0)
      },
    }),
    {
      name: 'giftbox-custom-box',
    }
  )
)

