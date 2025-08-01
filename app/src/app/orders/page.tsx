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

// Full Order History Page
export default function OrderHistoryPage() {
  const supabase = createClient()
  const [orders, setOrders] = useState<any[]>([]);
  const [search, setSearch] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(14);
  const [totalCount, setTotalCount] = useState<number>(0);
  // at top of file, add:
  const STATUS_OPTIONS = [
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'preparing', label: 'Preparing' },
    { value: 'ready', label: 'For Pickup' },
    { value: 'complete', label: 'Complete' },
  ];

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
    setOrders((prev) =>
      prev.map(o => o.id === id ? { ...o, order_status: newStatus } : o)
    );
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

  useEffect(() => {
    fetchOrders();
  }, [search, page]);

  async function fetchOrders() {
    // 1) If there's a search term, try to treat it as an Order ID:
    if (search) {
      const id = parseInt(search, 10);

      // only numeric searches are valid
      if (!isNaN(id)) {
        const { data, count, error } = await supabase
          .from('order_details')
          .select('*', { count: 'exact' })
          .eq('id', id);

        if (error) {
          console.error('Error fetching order by ID:', error);
        } else {
          setOrders(data || []);
          setTotalCount(count || 0);
        }
        return;
      }

      // non-numeric search ⇒ no results
      setOrders([]);
      setTotalCount(0);
      return;
    }

    // 2) Otherwise, do your normal paginated fetch:
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, count, error } = await supabase
      .from('order_details')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) {
      console.error('Error fetching orders:', error);
    } else {
      setOrders(data || []);
      setTotalCount(count || 0);
    }
  }



  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar title="All Orders" user={{ name: 'John Doe' }} />
        <div className="p-6 bg-gray-50 h-screen overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Complete Order History</h1>
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Search by Order ID"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-64"
              />
              <Search />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b">
                  <th className="py-2 pr-4">#</th>
                  <th className="py-2 pr-4">Order ID</th>
                  <th className="py-2 pr-4">Transaction ID</th>
                  <th className="py-2 pr-4">Name</th>
                  <th className="py-2 pr-4">Email</th>
                  <th className="py-2 pr-4">Total</th>
                  <th className="py-2 pr-4">Date</th>
                  <th className="py-2">Time</th>
                  <th className="py-2 pr-4">Order Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o, idx) => (
                  <tr key={o.id} className="border-b">
                    <td className=" pr-4 ">{(page - 1) * pageSize + idx + 1}</td>
                    <td className="py-2 pr-4">
                      <Link className="text-red-500" href={`/orders/${o.id}`}>
                        {o.id}
                      </Link></td>
                    <td className="py-2 pr-4">#{o.reference_number}</td>
                    <td className="py-2 pr-4">{o.first_name} {o.last_name}</td>
                    <td className="py-2 pr-4">{o.email}</td>
                    <td className="py-2 pr-4">₱ {parseFloat(o.total).toFixed(2)}</td>
                    <td className="py-2 pr-4">{new Date(o.created_at).toLocaleDateString()}</td>
                    <td className="py-2">{new Date(o.created_at).toLocaleTimeString()}</td>
                    <td className="py-2 pr-4 ">
                      <select
                        value={o.order_status || ''}
                        onChange={e => handleStatusChange(o.id, e.target.value)}
                        className="border rounded px-2 py-1 text-red-500 border-black"
                      >
                        <option value="" disabled>-- Select --</option>
                        {STATUS_OPTIONS.map(opt => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
        </div>
      </div>
    </div>
  );
}

