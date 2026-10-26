"use client"

import { useState, type FormEvent } from "react"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  CLIENT_STATUSES,
  STATUS_LABELS,
  type ClientInput,
  type ClientStatus,
} from "@/lib/clients"

type FormValues = {
  name: string
  company: string
  email: string
  status: ClientStatus
  contractValue: string
  startDate: string
}

type FormErrors = Partial<Record<keyof FormValues, string>>

const statusItems = CLIENT_STATUSES.map((status) => ({
  value: status,
  label: STATUS_LABELS[status],
}))

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function today() {
  const now = new Date()
  const mm = String(now.getMonth() + 1).padStart(2, "0")
  const dd = String(now.getDate()).padStart(2, "0")
  return `${now.getFullYear()}-${mm}-${dd}`
}

function toFormValues(client?: ClientInput): FormValues {
  return {
    name: client?.name ?? "",
    company: client?.company ?? "",
    email: client?.email ?? "",
    status: client?.status ?? "active",
    contractValue: client ? String(client.contractValue) : "",
    // Empty for new clients; filled with today's date on submit. Computing
    // it here would bake the build date into the prerendered page.
    startDate: client?.startDate ?? "",
  }
}

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {}
  if (!values.name.trim()) errors.name = "Name is required."
  if (!values.company.trim()) errors.company = "Company is required."
  if (!values.email.trim()) errors.email = "Email is required."
  else if (!EMAIL_PATTERN.test(values.email.trim()))
    errors.email = "Enter a valid email address."
  const value = Number(values.contractValue)
  if (values.contractValue.trim() === "") {
    errors.contractValue = "Contract value is required."
  } else if (!Number.isFinite(value) || value < 0) {
    errors.contractValue = "Enter a positive number."
  }
  return errors
}

export function ClientForm({
  defaultValues,
  submitLabel = "Save client",
  onSubmit,
  onCancel,
}: {
  defaultValues?: ClientInput
  submitLabel?: string
  onSubmit: (values: ClientInput) => void
  onCancel?: () => void
}) {
  const [values, setValues] = useState(() => toFormValues(defaultValues))
  const [errors, setErrors] = useState<FormErrors>({})

  function setField<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }))
    if (errors[key]) setErrors((current) => ({ ...current, [key]: undefined }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validate(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return
    onSubmit({
      name: values.name.trim(),
      company: values.company.trim(),
      email: values.email.trim(),
      status: values.status,
      contractValue: Math.round(Number(values.contractValue)),
      startDate: values.startDate || today(),
    })
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      <FieldGroup className="grid gap-5 sm:grid-cols-2">
        <Field data-invalid={!!errors.name}>
          <FieldLabel htmlFor="client-name">Name</FieldLabel>
          <Input
            id="client-name"
            autoComplete="name"
            value={values.name}
            aria-invalid={!!errors.name}
            onChange={(event) => setField("name", event.target.value)}
          />
          <FieldError>{errors.name}</FieldError>
        </Field>

        <Field data-invalid={!!errors.company}>
          <FieldLabel htmlFor="client-company">Company</FieldLabel>
          <Input
            id="client-company"
            autoComplete="organization"
            value={values.company}
            aria-invalid={!!errors.company}
            onChange={(event) => setField("company", event.target.value)}
          />
          <FieldError>{errors.company}</FieldError>
        </Field>

        <Field data-invalid={!!errors.email}>
          <FieldLabel htmlFor="client-email">Email</FieldLabel>
          <Input
            id="client-email"
            type="email"
            autoComplete="email"
            value={values.email}
            aria-invalid={!!errors.email}
            onChange={(event) => setField("email", event.target.value)}
          />
          <FieldError>{errors.email}</FieldError>
        </Field>

        <Field>
          <FieldLabel htmlFor="client-status">Status</FieldLabel>
          <Select
            items={statusItems}
            value={values.status}
            onValueChange={(value) => {
              if (value) setField("status", value as ClientStatus)
            }}
          >
            <SelectTrigger id="client-status" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statusItems.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field data-invalid={!!errors.contractValue}>
          <FieldLabel htmlFor="client-contract-value">
            Contract value (USD / year)
          </FieldLabel>
          <Input
            id="client-contract-value"
            type="number"
            inputMode="numeric"
            min={0}
            step={1}
            value={values.contractValue}
            aria-invalid={!!errors.contractValue}
            onChange={(event) => setField("contractValue", event.target.value)}
          />
          <FieldError>{errors.contractValue}</FieldError>
        </Field>

        <Field>
          <FieldLabel htmlFor="client-start-date">Start date</FieldLabel>
          <Input
            id="client-start-date"
            type="date"
            value={values.startDate}
            onChange={(event) => setField("startDate", event.target.value)}
          />
          {defaultValues ? null : (
            <FieldDescription>Leave empty to use today.</FieldDescription>
          )}
        </Field>
      </FieldGroup>

      <div className="flex justify-end gap-2">
        {onCancel ? (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        ) : null}
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  )
}
