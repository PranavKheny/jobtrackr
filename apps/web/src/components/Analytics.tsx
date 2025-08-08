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
        const stats = await getJobStats()
        setStats(stats)
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
    <div>
      <h2>Analytics</h2>
      <div>
        <div>
          <h3>Total Applications</h3>
          <p>{stats.totalJobs}</p>
        </div>
        <div>
          <h3>Offer Rate</h3>
          <p>{stats.offerRate.toFixed(2)}%</p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
