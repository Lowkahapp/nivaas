"use client"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Phone, Mail, MapPin, Clock, CheckCircle2 } from "lucide-react"
import { useState } from "react"

const contactDetails = [
  {
    icon: Phone,
    label: "Phone",
    value: "+91 88880 00000",
    sub: "Mon–Sat, 9 am – 8 pm",
    href: "tel:+918888000000",
  },
  {
    icon: Mail,
    label: "Email",
    value: "hello@nivaas.in",
    sub: "We reply within 4 hours",
    href: "mailto:hello@nivaas.in",
  },
  {
    icon: MapPin,
    label: "Office",
    value: "Hinjewadi Phase 1, Pune",
    sub: "Maharashtra – 411057",
    href: null,
  },
  {
    icon: Clock,
    label: "Support hours",
    value: "24/7 for active tenants",
    sub: "Via WhatsApp or call",
    href: null,
  },
]

export default function ContactPage() {
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    // Simulate send — replace with real API call or Formspree/Resend
    await new Promise((r) => setTimeout(r, 1000))
    setLoading(false)
    setSent(true)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero */}
        <section className="border-b border-border bg-primary px-4 py-20 text-center sm:px-6 lg:px-8">
          <h1 className="font-heading text-4xl font-extrabold tracking-tight text-primary-foreground sm:text-5xl">
            Contact us
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-primary-foreground/85">
            Whether you're a tenant with a question, a landlord looking to list, or just curious — we're easy to reach.
          </p>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Contact details */}
            <div>
              <h2 className="font-heading text-xl font-bold text-foreground">Get in touch</h2>
              <div className="mt-8 space-y-6">
                {contactDetails.map((item) => (
                  <div key={item.label} className="flex items-start gap-4">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <item.icon className="size-5" />
                    </span>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{item.label}</p>
                      {item.href ? (
                        <a href={item.href} className="mt-0.5 font-medium text-foreground hover:text-primary">
                          {item.value}
                        </a>
                      ) : (
                        <p className="mt-0.5 font-medium text-foreground">{item.value}</p>
                      )}
                      <p className="text-sm text-muted-foreground">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact form */}
            <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
              {sent ? (
                <div className="flex flex-col items-center py-8 text-center">
                  <CheckCircle2 className="size-10 text-primary" />
                  <h3 className="mt-4 font-heading text-xl font-bold text-foreground">Message sent!</h3>
                  <p className="mt-2 text-muted-foreground">We'll get back to you within 4 hours.</p>
                </div>
              ) : (
                <>
                  <h2 className="font-heading text-xl font-bold text-foreground">Send a message</h2>
                  <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-foreground">Name</label>
                        <input
                          type="text"
                          required
                          placeholder="Your name"
                          className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-foreground">Phone</label>
                        <input
                          type="tel"
                          placeholder="+91 90000 00000"
                          className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-foreground">Email</label>
                      <input
                        type="email"
                        required
                        placeholder="you@example.com"
                        className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-foreground">I am a</label>
                      <select
                        required
                        defaultValue=""
                        className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/40"
                      >
                        <option value="" disabled>Select</option>
                        <option>Tenant looking for a flat</option>
                        <option>Landlord looking to list</option>
                        <option>Corporate / bulk enquiry</option>
                        <option>Media / press</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-foreground">Message</label>
                      <textarea
                        required
                        rows={4}
                        placeholder="How can we help you?"
                        className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
                    >
                      {loading ? "Sending…" : "Send message"}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
