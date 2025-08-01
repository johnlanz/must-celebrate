'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import Sidebar from '@/components/layout/Sidebar'
import TopBar from '@/components/layout/Topbar'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { AddProductModal } from '@/components/products/AddProductModal'
import { FullScreenLoader } from '@/components/layout/FullScreenLoader'
import AccessControl from '@/components/AccessControl'

// Types
interface SKU { id: number; sku: string; price: number; quantity: number; attribute_name: string | null; attribute_value: string | null; cover: string | null }
interface Category { value: number; label: string }
interface SubCategory { id: number; label: string }
interface Product {
  id: number
  name: string
  description: string | null
  category_id: number | null
  category: { name: string } | null
  cover: string | null
  products_skus: SKU[]
}

const PAGE_SIZE = 14

function ProductCrudPage() {
  const supabase = createClient()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)

  useEffect(() => {
    fetchMeta()
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [page, searchTerm])

  // fetch category options
  const fetchMeta = async () => {
    const { data: cats } = await supabase.from('categories').select('id, name')
    setCategories(cats?.map(c => ({ value: c.id, label: c.name })) || [])
  }

  const fetchProducts = async () => {
    setLoading(true)
    let query = supabase
      .from('products')
      .select(
        `id, name, description, summary, cover, category_id, categories(name), products_skus(id, sku, price, quantity, attribute_name, attribute_value, cover)`,
        { count: 'exact' }
      )
      .order('created_at', { ascending: false })

    // apply search filter
    if (searchTerm) {
      query = query.ilike('name', `%${searchTerm}%`)
    }
    
    // apply pagination range
    const from = (page - 1) * PAGE_SIZE
    const to = from + PAGE_SIZE - 1
    const { data, error, count } = await query.range(from, to)

    if (error) console.error('Fetch products error:', error)
    else if (data) {
      setTotalCount(count || 0)
      const formatted: Product[] = data.map((p: any) => ({
        ...p,
        category: p.categories ?? null,
      }))
      setProducts(formatted)
    }
    setLoading(false)
  }

  // handlers
  const handleAdd = async () => {
    setPage(1)
    await fetchProducts()
  }
  const handleEdit = async () => {
    await fetchProducts()
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) console.error('Delete error:', error)
    else fetchProducts()
  }

  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar title="Products" user={{ name: 'John Doe' }} />
        <main className="p-6 bg-white overflow-auto">
          {loading && <FullScreenLoader />}

          {/* Search and Add */}
          <div className="flex justify-between items-center mb-4">
            <input
              type="text"
              placeholder="Search products..."
              className="border rounded px-3 py-1"
              value={searchTerm}
              onChange={e => { setSearchTerm(e.target.value); setPage(1) }}
            />
            <AddProductModal
              metaCats={categories}
              metaSubs={[]}
              onSave={handleAdd}
            />
          </div>

          {/* Table */}
          {loading ? (
            <div>Loading...</div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map(product => (
                    <TableRow key={product.id}>
                      <TableCell>{product.id}</TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.category?.name || '-'}</TableCell>
                      <TableCell>{product.description}</TableCell>
                      <TableCell className="space-x-2 text-right">
                        <AddProductModal
                          metaCats={categories}
                          metaSubs={[]}
                          product={product}
                          onSave={handleEdit}
                        />
                        <ProductViewDialog product={product} />
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(product.id)}>
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

             {/* Pagination Controls */}
                      <div className="flex justify-center items-center space-x-4 mt-4">
                        <Button
                          disabled={page <= 1}
                          onClick={() => setPage((p) => Math.max(p - 1, 1))}
                        >
                          Previous
                        </Button>
                        <span>Page {page} of {totalPages}</span>
                        <Button
                          disabled={page >= totalPages}
                          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                        >
                          Next
                        </Button>
                      </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}

function ProductViewDialog({ product }: { product: Product }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          View Product
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{product.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {product.cover && (
            <img
              src={product.cover}
              alt={product.name}
              className="w-full h-48 object-cover rounded"
            />
          )}
          <div className="flex space-x-2">
            <span className="font-medium">Category:</span>
            <span>{product.category?.name || 'Uncategorized'}</span>
          </div>
          <p className="text-base">{product.description}</p>

          <h3 className="text-lg font-medium">SKUs</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Attribute</TableHead>
                <TableHead>Image</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {product.products_skus.map((sku) => (
                <TableRow key={sku.id}>
                  <TableCell>{sku.sku}</TableCell>
                  <TableCell className="text-right">₱{sku.price}</TableCell>
                  <TableCell>{sku.quantity}</TableCell>
                  <TableCell>{sku.attribute_name} : {sku.attribute_value}</TableCell>
                  <TableCell>
                    {sku.cover && (
                      <img
                        src={sku.cover}
                        alt={sku.sku}
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AccessControl(ProductCrudPage, { access: ['admin', 'staff'] })
