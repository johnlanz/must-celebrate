"use client"

import React, { useState, useEffect, useMemo } from "react"
import useSWR from "swr"
import { useParams, useRouter } from "next/navigation"
import { createClient } from "@supabase/supabase-js"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, X } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FullScreenLoader } from "@/components/layout/FullScreenLoader"
import { ProductDetailFullscreen } from "@/components/products/ProductDetailFullscreen"
import { Card } from "@/components/ui/card"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type SKU = { id: number; price: number; quantity: number; cover: string; attribute_name: string; attribute_value: string }
type Product = { id: number; name: string; description: string; cover: string; products_skus: SKU[] }
type Category = { id: number; name: string; description: string | null; products: Product[] }

// compute current month bounds
function getMonthBounds() {
  const now = new Date()
  return {
    start: new Date(now.getFullYear(), now.getMonth(), 1).toISOString(),
    end:   new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString(),
  }
}

// 1) fetch categories
async function fetchCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select(`
      id,name,description,
      products (
        id,name,description,cover,
        products_skus(id,price,quantity,cover,attribute_name,attribute_value)
      )
    `)
    .is("deleted_at", null)
    .order("id", { foreignTable: "products", ascending: true })

  if (error) throw error
  return data!
}

// 2) fetch & rank this‐month top 5 (no store_id filter)
async function fetchPopularThisMonth(): Promise<Product[]> {
  const { start, end } = getMonthBounds()
  const { data: orders, error } = await supabase
    .from("order_details")
    .select("cart_items")
    .gte("created_at", start)
    .lte("created_at", end)

  if (error) throw error
  if (!orders) return []

  // tally product.id
  const counts: Record<number, number> = {}
  orders.forEach(({ cart_items }) => {
    let items = cart_items as any[]
    if (typeof items === "string") {
      try { items = JSON.parse(items) } catch { return }
    }
    if (!Array.isArray(items)) return
    items.forEach(({ product, qty }) => {
      const pid = product?.id as number|undefined
      const q   = typeof qty === "number" ? qty : 1
      if (!pid) return
      counts[pid] = (counts[pid] || 0) + q
    })
  })

  // take top 5 IDs
  const topIds = Object.entries(counts)
    .sort(([,a],[,b]) => b - a)
    .slice(0, 5)
    .map(([id]) => Number(id))

  if (!topIds.length) return []

  // fetch full product details
  const { data: products, error: pErr } = await supabase
    .from("products")
    .select(`
      id,name,description,cover,
      products_skus(id,price,quantity,cover,attribute_name,attribute_value)
    `)
    .in("id", topIds)

  if (pErr) throw pErr
  if (!products) return []

  // preserve ranking order
  const lookup = products.reduce<Record<number,Product>>((acc,p) => {
    acc[p.id] = p
    return acc
  }, {} as any)

  return topIds.map(i => lookup[i]).filter(Boolean)
}

