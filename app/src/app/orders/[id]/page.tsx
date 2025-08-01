'use client'

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client'
import { Card, CardContent } from '@/components/ui/card';
import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/Topbar';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useParams } from 'next/navigation';
import { FullScreenLoader } from '@/components/layout/FullScreenLoader';


// Single Order Detail Page Component
export default function OrderDetailPage() {
    const supabase = createClient()
    const { id } = useParams<{ id: string }>();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (!id) return;
        async function loadOrder() {
            const { data, error } = await supabase
                .from('order_details')
                .select('*')
                .eq('id', id)
                .single();
            if (error) console.error('Error fetching order:', error);
            else setOrder(data);
            setLoading(false);
        }
        loadOrder();
    }, [id]);

    if (loading) return <FullScreenLoader />;
    if (!order) return <div>Order not found.</div>;

    // Normalize items array
    const items = Array.isArray(order.cart_items)
        ? order.cart_items
        : typeof order.cart_items === 'object'
            ? [order.cart_items]
            : [];

    // Compute fields with fallback
    const normalized = items.map((it: any) => {
        const productObj = typeof it.product === 'object' ? it.product : null;
        const name = productObj?.name ?? it.product ?? it.name ?? '—';
        const price = it.sku.price !== undefined ? parseFloat(it.sku.price) : 0;
        const qty = it.qty || 1;
        const total = price * qty;
        return { name, price, qty, total };
    });

    const computedTotal = normalized.reduce((sum, it) => sum + it.total, 0);

    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <TopBar title={`Order #${order.id}`} user={{ name: 'John Doe' }} />
                <div className="p-6 bg-gray-50 overflow-y-auto space-y-6">
                    {/* Order Meta Section */}
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
                            <CardContent>
                                <h3 className="text-lg font-semibold mb-4">Customer</h3>
                                <ul className="space-y-2 text-sm">
                                    <li><strong>Name:</strong> {order.first_name} {order.last_name}</li>
                                    <li><strong>Email:</strong> {order.email}</li>
                                    <li><strong>Order Status:</strong> {order.order_status}</li>
                                    <li><strong>Payment Status:</strong> {order.payment_status}</li>
                                </ul>
                            </CardContent>
                        </Card>

                    </div>
                    {/* Order Items Section */}
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
                                            <th className="py-2">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {normalized.map((it, idx) => (
                                            <tr key={idx} className="border-b">
                                                <td className="py-2 pr-4">{it.name}</td>
                                                <td className="py-2 pr-4">₱ {it.price.toFixed(2)}</td>
                                                <td className="py-2 pr-4">{it.qty}</td>
                                                <td className="py-2">₱ {it.total.toFixed(2)}</td>
                                            </tr>
                                        ))}
                                        <tr>
                                            <td colSpan={3} className="py-2 pr-4 text-right font-semibold">Total:</td>
                                            <td className="py-2 font-semibold">₱ {computedTotal.toFixed(2)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>




                </div>
            </div>
        </div>
    );
}
