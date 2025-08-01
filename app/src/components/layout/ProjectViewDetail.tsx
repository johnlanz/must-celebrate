import { useEffect, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog'
import { createClient } from '@/utils/supabase/client'

export default function ProjectViewDetail({
    isOpen,
    onClose,
    projectId
}: {
    isOpen: boolean
    onClose: () => void
    projectId: number
}) {
    const [ownerId, setOwnerId] = useState('')
    const [projects, setProjects] = useState<{ project_id: number; name: string; description?: string }[]>([])
    const [activeProjectId, setActiveProjectId] = useState<number | null>(null)
    const [projectFields, setProjectFields] = useState<any[]>([])
    const [teamMembers, setTeamMembers] = useState<any[]>([])
    const [tasks, setTasks] = useState<any[]>([])

    const supabase = createClient()

    // Get current user
    useEffect(() => {
        async function getUser() {
            const {
                data: { user },
            } = await supabase.auth.getUser()
            if (user) setOwnerId(user.id)
        }

        getUser()
    }, [])

    // Fetch projects
    useEffect(() => {
        async function fetchProjects() {
            const { data, error } = await supabase.from('projects').select('project_id, name, description')
            if (error) {
                console.error('Error fetching projects:', error)
            } else {
                setProjects(data)
                if (data.length > 0) setActiveProjectId(data[0].project_id)
            }
        }

        fetchProjects()
    }, [])

    // Fetch team members & tasks when projectId changes
    useEffect(() => {
        async function fetchTeamMembersAndTasks() {
            if (!projectId) return

            // Step 1: Get team_id from project
            const { data: projectData, error: projectError } = await supabase
                .from('projects')
                .select('team_id')
                .eq('project_id', projectId)
                .single()

            if (projectError || !projectData?.team_id) {
                console.error('Error fetching team_id:', projectError)
                return
            }

            const teamId = projectData.team_id

            // Step 2: Fetch team members
            const { data: members, error: teamError } = await supabase
                .from('teammembers')
                .select('user_id, role, auth:users(email)')
                .eq('team_id', teamId)

            if (teamError) {
                console.error('Error fetching team members:', teamError)
            } else {
                setTeamMembers(members)
            }

            // Step 3: Fetch tasks
            const { data: taskData, error: taskError } = await supabase
                .from('tasks') // Replace with your actual table name
                .select('task_id, title, completed_date, assignee_id')
                .eq('project_id', projectId)
                .order('completed_date', { ascending: false })

            if (taskError) {
                console.error('Error fetching tasks:', taskError)
            } else {
                setTasks(taskData)
            }
        }

        fetchTeamMembersAndTasks()
    }, [projectId])

    function formatDate(dateString: string) {
        const date = new Date(dateString)
        return date.toLocaleString()
    }

    const currentProject = projects.find(p => p.project_id === activeProjectId)

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-5xl flex flex-col md:flex-row gap-6" style={{ width: '66.6667vw', maxWidth: 'none' }}>
                {/* Left Section */}
                <div className="flex-1">
                    <p className="text-lg capitalize font-semibold ">
                        {currentProject?.name || 'Project'}
                    </p>

                    {/* Project Outline */}
                    <div className="mt-4">
                        <h3 className="text-sm font-semibold text-gray-700 mb-1">Project Outline</h3>
                        <p className="text-sm text-gray-500">
                            👋 Welcome everyone! This is how we’ll collaborate.
                            <br />
                            {currentProject?.description || 'No description provided.'} 🚀
                        </p>
                    </div>



                    {/* Project Members */}
                    <div className="mt-6">
                        <h3 className="text-sm font-semibold text-gray-700 mb-2">Project Members</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {/* Add Member Card */}
                            <div className="flex flex-col items-center justify-center border border-gray-300 rounded-md p-4 cursor-pointer hover:bg-gray-50">
                                <div className="w-10 h-10 rounded bg-[#67a626] flex items-center justify-center text-2xl text-white">
                                    +
                                </div>
                                <span className="mt-2 text-sm text-gray-600 font-medium">Add member</span>
                            </div>

                            {/* Members */}
                            {teamMembers.map((member) => {
                                const email = member.auth?.users?.email || 'unknown@email.com'
                                const name = email.split('@')[0].replace(/\./g, ' ') // Simulate name from email
                                const initials = name
                                    .split(' ')
                                    .slice(0, 2)
                                    .map((n) => n[0].toUpperCase())
                                    .join('')

                                const role = member.role || 'Member'
                                const isImageUser = false // Replace with actual condition if you allow user-uploaded avatars

                                return (
                                    <div
                                        key={member.user_id}
                                        className="flex items-center gap-3 p-3 rounded-md border hover:shadow-sm"
                                    >
                                        {/* Avatar */}
                                        {isImageUser ? (
                                            <img
                                                src="/path/to/avatar.jpg" // replace with dynamic URL
                                                alt="avatar"
                                                className="w-10 h-10 rounded-md object-cover"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 rounded-md bg-yellow-400 text-white flex items-center justify-center font-bold text-sm">
                                                {initials}
                                            </div>
                                        )}

                                        {/* Info */}
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900 truncate">{name}</p>
                                            <p className="text-xs text-indigo-500">
                                                {role}
                                                {/* Optional dropdown */}
                                                {role !== 'Owner' && <span className="ml-1">▼</span>}
                                            </p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                </div>

                {/* Right Sidebar - Completed Tasks */}
                <div className="w-full md:w-[300px] max-h-[500px] overflow-y-auto border-l pl-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Activity</h3>
                    <ul className="space-y-4 text-sm text-gray-600">
                        {tasks.map((task) => (
                            <li key={task.id}>
                                <span className="text-black font-medium">{task.completed_by || 'Unknown User'}</span>{' '}
                                completed task <span className="text-blue-600">"{task.name}"</span>
                                <br />
                                <span className="text-xs text-gray-400">{formatDate(task.completed_at)}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </DialogContent>
        </Dialog>
    )
}
