// components/TaskUpdatePopup.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'

interface Task {
  task_id: number
  title: string
  description?: string
  due_date?: string
}

interface TaskComment {
  comment_id: number
  task_id: number
  user_id: string | null
  comment_text: string
  created_at: string
  updated_at: string
}

interface TaskUpdatePopupProps {
  task: Task
  onClose: () => void
  onTaskUpdated?: () => void
}

export default function TaskUpdatePopup({ task, onClose, onTaskUpdated }: TaskUpdatePopupProps) {
  // Setup local state for task fields
  const [formValues, setFormValues] = useState({
    title: task.title,
    description: task.description || '',
    // Format the due_date for datetime-local input: "YYYY-MM-DDTHH:MM"
    due_date: task.due_date ? task.due_date.slice(0, 16) : '',
  })
  const [updateLoading, setUpdateLoading] = useState(false)
  const [updateError, setUpdateError] = useState('')

  // Comments state
  const [comments, setComments] = useState<TaskComment[]>([])
  const [commentsLoading, setCommentsLoading] = useState(false)
  const [newComment, setNewComment] = useState('')

  // Fetch comments for this task
  const fetchComments = async () => {
    setCommentsLoading(true)
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('taskcomments')
      .select('*')
      .eq('task_id', task.task_id)
      .order('created_at', { ascending: true })
    if (error) {
      console.error(error)
    } else {
      setComments(data || [])
    }
    setCommentsLoading(false)
  }

  useEffect(() => {
    fetchComments()
  }, [task.task_id])

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value })
  }

  const handleTaskUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setUpdateLoading(true)
    setUpdateError('')
    try {
      const supabase = await createClient()
      const { error } = await supabase
        .from('tasks')
        .update(formValues)
        .eq('task_id', task.task_id)
      if (error) throw new Error(error.message)
      if (onTaskUpdated) onTaskUpdated()
      onClose()
    } catch (err: any) {
      setUpdateError(err.message || 'Error updating task')
    } finally {
      setUpdateLoading(false)
    }
  }

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return
    try {
      const supabase = await createClient()
      // Get current user id
      const { data: { user } } = await supabase.auth.getUser()
      const user_id = user?.id || null
      const { error } = await supabase
        .from('taskcomments')
        .insert({ task_id: task.task_id, comment_text: newComment, user_id })
      if (error) throw new Error(error.message)
      setNewComment('')
      fetchComments()
    } catch (err: any) {
      console.error(err)
    }
  }

  return (
    <div className="fixed inset-y-0 right-0 w-1/2 bg-white shadow-xl z-50 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-xl font-bold">Update Task</h2>
        <button onClick={onClose} className="text-gray-600 hover:text-gray-800">Close</button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Column: Update Form */}
        <div className="w-1/2 p-4 overflow-y-auto border-r">
          <form onSubmit={handleTaskUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                name="title"
                value={formValues.title}
                onChange={handleFieldChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                value={formValues.description}
                onChange={handleFieldChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Due Date</label>
              <input
                type="datetime-local"
                name="due_date"
                value={formValues.due_date}
                onChange={handleFieldChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            {updateError && <p className="text-red-600">{updateError}</p>}
            <button
              type="submit"
              disabled={updateLoading}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {updateLoading ? 'Updating...' : 'Update Task'}
            </button>
          </form>
        </div>

        {/* Right Column: Task Comments */}
        <div className="w-1/2 p-4 overflow-y-auto">
          <h3 className="text-lg font-bold mb-2">Comments</h3>
          {commentsLoading ? (
            <p>Loading comments...</p>
          ) : comments.length === 0 ? (
            <p>No comments yet.</p>
          ) : (
            <ul className="space-y-2">
              {comments.map((comment) => (
                <li key={comment.comment_id} className="p-2 border rounded text-sm">
                  {comment.comment_text}
                  <p className="text-gray-500 text-xs">
                    Posted on: {new Date(comment.created_at).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
          <form onSubmit={handleAddComment} className="mt-4">
            <textarea
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            ></textarea>
            <button
              type="submit"
              className="mt-2 w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Add Comment
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}