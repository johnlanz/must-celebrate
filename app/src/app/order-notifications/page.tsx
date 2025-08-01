'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/Topbar';
import { Toaster, toast } from 'sonner';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { useOrderMetrics } from '@/lib/useOrderMetrics';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import OrderView from '@/components/products/OrderView';

dayjs.extend(relativeTime);

const STATUS_TABS = ['All', 'Pending', 'Complete', 'Failed', 'Cancelled'];

export default function OrderNotificationPage() {
    const supabase = createClient();
    const {
        metricTotal,
        metricToday,
        metricCancelled,
        metricPending,
        totalLastWeek,
        todayLastWeek,
        cancelledLastWeek,
        pendingLastWeek,
        sparkDataTotal,
        refresh
    } = useOrderMetrics(supabase);

    // helper for % change
    const pct = (curr: number, prev: number) =>
    prev > 0 ? ((curr - prev) / prev) * 100 : 0;

    const totalChange = pct(metricTotal, totalLastWeek);
    const todayChange = pct(metricToday, todayLastWeek);
    const cancelledChange = pct(metricCancelled, cancelledLastWeek);
    const pendingChange = pct(metricPending, pendingLastWeek);


    // ── State ──
    const [orders, setOrders] = useState<any[]>([]);
    const [totalCount, setTotalCount] = useState(0);


    // pagination + filters
    const [page, setPage] = useState(1);
    const pageSize = 10;
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('All');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [sortField, setSortField] = useState<'created_at' | 'name'>('created_at');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [latestOrderId, setLatestOrderId] = useState<number | null>(null);

    const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    /* ───────────────────────────────────────────────────────────── */
    /* put this immediately after you declare pct()/totalChange …   */
    /* ───────────────────────────────────────────────────────────── */
    useEffect(() => {
        // listen only on the client
        const channel = supabase
            .channel('orders-insert')            // the channel name is arbitrary
            .on(
            'postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'order_details' },
            ({ new: order }) => {
                // 👉 any UI side-effects you like
                console.log(`New order #${order.id} – ₱${order.total}`);
                // 🔄 pull fresh counts & sparkline
                refresh();
                fetchOrders();

                // optional: highlight the newest row
                setLatestOrderId(order.id);
            },
            )
            .subscribe();

        // remember to leave the room when the component unmounts
        return () => {
            supabase.removeChannel(channel);
        };
    }, [supabase, refresh]);   // ← refresh is stable (useCallback) so this is safe

    async function fetchOrders() {
        const from = (page - 1) * pageSize;
        const to = from + pageSize - 1;

        let query = supabase
            .from('order_details')
            .select('*', { count: 'exact' })
            .order('created_at', { ascending: false });

        if (statusFilter !== 'All') {
            const val = statusFilter.toLowerCase();
            if (val === 'cancelled') {
                query = query.ilike('order_status', '%cancel%');
            } else {
                query = query.ilike('order_status', val);
            }
        }

        const { data, error, count } = await query.range(from, to);
        if (error) console.error('Error loading orders:', error);
        else {
            setOrders(data || []);
            setTotalCount(count || 0);
        }
    }

    // ── Fetch one page of orders + status filter ──
    useEffect(() => {
        fetchOrders();
    }, [supabase, page, statusFilter]);

    // ── Filter & sort client-side (search, date) ──
    const processedOrders = orders
        .filter(o => {
            // search
            const t = search.toLowerCase();
            if (
                t &&
                !(
                    o.id.toString().includes(t) ||
                    `${o.first_name} ${o.last_name}`.toLowerCase().includes(t)
                )
            ) {
                return false;
            }
            // date range
            const d = dayjs(o.created_at).startOf('day');
            if (startDate && d.isBefore(dayjs(startDate))) return false;
            if (endDate && d.isAfter(dayjs(endDate))) return false;
            return true;
        })
        .sort((a, b) => {
            if (sortField === 'name') {
                return (
                    (sortOrder === 'asc' ? 1 : -1) *
                    `${a.first_name} ${a.last_name}`.localeCompare(
                        `${b.first_name} ${b.last_name}`
                    )
                );
            }
            return (
                (sortOrder === 'asc' ? 1 : -1) *
                (dayjs(a.created_at).isBefore(dayjs(b.created_at)) ? -1 : 1)
            );
        });

    const totalPages = Math.ceil(totalCount / pageSize);

    async function handleStatusChange(id: number, newStatus: string) {
        const { error } = await supabase
            .from('order_details')
            .update({ order_status: newStatus })
            .eq('id', id);

        console.log("Status updated for order ID:", id, "to", newStatus);

        if (newStatus === 'ready' || newStatus === 'complete') {
            emailSend(id, newStatus);
        }

        if (error) {
            console.error('Error updating status:', error);
            return;
        }
        fetchOrders()
    }

    async function emailSend(id: number, status: string) {
        const email = await fetch("/api/checkout/order-email", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                orderId: id,
                status: status,
            }),
        })
        console.log("Pickup email sent for order ID:", id);
    }


    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <TopBar title="New Orders" user={{ name: 'John Doe' }} />
                <Toaster position="top-right" />

                {/*  View-order modal  */}
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogContent className="min-w-2/4 max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                        <DialogTitle>Order #{selectedOrder?.id}</DialogTitle>
                        </DialogHeader>

                        {selectedOrder && (
                            <OrderView order={selectedOrder} onUpdateStatus={handleStatusChange} />
                        )}
                    </DialogContent>
                </Dialog>

                <div className="p-6 space-y-6">
                    {/* ── Metrics ── */}
                    <div className="grid grid-cols-4 gap-4">
                        {/* Total */}
                        <Card>
                            <CardContent>
                                <p className="text-sm text-gray-500">Total Orders</p>
                                <h2 className="text-2xl font-bold">{metricTotal}</h2>
                                <p className={`text-xs ${totalChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                    {totalChange >= 0 ? '+' : ''}
                                    {totalChange.toFixed(1)}% last week
                                </p>
                                <ResponsiveContainer width="100%" height={30}>
                                    <LineChart data={sparkDataTotal}>
                                        <Line dataKey="count" dot={false} stroke="#3b82f6" strokeWidth={2} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Today's */}
                        <Card>
                            <CardContent>
                                <p className="text-sm text-gray-500">Today's Orders</p>
                                <h2 className="text-2xl font-bold">{metricToday}</h2>
                                <p className={`text-xs ${todayChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                    {todayChange >= 0 ? '+' : ''}
                                    {todayChange.toFixed(1)}% last week
                                </p>
                            </CardContent>
                        </Card>

                        {/* Cancelled */}
                        <Card>
                            <CardContent>
                                <p className="text-sm text-gray-500">Cancelled Orders</p>
                                <h2 className="text-2xl font-bold">{metricCancelled}</h2>
                                <p className={`text-xs ${cancelledChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                    {cancelledChange >= 0 ? '+' : ''}
                                    {cancelledChange.toFixed(1)}% last week
                                </p>
                            </CardContent>
                        </Card>

                        {/* Pending */}
                        <Card>
                            <CardContent>
                                <p className="text-sm text-gray-500">Pending Orders</p>
                                <h2 className="text-2xl font-bold">{metricPending}</h2>
                                <p className={`text-xs ${pendingChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                    {pendingChange >= 0 ? '+' : ''}
                                    {pendingChange.toFixed(1)}% last week
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* ── Filters & Tabs ── */}
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex space-x-2">
                            {STATUS_TABS.map(tab => (
                                <Button
                                    key={tab}
                                    size="sm"
                                    variant={statusFilter === tab ? 'default' : 'outline'}
                                    onClick={() => setStatusFilter(tab)}
                                >
                                    {tab}
                                </Button>
                            ))}

                        </div>

                        <div className="flex flex-wrap gap-2 items-center">
                            <Input
                                placeholder="Search order # or customer"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-64"
                            />
                            <div className="flex items-center space-x-1">
                                <label className="text-sm">From:</label>
                                <Input
                                    type="date"
                                    value={startDate}
                                    onChange={e => setStartDate(e.target.value)}
                                    className="w-36"
                                />
                            </div>
                            <div className="flex items-center space-x-1">
                                <label className="text-sm">To:</label>
                                <Input
                                    type="date"
                                    value={endDate}
                                    onChange={e => setEndDate(e.target.value)}
                                    className="w-36"
                                />
                            </div>
                            <select
                                value={sortField}
                                onChange={e => setSortField(e.target.value as any)}
                                className="border rounded px-2 py-1 text-sm"
                            >
                                <option value="created_at">Date</option>
                                <option value="name">Customer</option>
                            </select>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setSortOrder(o => (o === 'asc' ? 'desc' : 'asc'))}
                            >
                                {sortOrder === 'asc' ? '↑' : '↓'}
                            </Button>
                        </div>
                    </div>

                    {/* ── Orders Table ── */}
                    <div className="overflow-x-auto bg-white shadow rounded">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                        Order #
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                        Customer
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                        Payment Method
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                        Status
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                        Submitted
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {processedOrders.length > 0 ? (
                                    processedOrders.map(o => (
                                        <tr
                                            key={o.id}
                                            className={`hover:bg-gray-50 ${o.id === latestOrderId ? 'bg-yellow-100' : ''
                                                }`}
                                        >
                                            <td className="px-4 py-3 text-sm text-gray-700">{o.id}</td>
                                            <td className="px-4 py-3 text-sm text-gray-700">
                                                <Link
                                                    href="/orders"
                                                    className="font-medium text-blue-600 hover:underline"
                                                >
                                                    {o.first_name} {o.last_name}
                                                </Link>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-700">{o.payment_method}</td>
                                            <td className="px-4 py-3 text-sm text-gray-700">{o.order_status}</td>
                                            <td className="px-4 py-3 text-sm text-gray-500">
                                                {dayjs(o.created_at).fromNow()}
                                            </td>
                                            <td className="px-4 py-3 text-sm">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => {
                                                        setSelectedOrder(o);
                                                        setDialogOpen(true);
                                                    }}
                                                >
                                                    View
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="px-4 py-3 text-center text-sm text-gray-500"
                                        >
                                            No orders found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* ── Pagination ── */}
                    <div className="flex items-center justify-center space-x-2 mt-4">
                        <Button disabled={page <= 1} onClick={() => setPage(p => Math.max(p - 1, 1))}>
                            Previous
                        </Button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
                            <Button
                                key={num}
                                size="sm"
                                variant={page === num ? 'default' : 'outline'}
                                onClick={() => setPage(num)}
                            >
                                {num}
                            </Button>
                        ))}

                        <Button disabled={page >= totalPages} onClick={() => setPage(p => Math.min(p + 1, totalPages))}>
                            Next
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
