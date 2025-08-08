'use client'

import { useEffect, useState } from 'react'
import { getJobStats } from '@/lib/api'
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function Analytics() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const statsData = await getJobStats()
        setStats(statsData)
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) {
    return <p>Loading analytics...</p>
  }

  if (!stats) {
    return <p>Could not load analytics.</p>
  }

  const chartData = stats.stats.map((s: any) => ({
    name: s.status,
    count: s._count.status,
  }))

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <div className="p-4 bg-card rounded-lg border">
        <h3 className="text-sm font-medium text-muted-foreground">Total Applications</h3>
        <p className="text-3xl font-bold">{stats.totalJobs}</p>
      </div>
      <div className="p-4 bg-card rounded-lg border">
        <h3 className="text-sm font-medium text-muted-foreground">Offer Rate</h3>
        <p className="text-3xl font-bold">{stats.offerRate.toFixed(2)}%</p>
      </div>
      <div className="md:col-span-2 lg:col-span-2 p-4 bg-card rounded-lg border">
        <h3 className="text-sm font-medium text-muted-foreground">Jobs by Status</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip />
            <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
