// components/UniversalUpdateModal.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Field } from './UniversalFormModal'

interface UniversalUpdateModalProps {
  title: string
  tableName: string
  recordId: number
  primaryKey: string // e.g. "team_id"
  initialValues: Record<string, any>
  fields: Field[]
  onSuccess?: () => void
  triggerText?: string
}

export default function UniversalUpdateModal({
  title,
  tableName,
  recordId,
  primaryKey,
  initialValues,
  fields,
  onSuccess,
  triggerText = 'Edit',
}: UniversalUpdateModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [formValues, setFormValues] = useState<Record<string, any>>(initialValues)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Sync initial values when modal opens or initialValues change
  useEffect(() => {
    setFormValues(initialValues)
  }, [initialValues])

  const openModal = () => setIsOpen(true)
  const closeModal = () => {
    setIsOpen(false)
    setError('')
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const supabase = await createClient()
      const { error } = await supabase
        .from(tableName)
        .update(formValues)
        .eq(primaryKey, recordId)
      if (error) {
        throw new Error(error.message)
      }
      closeModal()
      if (onSuccess) onSuccess()
    } catch (err: any) {
      setError(err.message || 'Error updating record')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={openModal}
        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
      >
        {triggerText}
      </button>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-md">
            <div className="p-4 border-b">
              <h2 className="text-xl font-semibold">{title}</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              {fields.map((field) => (
                <div key={field.name}>
                  <label
                    htmlFor={field.name}
                    className="block text-sm font-medium text-gray-700"
                  >
                    {field.label}
                  </label>
                  {field.type === 'textarea' ? (
                    <textarea
                      id={field.name}
                      name={field.name}
                      required={field.required}
                      value={formValues[field.name] || ''}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                    />
                  ) : (
                    <input
                      type={field.type}
                      id={field.name}
                      name={field.name}
                      required={field.required}
                      value={formValues[field.name] || ''}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                    />
                  )}
                </div>
              ))}
              {error && <p className="text-red-600">{error}</p>}
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  {loading ? 'Updating...' : 'Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}