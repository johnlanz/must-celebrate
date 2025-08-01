'use client'

import React, { useState, useEffect, ReactNode } from 'react';
import { createClient } from '@/utils/supabase/client'
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus } from 'lucide-react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/Topbar';
import Link from 'next/link';

export default function SalesDashboard() {
  const supabase = createClient()
  // Raw orders data
  const [orders, setOrders] = useState<any[]>([]);
  const [popularMenu, setPopularMenu] = useState([]);

  // Current metrics
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [todaysOrders, setTodaysOrders] = useState<number>(0);
  const [totalOrders, setTotalOrders] = useState<number>(0);
  const [cancelledOrders, setCancelledOrders] = useState<number>(0);

  // Previous-month metrics
  const [lastMonthRevenue, setLastMonthRevenue] = useState<number>(0);
  const [lastMonthTodayCount, setLastMonthTodayCount] = useState<number>(0);
  const [lastMonthTotalOrders, setLastMonthTotalOrders] = useState<number>(0);
  const [lastMonthCancelled, setLastMonthCancelled] = useState<number>(0);

  // Percentage changes
  const [revenueChange, setRevenueChange] = useState<number>(0);
  const [todayChange, setTodayChange] = useState<number>(0);
  const [totalChange, setTotalChange] = useState<number>(0);
  const [cancelledChange, setCancelledChange] = useState<number>(0);

  // Chart & history
  const [chartData, setChartData] = useState<{ month: string; received: number; served: number }[]>([]);
  const [orderHistory, setOrderHistory] = useState<any[]>([]);

  useEffect(() => {
    async function loadOrders() {
      const { data, error } = await supabase
        .from('order_details')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('Orders fetched:', data);

      if (error) console.error('Error fetching orders:', error);
      else setOrders(data || []);
    }

    // Fetch popular menu items (adjust table/column names as needed)
    async function loadPopularMenu() {
      // 1) fetch all products
      const { data: products, error: pErr } = await supabase
        .from('products')
        .select('id, name');
      if (pErr) {
        console.error('Error loading products:', pErr.message);
        return;
      }

      // 2) fetch every order’s cart_items JSON
      const { data: orders, error: oErr } = await supabase
        .from('order_details')
        .select('cart_items');
      if (oErr) {
        console.error('Error loading order details:', oErr.message);
        return;
      }

      // 3) tally up qty by product.id
      const counts: Record<number, number> = {};
      orders!.forEach(o => {
        // parse string→array if needed
        let items = o.cart_items;
        if (typeof items === 'string') {
          try { items = JSON.parse(items); }
          catch { return; }
        }
        if (!Array.isArray(items)) return;

        items.forEach(item => {
          const pid = item.product?.id;   // your JSON has item.product.id
          const q = item.qty ?? 1;    // and item.qty
          if (typeof pid === 'number') {
            counts[pid] = (counts[pid] || 0) + q;
          }
        });
      });

      // 4) merge counts into product list, sort & take top 5
      const top10 = (products || [])
        .map(p => ({ ...p, timesOrdered: counts[p.id] || 0 }))
        .sort((a, b) => b.timesOrdered - a.timesOrdered)
        .slice(0, 10);

      setPopularMenu(top10);
    }

    loadOrders();
    loadPopularMenu();
  }, []);

  useEffect(() => {
    if (!orders.length) return;

    const now = new Date();
    const todayKey = now.toDateString();
    const prevDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const prevMonth = prevDate.getMonth();
    const prevYear = prevDate.getFullYear();
    const prevKey = prevDate.toDateString();

    // Current metrics
    const revenue = orders.reduce((sum, o) => sum + parseFloat(o.total), 0);
    const todayCount = orders.filter(o => new Date(o.created_at).toDateString() === todayKey).length;
    const totalCount = orders.length;
    const cancelledCount = orders.filter(o => o.order_status === 'cancelled').length;

    setTotalRevenue(revenue);
    setTodaysOrders(todayCount);
    setTotalOrders(totalCount);
    setCancelledOrders(cancelledCount);

    // Previous-month metrics
    const ordersLastMonth = orders.filter(o => {
      const d = new Date(o.created_at);
      return d.getMonth() === prevMonth && d.getFullYear() === prevYear;
    });
    const revenueLast = ordersLastMonth.reduce((sum, o) => sum + parseFloat(o.total), 0);
    const totalLast = ordersLastMonth.length;
    const cancelledLast = ordersLastMonth.filter(o => o.order_status === 'cancelled').length;
    const todayLast = orders.filter(o => new Date(o.created_at).toDateString() === prevKey).length;

    setLastMonthRevenue(revenueLast);
    setLastMonthTotalOrders(totalLast);
    setLastMonthCancelled(cancelledLast);
    setLastMonthTodayCount(todayLast);

    // Percentage changes
    setRevenueChange(revenueLast > 0 ? ((revenue - revenueLast) / revenueLast) * 100 : 0);
    setTodayChange(lastMonthTodayCount > 0 ? ((todayCount - lastMonthTodayCount) / lastMonthTodayCount) * 100 : 0);
    setTotalChange(totalLast > 0 ? ((totalCount - totalLast) / totalLast) * 100 : 0);
    setCancelledChange(lastMonthCancelled > 0 ? ((cancelledCount - cancelledLast) / lastMonthCancelled) * 100 : 0);

    // Monthly chart
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const rec = Array(12).fill(0);
    const serv = Array(12).fill(0);
    orders.forEach(o => {
      const d = new Date(o.created_at);
      rec[d.getMonth()]++;
      if (o.order_status === 'Done') serv[d.getMonth()]++;
    });
    setChartData(months.map((m, i) => ({ month: m, received: rec[i], served: serv[i] })));

    // Recent history
    setOrderHistory(
      orders.slice(0, 5).map(o => ({
        id: `#${o.id}`,
        name: `${o.first_name} ${o.last_name}`,
        status: o.order_status,
        date: new Date(o.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
        time: new Date(o.created_at).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }),
        payment: `₱ ${parseFloat(o.total).toFixed(2)}`
      }))
    );
  }, [orders, lastMonthTodayCount, lastMonthCancelled]);

  // Helper for rendering change
  const renderChange = (change: number) => (
    <>{change >= 0 ? '+' : ''}{change.toFixed(1)}% from last month</>
  );

  return (
    <div className="flex h-screen">
     
      <div className="flex-1 flex flex-col overflow-hidden">
        
        <div className="p-6 space-y-6 bg-gray-50 h-screen overflow-y-auto">
          <div className="flex justify-between items-center">
            {/* <div className="flex gap-2 items-center">
              <Input placeholder="Search Report" className="w-64" />
              <Button variant="outline"><Search size={16} /></Button>
            </div>*/}
          </div>

          <div className="grid grid-cols-4 gap-4">
            <Card><CardContent className="p-4">
              <p className="text-sm text-gray-500">Total Revenue</p>
              <h2 className="text-xl font-bold">₱{totalRevenue.toFixed(2)}</h2>
              <p className={`text-xs ${revenueChange >= 0 ? 'text-[#67a626]' : 'text-red-500'}`}>
                {renderChange(revenueChange)}
              </p>
            </CardContent></Card>

            <Card><CardContent className="p-4">
              <p className="text-sm text-gray-500">Order Today's</p>
              <h2 className="text-xl font-bold">{todaysOrders}</h2>
              <p className={`text-xs ${todayChange >= 0 ? 'text-[#67a626]' : 'text-red-500'}`}>
                {renderChange(todayChange)}
              </p>
            </CardContent></Card>

            <Card><CardContent className="p-4">
              <p className="text-sm text-gray-500">Total Order</p>
              <h2 className="text-xl font-bold">{totalOrders}</h2>
              <p className={`text-xs ${totalChange >= 0 ? 'text-[#67a626]' : 'text-red-500'}`}>
                {renderChange(totalChange)}
              </p>
            </CardContent></Card>

            <Card><CardContent className="p-4">
              <p className="text-sm text-gray-500">Cancelled Order</p>
              <h2 className="text-xl font-bold">{cancelledOrders}</h2>
              <p className={`text-xs ${cancelledChange >= 0 ? 'text-[#67a626]' : 'text-red-500'}`}>
                {renderChange(cancelledChange)}
              </p>
            </CardContent></Card>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Card className="col-span-2">
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">Sales Order</h3>
                  <Button variant="outline" size="sm">Monthly</Button>
                </div>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={chartData}>
                    <XAxis dataKey="month" />
                    <Tooltip />
                    <Bar dataKey="received" fill="#67a626" />
                    <Bar dataKey="served" fill="#f6e700" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">Popular Menu</h3>
                </div>
                <ul className="text-sm space-y-2">
                  {popularMenu
                    .filter(item => item.timesOrdered > 1)
                    .map((item, idx) => (
                      <li key={idx} className="flex justify-between border-b pb-1">
                        <div>
                          <span className="font-medium">{item.name}</span>
                          <span className="ml-2 text-xs text-gray-500">
                            ({item.timesOrdered} orders)
                          </span>
                        </div>
                      </li>
                    ))
                  }
                  {popularMenu.filter(item => item.timesOrdered > 1).length === 0 && (
                    <p className="text-sm text-gray-500">No popular items at the moment.</p>
                  )}
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4">Order History</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2 pr-4">Order ID</th>
                      <th className="py-2 pr-4">Recipient Name</th>
                      <th className="py-2 pr-4">Status</th>
                      <th className="py-2 pr-4">Date</th>
                      <th className="py-2 pr-4">Time</th>
                      <th className="py-2">Payment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderHistory.map((order) => (
                      <tr key={order.id} className="border-b">
                        <td className="py-2 pr-4 text-red-500 font-semibold">{order.id}</td>
                        <td className="py-2 pr-4">{order.name}</td>
                        <td className="py-2 pr-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${order.status === "Done"
                            ? "bg-[#67a626] text-white"
                            : "bg-red-100 text-red-700"
                            }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-2 pr-4">{order.date}</td>
                        <td className="py-2 pr-4">{order.time}</td>
                        <td className="py-2">{order.payment}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 text-right">
                <Link href="/orders">
                  <Button>View All Orders</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
