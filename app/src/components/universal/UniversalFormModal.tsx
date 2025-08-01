'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { ColorSelect } from '@/components/universal/ColorSelect'

export interface Option {
  value: string
  label: string
}

export interface Field {
  name: string
  label: string
  type:
    | 'text'
    | 'textarea'
    | 'number'
    | 'hidden'
    | 'select'
    | 'color-select'
    | 'checkbox'
    | 'date'
    | 'file'
  required?: boolean
  value?: any
  options?: Option[]
  onChangeCallback?: (newValue: any) => void
}

export interface UniversalFormModalProps {
  title: string
  tableName: string
  fields: Field[]
  primaryKey?: string
  recordId?: string | number
  initialValues?: Record<string, any>
  onSuccess?: () => void
  triggerText?: string
}

export default function UniversalFormModal({
  title,
  tableName,
  fields,
  primaryKey,
  recordId,
  initialValues = {},
  onSuccess,
  triggerText = 'Submit',
}: UniversalFormModalProps) {
  const [open, setOpen] = useState(false)
  const [formValues, setFormValues] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Initialize or reset form when dialog opens
  useEffect(() => {
    if (open) {
      if (recordId !== undefined) {
        setFormValues({ ...initialValues })
      } else {
        setFormValues({})
      }
    }
  }, [open])

  const handleOpenChange = (isOpen: boolean) => {
    setError('')
    setOpen(isOpen)
  }

  const handleChange = (name: string, value: any) => {
    setFormValues((prev) => ({ ...prev, [name]: value }))
  }

  // Supabase insert/update
  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    const supabase = createClient()
    try {
      let resError: any
      if (recordId !== undefined && primaryKey) {
        ;({ error: resError } = await supabase
          .from(tableName)
          .update(formValues)
          .eq(primaryKey, recordId))
      } else {
        ;({ error: resError } = await supabase
          .from(tableName)
          .insert([formValues]))
      }
      if (resError) throw resError
      setOpen(false)
      onSuccess?.()
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  // Helper for file upload
  const uploadFileAndGetUrl = async (file: File, fieldName: string): Promise<string> => {
    const supabase = createClient()
    const bucketName = 'covers'
    const ext = file.name.split('.').pop()
    const fileName = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`
    const filePath = `${fieldName}/${fileName}`
    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file)
    if (uploadError) throw uploadError
    const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath)
    if (!data?.publicUrl) throw new Error('Failed to get public URL')
    return data.publicUrl
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          {triggerText}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          {fields.map((field) => {
            const val = formValues[field.name] ?? field.value ?? ''
            switch (field.type) {
              case 'hidden':
                return (
                  <input
                    key={field.name}
                    type="hidden"
                    name={field.name}
                    value={val}
                  />
                )
              case 'text':
              case 'number':
              case 'date':
                return (
                  <div key={field.name}>
                    <Label htmlFor={field.name} className="pb-2">
                      {field.label}
                    </Label>
                    <Input
                      id={field.name}
                      type={field.type}
                      value={val}
                      required={field.required}
                      onChange={(e) =>
                        handleChange(field.name, e.target.value)
                      }
                    />
                  </div>
                )
              case 'textarea':
                return (
                  <div key={field.name}>
                    <Label htmlFor={field.name} className="pb-2">
                      {field.label}
                    </Label>
                    <Textarea
                      id={field.name}
                      value={val}
                      required={field.required}
                      onChange={(e) =>
                        handleChange(field.name, e.target.value)
                      }
                    />
                  </div>
                )
              case 'select':
                return (
                  <div key={field.name}>
                    <Label htmlFor={field.name} className="pb-2">
                      {field.label}
                    </Label>
                    <Select
                      value={val}
                      onValueChange={(v) => {
                        handleChange(field.name, v)
                        field.onChangeCallback?.(v)
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={`Select ${field.label}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options?.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )
              case 'checkbox':
                return (
                  <div
                    key={field.name}
                    className="flex items-center space-x-2"
                  >
                    <input
                      id={field.name}
                      type="checkbox"
                      checked={!!val}
                      onChange={(e) =>
                        handleChange(field.name, e.target.checked)
                      }
                      className="h-4 w-4 rounded"
                    />
                    <Label htmlFor={field.name}>{field.label}</Label>
                  </div>
                )
              case 'color-select':
                return (
                  <div key={field.name}>
                    <Label htmlFor={field.name} className="pb-2">
                      {field.label}
                    </Label>
                    <ColorSelect
                      value={val}
                      onChange={(v) => handleChange(field.name, v)}
                    />
                  </div>
                )
              case 'file':
                return (
                  <div key={field.name}>
                    <Label htmlFor={field.name} className="pb-2">
                      {field.label}
                    </Label>
                    <input
                      id={field.name}
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0]
                        if (!file) return
                        setError('')
                        setLoading(true)
                        try {
                          const publicUrl = await uploadFileAndGetUrl(
                            file,
                            field.name
                          )
                          handleChange(field.name, publicUrl)
                          field.onChangeCallback?.(publicUrl)
                        } catch (uploadErr: any) {
                          console.error(uploadErr)
                          setError(uploadErr.message || 'Upload failed')
                        } finally {
                          setLoading(false)
                        }
                      }}
                    />
                    {formValues[field.name] &&
                      typeof formValues[field.name] === 'string' && (
                        <img
                          src={formValues[field.name]}
                          alt="Preview"
                          className="mt-2 h-24 w-24 object-cover rounded"
                        />
                      )}
                  </div>
                )
              default:
                return null
            }
          })}
          {error && <p className="text-destructive">{error}</p>}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Processing...' : 'Submit'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
