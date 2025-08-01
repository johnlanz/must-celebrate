import React, { useState } from 'react'

interface Timelog {
  timelog_id: number
  created_at: string
  image: string | null
  tasks?: { title?: string } | null
}

interface Props {
  dailyGroups: Record<string, Timelog[]>
}

export default function ScreenshotPerDay({ dailyGroups }: Props) {
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  return (
    <div className="space-y-8">
      {Object.keys(dailyGroups).map((day) => {
        const logs = dailyGroups[day]
        const screenshots = logs.filter((log) => log.image)

        if (screenshots.length === 0) return null

        return (
          <div key={day} className="border rounded-lg p-4 shadow bg-white">
            <h3 className="text-xl font-bold mb-4">{day}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {screenshots.map((log, idx) => (
                <div
                  key={log.timelog_id}
                  className="border rounded-lg p-2 shadow hover:shadow-md transition cursor-pointer"
                >
                  <h4 className="font-semibold text-sm mb-2 truncate">
                    {log.tasks?.title || 'Untitled Task'}
                  </h4>
                  <img
                    src={log.image as string}
                    alt={`screenshot-${idx}`}
                    className="w-full h-auto rounded"
                    onClick={() => setPreviewImage(log.image!)}
                  />
                </div>
              ))}
            </div>
          </div>
        )
      })}

      {/* Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div className="relative">
            <img src={previewImage} alt="Preview" className="max-w-full max-h-screen rounded" />
            <button
              className="absolute top-2 right-2 bg-white p-2 rounded-full shadow"
              onClick={() => setPreviewImage(null)}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
