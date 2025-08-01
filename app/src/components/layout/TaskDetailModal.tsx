'use client'

import { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from '@/components/ui/dialog'
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '@/components/ui/select'
import { Calendar, User, Tag, Clock, Link2, Flag } from "lucide-react"
import dayjs from 'dayjs'


export default function TaskDetailModal({
    isOpen,
    onClose,
    task,
}: {
    isOpen: boolean
    onClose: () => void
    task: {
        start_date: any
        task_id: string
        title: string
        due?: string
        priority?: string
        assignee?: string
        status?: string
    }
}) {
    const [status, setStatus] = useState(task.status || 'progress')

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent
                className="rounded-md p-0 overflow-hidden"
                style={{ width: '66.6667vw', maxWidth: 'none' }}
            >


                <p className="text-lg capitalize font-semibold p-6">{task.title}</p>
                <div className="flex flex-1 flex-row ">
                    {/* LEFT SIDE */}

                    <div className="flex flex-1 flex-row gap-6 text-sm px-8">
                        {/* GRID: 2 columns */}
                        <div className="grid grid-cols-2 gap-x-10 text-sm items-start w-full">

                            {/* LEFT COLUMN */}
                            <div className="space-y-3">
                                {/* Status */}
                                <div className="flex items-center gap-2">
                                    <span className="text-xl">🟢</span>
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">Status</span>
                                        <Select value={status} onValueChange={setStatus}>
                                            <SelectTrigger className="w-[150px]">
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="todo">To Do</SelectItem>
                                                <SelectItem value="in_progress">In Progress</SelectItem>
                                                <SelectItem value="done">Done</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* Dates */}
                                {/* Dates */}
                                <div className="flex items-center gap-6 flex-wrap">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xl">📅</span>
                                        <span className="font-medium">Start Date:</span>
                                        <span className="text-red-500">
                                            {task.start_date ? dayjs(task.start_date).format('MMM D, YYYY') : 'Not set'}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span className="text-xl">📅</span>
                                        <span className="font-medium">End Date:</span>
                                        <span className="text-red-500">
                                            {task.due ? dayjs(task.due).format('MMM D, YYYY') : 'Not set'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        

                        {/* RIGHT COLUMN */}
                        <div className="space-y-3">
                            {/* Assignee */}
                            <div className="flex items-center gap-2">
                                <span className="text-xl">👤</span>
                                <div className="flex items-center gap-2">
                                    <span className="font-medium">Assignee</span>
                                    <span className="text-muted-foreground">{task.assignee || 'Unassigned'}</span>
                                </div>
                            </div>

                            {/* Priority */}
                            <div className="flex items-center gap-2">
                                <span className="text-xl">🚩</span>
                                <div className="flex items-center gap-2">
                                    <span className="font-medium">Priority</span>
                                    <span className="text-muted-foreground">{task.priority || 'Empty'}</span>
                                </div>
                            </div>
                        </div>

                        {/* FULL WIDTH (spans 2 cols) */}
                        <div className="col-span-2 space-y-2 pt-1 border-t mt-1">
                            {/* Attachment */}
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium" htmlFor="attachment">
                                    Add📎 Attachment
                                </label>
                                <input
                                    id="attachment"
                                    type="file"
                                    className="text-sm"
                                />
                            </div>

                            {/* Comment Textarea */}
                            <textarea
                                className="w-full text-sm border rounded p-2"
                                placeholder="Write a comment..."
                                rows={3}
                            />
                            <div className="flex justify-end">
                                <button className="bg-[#67a626] text-white px-4 py-1.5 rounded hover:bg-[#3B3C4E] text-sm">
                                    Save
                                </button>
                            </div>
                        </div>

                    </div>
                </div>

                {/* RIGHT SIDE */}
                <div className=" border-l bg-muted p-4 px-6 flex flex-col">
                    <h3 className="font-bold text-sm mb-2">Activity</h3>

                    <div className="flex-1 space-y-4 overflow-y-auto pr-2">
                        {/* Example activity */}
                        <div className="text-sm bg-white rounded-md shadow-sm p-3">
                            <div className="font-semibold">John Laniba</div>
                            <div className="text-muted-foreground">2:32 AM</div>
                            <div className="mt-1">i need the logo images</div>
                            <div className="flex justify-between items-center pt-2 border-t mt-2">
                                <div className="flex items-center space-x-3 text-muted-foreground text-sm">
                                    <button className="hover:text-black" title="React with emoji">😊</button>
                                    <button className="hover:text-black" title="Thumbs up">👍</button>
                                </div>
                                <button className="text-muted-foreground text-sm hover:underline">Reply</button>
                            </div>
                        </div>

                        <div className="text-xs text-muted-foreground">
                            <span className="block">You changed status from <span className="line-through text-gray-400">New Request</span> to <span className="text-blue-500">In Progress</span></span>
                            <span>2:33 AM</span>
                        </div>

                        <div className="bg-white rounded-md shadow-sm p-3">
                            <div className="font-semibold text-purple-700">Joe</div>
                            <p className="text-sm mt-1">@John Laniba Everything looks the same as before on my screen…</p>
                            <div className="mt-1 text-xs text-muted-foreground">6:29 AM</div>

                            <div className="flex justify-between items-center pt-2 border-t mt-2">
                                <div className="flex items-center space-x-3 text-muted-foreground text-sm">
                                    <button className="hover:text-black" title="React with emoji">😊</button>
                                    <button className="hover:text-black" title="Thumbs up">👍</button>
                                </div>
                                <button className="text-muted-foreground text-sm hover:underline">Reply</button>
                            </div>
                        </div>
                    </div>

                    {/* Comment Input */}
                    <div className="pt-4 border-t mt-4">
                        <textarea
                            className="w-full text-sm border rounded p-2"
                            placeholder="Write a comment..."
                            rows={3}
                        />
                        <div className="mt-2 flex justify-end">
                            <button className="bg-[#67a626] text-white px-4 py-1.5 rounded hover:bg-[#3B3C4E] text-sm">
                                Send
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </DialogContent>
        </Dialog >


    )
}
