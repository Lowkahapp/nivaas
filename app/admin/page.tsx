"use client"

import { useEffect, useState } from "react"
import { BarChart3, Home, Users, AlertCircle, CheckCircle2, Clock, Eye, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DashboardStats {
  pending_properties: number
  live_properties: number
  new_requests: number
  total_views: number
}

interface Property {
  id: number
  society_name: string
  bhk: number
  rent: number
  status: string
  field_verified: boolean
  created_at: string
}

interface VisitRequest {
  id: number
  property_id: number
  tenant_name: string
  tenant_phone: string
  status: string
  preferred_date: string
  society_name: string
  created_at: string
}

export default function AdminPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [properties, setProperties] = useState<Property[]>([])
  const [requests, setRequests] = useState<VisitRequest[]>([])
  const [activeTab, setActiveTab] = useState<"overview" | "properties" | "requests">("overview")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [adminKey, setAdminKey] = useState("")
  const [keyInput, setKeyInput] = useState("")
  const [loginError, setLoginError] = useState("")

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

  const authHeaders = {
    "Content-Type": "application/json",
    "x-admin-key": adminKey,
  }

  useEffect(() => {
    if (adminKey) loadData()
  }, [adminKey])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoginError("")
    // Quick pre-check: attempt to hit a protected endpoint
    const res = await fetch(`${apiUrl}/api/stats`, {
      headers: { "x-admin-key": keyInput },
    })
    if (res.ok) {
      setAdminKey(keyInput)
    } else {
      setLoginError("Invalid admin key. Please try again.")
    }
  }

  if (!adminKey) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
        <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 shadow-sm">
          <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary mx-auto">
            <Lock className="size-6" />
          </div>
          <h1 className="mt-4 text-center font-heading text-xl font-bold text-foreground">Admin Login</h1>
          <p className="mt-1 text-center text-sm text-muted-foreground">Enter your admin key to continue</p>
          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <input
              type="password"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="Admin key"
              required
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40"
            />
            {loginError && <p className="text-xs text-red-600">{loginError}</p>}
            <Button type="submit" className="w-full">Sign in</Button>
          </form>
        </div>
      </div>
    )
  }

  async function loadData() {
    try {
      setLoading(true)
      setError("")

      const [statsRes, propsRes, reqsRes] = await Promise.all([
        fetch(`${apiUrl}/api/stats`, { headers: authHeaders }),
        fetch(`${apiUrl}/api/properties?status=pending`, { headers: authHeaders }),
        fetch(`${apiUrl}/api/visit-requests?status=new`, { headers: authHeaders }),
      ])

      if (!statsRes.ok || !propsRes.ok || !reqsRes.ok) throw new Error("Failed to load data")

      const statsData = await statsRes.json()
      const propsData = await propsRes.json()
      const reqsData = await reqsRes.json()

      setStats(statsData)
      setProperties(propsData.data ?? propsData)
      setRequests(reqsData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load dashboard")
    } finally {
      setLoading(false)
    }
  }

  async function approveProperty(id: number) {
    try {
      const response = await fetch(`${apiUrl}/api/properties/${id}`, {
        method: "PATCH",
        headers: authHeaders,
        body: JSON.stringify({ status: "live", field_verified: true }),
      })
      if (!response.ok) throw new Error("Failed to approve")
      loadData()
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error approving property")
    }
  }

  async function rejectProperty(id: number) {
    try {
      const response = await fetch(`${apiUrl}/api/properties/${id}`, {
        method: "PATCH",
        headers: authHeaders,
        body: JSON.stringify({ status: "rejected" }),
      })
      if (!response.ok) throw new Error("Failed to reject")
      loadData()
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error rejecting property")
    }
  }

  async function updateRequestStatus(id: number, status: string) {
    try {
      const response = await fetch(`${apiUrl}/api/visit-requests/${id}`, {
        method: "PATCH",
        headers: authHeaders,
        body: JSON.stringify({ status }),
      })
      if (!response.ok) throw new Error("Failed to update")
      loadData()
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error updating request")
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="size-12 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="border-b border-border bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl font-bold text-foreground">Nivaas Admin</h1>
            <p className="text-sm text-muted-foreground">Manage properties and tenant leads</p>
          </div>
          <Button variant="outline" onClick={loadData}>
            Refresh
          </Button>
        </div>
      </div>

      {error && (
        <div className="m-6 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
          <AlertCircle className="size-5 text-red-600" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-border bg-card">
        <div className="flex gap-8 px-6">
          {[
            { id: "overview", label: "Overview", icon: BarChart3 },
            { id: "properties", label: "Properties", icon: Home },
            { id: "requests", label: "Lead Requests", icon: Users },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as typeof activeTab)}
              className={`flex items-center gap-2 border-b-2 px-0 py-4 font-medium transition-colors ${
                activeTab === id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="size-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {/* OVERVIEW TAB */}
        {activeTab === "overview" && stats && (
          <div className="grid gap-6 md:grid-cols-4">
            {[
              { label: "Pending Properties", value: stats.pending_properties, icon: Clock, color: "text-yellow-600" },
              { label: "Live Properties", value: stats.live_properties, icon: CheckCircle2, color: "text-green-600" },
              { label: "New Lead Requests", value: stats.new_requests, icon: Users, color: "text-blue-600" },
              { label: "Total Views", value: stats.total_views, icon: Eye, color: "text-purple-600" },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="rounded-2xl border border-border bg-card p-6">
                <div className={`inline-flex rounded-lg bg-primary/10 p-3 ${color}`}>
                  <Icon className="size-6" />
                </div>
                <p className="mt-3 text-sm font-medium text-muted-foreground">{label}</p>
                <p className="mt-1 font-heading text-3xl font-bold text-foreground">{value}</p>
              </div>
            ))}
          </div>
        )}

        {/* PROPERTIES TAB */}
        {activeTab === "properties" && (
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Society</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">BHK</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Rent</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {properties.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                      No pending properties
                    </td>
                  </tr>
                ) : (
                  properties.map((prop) => (
                    <tr key={prop.id} className="hover:bg-muted/30">
                      <td className="px-6 py-4 font-medium text-foreground">{prop.society_name}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{prop.bhk} BHK</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">₹{prop.rent.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            prop.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {prop.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs"
                            onClick={() => approveProperty(prop.id)}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs text-red-600 hover:text-red-700"
                            onClick={() => rejectProperty(prop.id)}
                          >
                            Reject
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* REQUESTS TAB */}
        {activeTab === "requests" && (
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Property</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Tenant</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Phone</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Preferred Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {requests.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                      No new lead requests
                    </td>
                  </tr>
                ) : (
                  requests.map((req) => (
                    <tr key={req.id} className="hover:bg-muted/30">
                      <td className="px-6 py-4 font-medium text-foreground text-sm">{req.society_name}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{req.tenant_name}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{req.tenant_phone}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {req.preferred_date || "Not specified"}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            req.status === "new"
                              ? "bg-blue-100 text-blue-800"
                              : req.status === "contacted"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {req.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs"
                            onClick={() => updateRequestStatus(req.id, "contacted")}
                          >
                            Mark Contacted
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs"
                            onClick={() => updateRequestStatus(req.id, "visit_scheduled")}
                          >
                            Visit Scheduled
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
