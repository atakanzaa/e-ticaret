import React, { useEffect, useMemo, useState } from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import { useApp } from '../context/AppContext';
import { api } from '../api/client';
import { Box, Card, CardContent, CardHeader, Typography, TextField, Button } from '@mui/material';
// Use Box-based CSS grid to avoid Grid type issues
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

type Seller = { id: string; name: string; storeName?: string; status?: string };

const AdminDashboardInner: React.FC = () => {
  const { state } = useApp();
  const isAdmin = useMemo(() => state.user?.role === 'admin', [state.user]);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [ordersDaily, setOrdersDaily] = useState<Array<{ date: string; count: number }>>([]);
  const [profitDaily, setProfitDaily] = useState<Array<{ date: string; profit: number }>>([]);
  const [range, setRange] = useState<{ from: string; to: string }>(() => {
    const to = new Date();
    const from = new Date();
    from.setDate(to.getDate() - 7);
    const fmt = (d: Date) => d.toISOString().slice(0, 10);
    return { from: fmt(from), to: fmt(to) };
  });

  useEffect(() => {
    if (!isAdmin) return;
    const load = async () => {
      const [sl, od, pd] = await Promise.all([
        api.listActiveSellers().catch(() => []),
        api.ordersDaily(range.from, range.to).catch(() => []),
        api.profitDaily(range.from, range.to).catch(() => []),
      ]);
      setSellers(sl);
      setOrdersDaily(od);
      setProfitDaily(pd);
    };
    load();
  }, [isAdmin, range.from, range.to]);

  const reload = (e: React.FormEvent) => {
    e.preventDefault();
    setRange({ ...range });
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
        <Box sx={{ gridColumn: '1 / -1' }}>
          <Card>
            <CardHeader title="Admin Analytics" />
            <CardContent>
              <Box component="form" onSubmit={reload} sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <TextField type="date" label="From" InputLabelProps={{ shrink: true }} value={range.from} onChange={(e) => setRange({ ...range, from: e.target.value })} />
                <TextField type="date" label="To" InputLabelProps={{ shrink: true }} value={range.to} onChange={(e) => setRange({ ...range, to: e.target.value })} />
                <Button type="submit" variant="contained">Apply</Button>
              </Box>
            </CardContent>
          </Card>
        </Box>

        <Box>
          <Card>
            <CardHeader title="Daily Orders" />
            <CardContent>
              <Box sx={{ height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={ordersDaily} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" stroke="#1976d2" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Box>

        <Box>
          <Card>
            <CardHeader title="Daily Profit" />
            <CardContent>
              <Box sx={{ height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={profitDaily} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="profit" stroke="#2e7d32" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ gridColumn: '1 / -1' }}>
          <Card>
            <CardHeader title="Active Sellers" />
            <CardContent>
              <Box sx={{ display: 'grid', gap: 1 }}>
                {sellers.map((s) => (
                  <Typography key={s.id}>{s.storeName || s.name} • {s.status || 'ACTIVE'}</Typography>
                ))}
                {sellers.length === 0 && <Typography variant="body2" color="text.secondary">No active sellers.</Typography>}
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

const AdminDashboard: React.FC = () => (
  <ProtectedRoute roles={['admin']}>
    <AdminDashboardInner />
  </ProtectedRoute>
);

export default AdminDashboard;


