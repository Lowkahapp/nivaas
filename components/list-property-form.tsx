"use client"

import { useState } from "react"
import { CheckCircle2, Upload, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

const FURNISHING = ["Fully Furnished", "Semi Furnished", "Unfurnished"]
const BHK = ["1 BHK", "2 BHK", "3 BHK", "4 BHK"]

export function ListPropertyForm() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [uploadProgress, setUploadProgress] = useState("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")
    setUploadProgress("")

    try {
      const form = e.currentTarget
      const data = Object.fromEntries(new FormData(form)) as Record<string, string>
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

      // Upload media files first if any were selected
      const fileInput = form.querySelector<HTMLInputElement>('input[name="media"]')
      let imageUrls: string[] = []
      if (fileInput?.files && fileInput.files.length > 0) {
        setUploadProgress("Uploading photos…")
        const fd = new FormData()
        Array.from(fileInput.files).forEach((f) => fd.append("files", f))
        const uploadRes = await fetch(`${apiUrl}/api/upload`, { method: "POST", body: fd })
        if (uploadRes.ok) {
          const uploaded = await uploadRes.json()
          imageUrls = uploaded.urls
        }
        setUploadProgress("")
      }

      const response = await fetch(`${apiUrl}/api/properties`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, images: JSON.stringify(imageUrls) }),
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error || "Failed to submit property")
      }

      setSubmitted(true)
      window.scrollTo({ top: 0, behavior: "smooth" })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-primary/30 bg-primary/5 px-6 py-12 text-center">
        <CheckCircle2 className="size-10 text-primary" />
        <h2 className="mt-3 font-heading text-xl font-bold text-foreground">Submission received</h2>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          Thanks for listing with Nivaas. Our verification team will call you within 24 hours to
          schedule a field inspection of your flat.
        </p>
        <Button className="mt-6" onClick={() => setSubmitted(false)}>
          List another flat
        </Button>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-red-200 bg-red-50 px-6 py-12 text-center">
        <AlertCircle className="size-10 text-red-600" />
        <h2 className="mt-3 font-heading text-xl font-bold text-red-900">Submission failed</h2>
        <p className="mt-2 max-w-md text-sm text-red-800">{error}</p>
        <Button variant="outline" className="mt-6" onClick={() => setError("")}>
          Try again
        </Button>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-2xl border border-border bg-card p-6 shadow-sm"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Your name" name="ownerName" placeholder="e.g. Rakesh Menon" />
        <Field label="Mobile number" name="phone" type="tel" placeholder="+91 90000 00000" />
      </div>

      <Field
        label="Society / building name"
        name="society"
        placeholder="e.g. Megapolis Sangria Towers"
      />

      <div className="grid gap-5 sm:grid-cols-3">
        <Field label="Locality" name="locality" placeholder="e.g. Hinjewadi Phase 3" />
        <Field label="City" name="city" placeholder="e.g. Pune" />
        <Field label="Pincode" name="pincode" placeholder="e.g. 411057" />
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <SelectField label="Configuration" name="bhk" options={BHK} />
        <SelectField label="Furnishing" name="furnishing" options={FURNISHING} />
        <Field label="Carpet area (sqft)" name="area" type="number" placeholder="1050" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Expected rent (₹/month)" name="rent" type="number" placeholder="30000" />
        <Field label="Deposit (₹)" name="deposit" type="number" placeholder="90000" />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">
          Photos & video walkthrough
        </label>
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-background px-4 py-8 text-center">
          <Upload className="size-6 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">
            Drag photos here, or share them on WhatsApp after you submit
          </p>
          <input type="file" name="media" multiple accept="image/*,video/*" className="mt-3 text-sm text-muted-foreground" />
        </div>
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={loading}>
        {uploadProgress || (loading ? "Submitting..." : "Submit for verification")}
      </Button>
      <p className="text-center text-xs text-muted-foreground">
        Free to list. We only earn when your flat is successfully rented.
      </p>
    </form>
  )
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
}: {
  label: string
  name: string
  type?: string
  placeholder?: string
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-foreground">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required
        placeholder={placeholder}
        className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40"
      />
    </div>
  )
}

function SelectField({
  label,
  name,
  options,
}: {
  label: string
  name: string
  options: string[]
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-foreground">
        {label}
      </label>
      <select
        id={name}
        name={name}
        required
        defaultValue=""
        className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/40"
      >
        <option value="" disabled>
          Select
        </option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  )
}
