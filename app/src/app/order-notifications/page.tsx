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
import TopNavBar from '@/components/layout/TopNavBar';



export default function OrderNotificationPage() {
    const supabase = createClient();

    return (
        <div className="flex h-screen">
            <div className="flex-1 flex flex-col overflow-hidden">
                <TopNavBar />
                <Toaster position="top-right" />
            </div>
        </div>
    );
}
