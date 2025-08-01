'use client'

import React, { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'

/** keep it in the same file or move to a constants module */
const STATUS_OPTIONS = [
  { value: 'pending',    label: 'Pending' },
  { value: 'confirmed',  label: 'Confirmed' },
  { value: 'preparing',  label: 'Preparing' },
  { value: 'ready',      label: 'For Pickup' },
  { value: 'complete',   label: 'Complete' },
]

/**
 * Props:
 *   order            – the row you already pass
 *   onUpdateStatus   – (id: number, newStatus: string) => Promise<void>
 *                      inject this from the parent so the same logic updates
 *                      `order_details`, sends the e-mail, and refreshes tables
 */
export default function OrderView({ order, onUpdateStatus }) {
  if (!order) return <div>Order not found.</div>

  /* ───── local UI state ───── */
  const [status, setStatus]   = useState(order.order_status)
  const [saving, setSaving]   = useState(false)

  /* normalise the items exactly like before … */
  const items = Array.isArray(order.cart_items)
    ? order.cart_items
    : typeof order.cart_items === 'object'
      ? [order.cart_items]
      : []

  const normalized = items.map((it: any) => {
    const name  = it.product.name + ' ' + it.sku.attribute_value
    const price = parseFloat(it.sku.price ?? 0)
    const qty   = it.qty || 1
    return { name, price, qty, total: price * qty }
  })

  const computedTotal = normalized.reduce((sum, it) => sum + it.total, 0)

  /* ───── handler ───── */
  const handleSave = async () => {
    if (status === order.order_status) return    // nothing changed
    setSaving(true)
    try {
      await onUpdateStatus(order.id, status)     // delegate to parent
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-6 bg-gray-50 overflow-y-auto space-y-6">
      {/* meta cards … unchanged except for status row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent>
            <h3 className="text-lg font-semibold mb-4">Order Details</h3>
            <ul className="space-y-2 text-sm">
              <li><strong>ID:</strong> {order.id}</li>
              <li><strong>Store ID:</strong> {order.store_id}</li>
              <li><strong>Payment ID:</strong> {order.payment_id || '—'}</li>
              <li><strong>Payment Method:</strong> {order.payment_method || '—'}</li>
              <li><strong>Total:</strong> ₱ {parseFloat(order.total).toFixed(2)}</li>
              <li><strong>Created:</strong> {new Date(order.created_at).toLocaleString()}</li>
              <li><strong>Updated:</strong> {new Date(order.updated_at).toLocaleString()}</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-4">
            <h3 className="text-lg font-semibold">Customer</h3>
            <ul className="space-y-2 text-sm">
              <li><strong>Name:</strong> {order.first_name} {order.last_name}</li>
              <li><strong>Email:</strong> {order.email}</li>
            </ul>

            {/* ▼▼ status selector + save button ▼▼ */}
            <div className="space-y-2">
              <label className="text-sm font-semibold block">Order Status</label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map(o => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                onClick={handleSave}
                disabled={saving || status === order.order_status}
                className="w-full"
              >
                {saving ? 'Updating…' : 'Update Status'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* items table … identical to your original version */}
      <Card>
        <CardContent>
          <h3 className="text-lg font-semibold mb-4">Order Items</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b">
                  <th className="py-2 pr-4">Product</th>
                  <th className="py-2 pr-4">Price</th>
                  <th className="py-2 pr-4">QTY</th>
                  <th className="py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {normalized.map((it, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="py-2 pr-4">{it.name}</td>
                    <td className="py-2 pr-4">₱ {it.price.toFixed(2)}</td>
                    <td className="py-2 pr-4">{it.qty}</td>
                    <td className="py-2 text-right">₱ {it.total.toFixed(2)}</td>
                  </tr>
                ))}
                <tr>
                  <td colSpan={3} className="py-2 text-right font-semibold">Total:</td>
                  <td className="py-2 font-semibold text-right">₱ {computedTotal.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}