'use client'

import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Pencil, Save } from 'lucide-react'

interface Member {
  id: string
  name: string
  email: string
  role: string
  initials: string
  color: string
}

interface PortfolioViewModalProps {
  isOpen: boolean
  onClose: () => void
  portfolioName: string
  description?: string
  members: Member[]
  onSavePortfolio?: (name: string, description: string) => void
  onUpdateMemberRole?: (memberId: string, newRole: string) => void
}

const PortfolioViewModal: React.FC<PortfolioViewModalProps> = ({
  isOpen,
  onClose,
  portfolioName,
  description,
  members,
  onSavePortfolio,
  onUpdateMemberRole,
}) => {
  const [editMode, setEditMode] = useState(false)
  const [name, setName] = useState(portfolioName)
  const [desc, setDesc] = useState(description || '')
  const [roleEdits, setRoleEdits] = useState<Record<string, string>>({})

  const handleSavePortfolio = () => {
    onSavePortfolio?.(name, desc)
    setEditMode(false)
  }

  const handleRoleChange = (memberId: string, newRole: string) => {
    setRoleEdits((prev) => ({ ...prev, [memberId]: newRole }))
    onUpdateMemberRole?.(memberId, newRole)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle>
              {editMode ? (
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="text-lg font-bold"
                />
              ) : (
                name
              )}
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => (editMode ? handleSavePortfolio() : setEditMode(true))}
            >
              {editMode ? <Save size={16} /> : <Pencil size={16} />}
            </Button>
          </div>
          {editMode ? (
            <Textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Portfolio description"
            />
          ) : (
            <DialogDescription>{desc || 'No description provided.'}</DialogDescription>
          )}
        </DialogHeader>

        <div className="mt-4 space-y-3">
          {members.map((member) => (
            <div key={member.id} className="flex justify-between items-center border p-3 rounded-md">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 flex items-center justify-center rounded-full text-white text-sm font-bold ${member.color}`}>
                  {member.initials}
                </div>
                <div>
                  <p className="font-semibold text-sm">{member.name}</p>
                  <p className="text-xs text-gray-500">{member.email}</p>
                  <div className="text-xs text-gray-400">
                    <select
                      value={roleEdits[member.id] ?? member.role}
                      onChange={(e) => handleRoleChange(member.id, e.target.value)}
                      className="text-xs bg-transparent border rounded px-1 py-0.5"
                    >
                      <option value="Owner">Owner</option>
                      <option value="Admin">Admin</option>
                      <option value="Member">Member</option>
                    </select>
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.href = `/timelogs?user=${member.id}`}
              >
                View Timesheet
              </Button>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default PortfolioViewModal
