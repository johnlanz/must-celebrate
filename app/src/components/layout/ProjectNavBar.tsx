'use client'

import { useState, useEffect } from 'react'
import { List, LayoutGrid, LayoutList, Folder, Info } from 'lucide-react'
import UniversalAddModal, { Field as AddField } from '@/components/universal/UniversalFormModal'
import { createClient } from '@/utils/supabase/client'
import ProjectViewDetail from './ProjectViewDetail'
import { Button } from '../ui/button'

export default function ProjectNavBar({ onTaskAdded, project_id }: { onTaskAdded: () => void, project_id?: any }) {
  
  const [ownerId, setOwnerId] = useState('')
  const [project, setProject] = useState(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isAddOpen, setIsAddOpen] = useState(false)

  useEffect(() => {
    async function fetchSupabaseData() {
      const supabase = createClient()
      const userResponse = await supabase.auth.getUser()
      const userId = userResponse.data.user?.id || ''
      setOwnerId(userId)

      const { data: projectData } = await supabase
        .from('projects')
        .select()
        .eq('project_id', project_id)
        .maybeSingle()

      setProject(projectData || null)
      console.log('Project Data:', projectData)
    }
    fetchSupabaseData()
  }, [])

  return (
    <>
      <div className="border-b bg-white px-6 py-3 flex items-center justify-between">
        {/* Left: Breadcrumb */}
        <div>
          <div className="text-xs text-gray-400 mb-1">
            <span className="font-medium text-gray-600 text-lg">Agents Team</span> / {' '}
            <span className="font-medium text-lg text-gray-600">
              {project && project.name}
            </span>
          </div>
        </div>
        {/* Right: Actions */}
        <div className="flex items-center gap-2 text-sm">
          <Button onClick={() => setIsDetailOpen(true)} variant="outline">
            <Info className="w-4 h-4 mr-1" />
            View Project Info
          </Button>
          <Button size="sm" onClick={() => setIsAddOpen(true)}>
            + Add Task
          </Button>
        </div>
      </div>

      {/* Project Details Modal */}
      <ProjectViewDetail
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        projectId={project_id}
      />

      
    </>
  )
}

function TabLink({ icon, label, active = false }: { icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <div className={`flex items-center gap-1 px-2 py-1 rounded cursor-pointer ${
      active ? 'text-black border-b border-black' : 'hover:text-black text-gray-500'
    }`}>
      {icon}
      <span>{label}</span>
    </div>
  )
}