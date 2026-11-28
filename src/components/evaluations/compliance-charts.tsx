'use client';

import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ComplianceChartsProps {
  distribution: Array<{ name: string; total: number; color: string }>;
  processes: Array<{ name: string; percentage: number }>;
}

export function ComplianceCharts({ distribution, processes }: ComplianceChartsProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader><CardTitle className="text-lg">Distribución de calificaciones</CardTitle></CardHeader>
        <CardContent>
          {distribution.some((entry) => entry.total > 0) && (
            <div className="h-56 min-w-0" aria-hidden="true">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={distribution} nameKey="name" dataKey="total" innerRadius="55%" outerRadius="90%" isAnimationActive={false}>
                    {distribution.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
          <ul className="space-y-1 text-sm">
            {distribution.map(({ name, total, color }) => (
              <li key={name} className="flex items-center gap-2">
                <span aria-hidden="true" className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
                {name}: {total}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      {processes.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-lg">Cumplimiento por proceso</CardTitle></CardHeader>
          <CardContent>
            <div className="h-56 min-w-0" aria-hidden="true">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={processes}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} unit="%" />
                  <Tooltip formatter={(percentage) => [`${percentage}%`, 'Cumplimiento']} />
                  <Bar dataKey="percentage" fill="hsl(var(--primary))" maxBarSize={64} isAnimationActive={false} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <ul className="space-y-1 text-sm">
              {processes.map(({ name, percentage }) => (
                <li key={name}>{name === 'GP' ? 'Gestión del Proyecto' : 'Implementación de Software'}: {percentage}%</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
