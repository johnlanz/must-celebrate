import { useCallback, useEffect, useState } from 'react';
import dayjs from 'dayjs';

export interface OrderMetrics {
  // headline figures
  metricTotal: number;
  metricToday: number;
  metricCancelled: number;
  metricPending: number;
  // last-week comparison
  totalLastWeek: number;
  todayLastWeek: number;
  cancelledLastWeek: number;
  pendingLastWeek: number;
  // 7-day sparkline buckets
  sparkDataTotal: { day: string; count: number }[];
}

export type OrderMetricsWithRefresh = OrderMetrics & {
  refresh: () => Promise<void>;
};

/**
 * Fetches all headline & comparison metrics for order_details.
 * Keeps local state and re-runs whenever the Supabase client changes.
 */
export function useOrderMetrics(supabase): OrderMetricsWithRefresh {
  const [data, setData] = useState<OrderMetrics>({
    metricTotal: 0,
    metricToday: 0,
    metricCancelled: 0,
    metricPending: 0,
    totalLastWeek: 0,
    todayLastWeek: 0,
    cancelledLastWeek: 0,
    pendingLastWeek: 0,
    sparkDataTotal: [],
  });

  const refresh = useCallback(async () => {
    const startToday = dayjs().startOf('day').toISOString();
      const startLastWeek = dayjs().subtract(1, 'week').startOf('week').toISOString();
      const endLastWeek = dayjs().subtract(1, 'week').endOf('week').toISOString();

      // helper to get a count with optional filters
      const count = async (filters: (q: any) => any) => {
        const { count } = await filters(
          supabase.from('order_details').select('id', { count: 'exact', head: true }),
        );
        return count ?? 0;
      };

      const [
        metricTotal,
        metricToday,
        metricCancelled,
        metricPending,
        totalLastWeek,
        todayLastWeek,
        cancelledLastWeek,
        pendingLastWeek,
      ] = await Promise.all([
        count(q => q), // total
        count(q => q.gte('created_at', startToday)),
        count(q => q.ilike('order_status', 'cancelled')),
        count(q => q.ilike('order_status', 'pending')),
        count(q => q.gte('created_at', startLastWeek).lte('created_at', endLastWeek)),
        // same day-of-week last week
        (() => {
          const s = dayjs().subtract(1, 'week').startOf('day').toISOString();
          const e = dayjs().subtract(1, 'week').endOf('day').toISOString();
          return count(q => q.gte('created_at', s).lte('created_at', e));
        })(),
        count(q =>
          q
            .ilike('order_status', 'cancelled')
            .gte('created_at', startLastWeek)
            .lte('created_at', endLastWeek),
        ),
        count(q =>
          q
            .ilike('order_status', 'pending')
            .gte('created_at', startLastWeek)
            .lte('created_at', endLastWeek),
        ),
      ]);

      // sparkline – last 7 days
      const start7 = dayjs().subtract(6, 'day').startOf('day').toISOString();
      const { data: last7 } = await supabase
        .from('order_details')
        .select('created_at')
        .gte('created_at', start7);

      const buckets: Record<string, number> = {};
      for (let i = 6; i >= 0; i--) {
        buckets[dayjs().subtract(i, 'day').format('YYYY-MM-DD')] = 0;
      }
      last7?.forEach(o => {
        const d = dayjs(o.created_at).format('YYYY-MM-DD');
        if (buckets[d] !== undefined) buckets[d]++;
      });

      setData({
        metricTotal,
        metricToday,
        metricCancelled,
        metricPending,
        totalLastWeek,
        todayLastWeek,
        cancelledLastWeek,
        pendingLastWeek,
        sparkDataTotal: Object.entries(buckets).map(([date, count]) => ({
          day: dayjs(date).format('ddd'),
          count,
        })),
      });
  }, [supabase]);

  useEffect(() => { refresh(); }, [refresh]);

  return { ...data, refresh };
}