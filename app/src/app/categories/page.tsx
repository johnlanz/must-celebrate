// app/categories/page.tsx
'use client'
import React from 'react'
import UniversalCrudList, { FieldDefinition } from '@/components/universal/UniversalCrudList'
import { Field as AddField } from '@/components/universal/UniversalFormModal'
import Sidebar from '@/components/layout/Sidebar'
import TopBar from '@/components/layout/Topbar'
import AccessControl from '@/components/AccessControl'

const displayFields: FieldDefinition[] = [
  { name: 'name', label: 'Name' },
  { name: 'description', label: 'Description' }
]
const addFields: AddField[] = [
  { name: 'name', label: 'Name', type: 'text', required: true },
  { name: 'description', label: 'Description', type: 'textarea' }
]
const updateFields = addFields

function CategoryPage() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar title="Categories" user={{ name: 'John Doe', profileImage: undefined }} />
        <main className="p-6 bg-white overflow-auto">
          <UniversalCrudList
            tableName="categories"
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

export default AccessControl(CategoryPage, { access: ['admin', 'staff'] })