export default function StorePage() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()
  // we’re ignoring `id` here so that **all** orders count
  // but you can re-add `.eq("store_id", +id!)` if you want per-store

  // SWR
  const { data: categories, error: catErr } = useSWR("categories", fetchCategories)
  const { data: popular,  error: popErr } = useSWR("popularThisMonth", fetchPopularThisMonth)

  // cart (localStorage)
  const [cart, setCart] = useState<{product:Product;sku:SKU}[]>(() => {
    if (typeof window==="undefined") return []
    try { return JSON.parse(localStorage.getItem("cart")||"[]") }
    catch { return [] }
  })
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart))
  }, [cart])

  // UI state
  const [selectedProduct, setSelectedProduct] = useState<Product|null>(null)
  const [searchMode, setSearchMode]         = useState(false)
  const [searchTerm, setSearchTerm]         = useState("")

  const openProduct  = (p:Product) => setSelectedProduct(p)
  const closeProduct = () => setSelectedProduct(null)

  const handleAddOrUpdate = (items:{sku:SKU;qty:number}[]) => {
    if (!selectedProduct) return
    const filtered = cart.filter(ci => ci.product.id!==selectedProduct.id)
    const rebuilt:{product:Product;sku:SKU}[] = []
    items.forEach(({sku,qty}) => {
      for(let i=0;i<qty;i++) rebuilt.push({product:selectedProduct,sku})
    })
    setCart([...filtered,...rebuilt])
    closeProduct()
  }

  const totalPrice = cart.reduce((s,c) => s + c.sku.price, 0)

  // merge into display list
  const displayCategories = useMemo(() => {
    if (!categories) return []
    let base = categories

    if (searchMode && searchTerm.trim()) {
      const t = searchTerm.toLowerCase()
      base = [{
        id:-1,
        name:"Search Results",
        description:null,
        products: categories.flatMap(c=>c.products).filter(p=>
          p.name.toLowerCase().includes(t) ||
          p.description.toLowerCase().includes(t)
        )
      }]
    }

    return [
      {
        id:0,
        name:"Popular",
        description:null,
        products: popular || [],
      },
      ...base
    ]
  }, [categories,popular,searchMode,searchTerm])

  const onCategoryChange = (catId:string) => {
    const sec = document.getElementById(`category-${catId}`)
    if(!sec) return
    window.scrollTo({
      top: sec.getBoundingClientRect().top + window.pageYOffset - 160,
      behavior: "smooth"
    })
  }

  if (catErr||popErr) return <div className="p-4 text-red-600">Error: {(catErr||popErr)!.message}</div>
  if (!categories) return <FullScreenLoader />

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-10 bg-white p-4 border-b shadow-sm max-w-[720px] mx-auto">
        <div className="text-2xl font-bold text-[#67a626]">
          <img src="/images/sham_logo2.png" alt="Logo" className="w-[200px] mb-2"/>
        </div>
        <div className="flex gap-2">
          {searchMode
            ? <div className="flex-1 flex items-center space-x-2">
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={e=>setSearchTerm(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={()=>setSearchMode(false)}><X/></Button>
              </div>
            : <Select onValueChange={onCategoryChange}>
                <SelectTrigger className="flex-1 justify-between text-[#67a626] border-[#67a626] rounded-full">
                  <SelectValue placeholder="Browse All"/>
                </SelectTrigger>
                <SelectContent>
                  {displayCategories.map(c=>(
                    <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
          }
          {!searchMode && (
            <Button
              variant="outline"
              className="text-[#67a626] border-[#67a626] rounded-full"
              onClick={()=>setSearchMode(true)}
            >
              <Search/>
            </Button>
          )}
        </div>
      </div>

      {/* Product Grid */}
      <div className="pt-[160px] pb-[100px] px-4 space-y-8 max-w-2xl mx-auto">
        {displayCategories.map(cat=>(
          <section id={`category-${cat.id}`} key={cat.id}>
            <h2 className="text-xl font-bold text-[#67a626] mb-2">
              {cat.name}
            </h2>
            {cat.id===0 && !cat.products.length && (
              <div className="italic text-gray-500 mb-4">
                No popular items yet this month.
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              {cat.products.map(p=>{ 
                const out = p.products_skus.every(s=>s.quantity===0)
                return (
                  <Card key={p.id} className="p-2">
                    {p.cover && <img
                      src={p.cover}
                      alt={p.name}
                      className={`w-full h-32 object-cover rounded-lg ${out?"filter grayscale opacity-50":""}`}
                      onClick={()=>!out&&openProduct(p)}
                      style={{ cursor: out?"not-allowed":"pointer" }}
                    />}
                    <div className="flex justify-between mt-2">
                      <div
                        className={`text-sm font-bold text-[#67a626] ${out?"opacity-50":""}`}
                        onClick={()=>!out&&openProduct(p)}
                      >
                        {p.name}<br/>₱{p.products_skus[0]?.price.toFixed(2)}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={out}
                        onClick={()=>!out&&openProduct(p)}
                        className={`rounded-full text-white bg-[#67a626] ${out?"opacity-50 cursor-not-allowed":""}`}
                      >
                        {out?"Sold Out":"+"}
                      </Button>
                    </div>
                  </Card>
                )})}
            </div>
          </section>
        ))}
      </div>

      {/* Detail Overlay */}
      {selectedProduct&&(
        <ProductDetailFullscreen
          product={selectedProduct}
          cart={cart.map(ci=>ci.sku)}
          onClose={closeProduct}
          onAddOrUpdate={handleAddOrUpdate}
        />
      )}

      {/* Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white shadow-md border-t flex space-x-4 max-w-[720px] mx-auto">
        <Button
          className="flex-1 bg-[#67a626] text-white rounded-2xl py-6"
          onClick={()=>router.push(`/shops/${id}/cart`)}
        >
          Cart ({cart.length.toLocaleString()}) – ₱
          {totalPrice.toLocaleString("en-PH",{minimumFractionDigits:2,maximumFractionDigits:2})}
        </Button>
      </div>
    </div>
  )
}
