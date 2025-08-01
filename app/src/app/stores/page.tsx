'use client'
import React from 'react'
import UniversalCrudList, { FieldDefinition } from '@/components/universal/UniversalCrudList'
import { Field as AddField } from '@/components/universal/UniversalFormModal'
import Sidebar from '@/components/layout/Sidebar'
import TopBar from '@/components/layout/Topbar'
import AccessControl from '@/components/AccessControl'

const displayFields: FieldDefinition[] = [
  { name: 'name', label: 'Name' },
  { name: 'description', label: 'Description' },
  { name: 'address_line_1', label: 'Address Line 1' },
  { name: 'address_line_2', label: 'Address Line 2' },
  { name: 'country', label: 'Country' },
  { name: 'city', label: 'City' },
  { name: 'postal_code', label: 'Postal Code' },
  { name: 'phone_number', label: 'Phone Number' },
  { name: 'email', label: 'Email' },
  { name: 'store_hours', label: 'Store Hours' },
]

const addFields: AddField[] = [
  { name: 'name', label: 'Name', type: 'text', required: true },
  { name: 'description', label: 'Description', type: 'textarea' },
  { name: 'address_line_1', label: 'Address Line 1', type: 'text' },
  { name: 'address_line_2', label: 'Address Line 2', type: 'text' },
  { name: 'country', label: 'Country', type: 'text' },
  { name: 'city', label: 'City', type: 'text' },
  { name: 'postal_code', label: 'Postal Code', type: 'text' },
  { name: 'phone_number', label: 'Phone Number', type: 'text' },
  { name: 'email', label: 'Email', type: 'text' },
  { name: 'store_hours', label: 'Store Hours', type: 'text' }
]

const updateFields = addFields

function StorePage() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar title="Stores" user={{ name: 'John Doe', profileImage: undefined }} />
        <main className="p-6 bg-white overflow-auto">
          <UniversalCrudList
            tableName="stores"
            primaryKey="id"
            fields={displayFields}
            addFields={addFields}
            updateFields={updateFields}
          />
        </main>
      </div>
    </div>
  )
}

export default AccessControl(StorePage, { access: ['admin', 'staff'] })