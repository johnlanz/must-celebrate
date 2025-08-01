import React, { useEffect, useState, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'
import UniversalFormModal from '@/components/universal/UniversalFormModal'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import QRCode from 'react-qr-code'

export interface FieldDefinition {
  name: string
  label: string
  render?: (value: any, record: any) => React.ReactNode
}

interface UniversalCrudListProps {
  tableName: string
  primaryKey: string
  fields: FieldDefinition[]
  addFields: Parameters<typeof UniversalFormModal>[0]['fields']
  updateFields: Parameters<typeof UniversalFormModal>[0]['fields']
}

// Full-screen loader overlay
function FullScreenLoader() {
  return (
    <div className="fixed inset-0 bg-white/75 dark:bg-black/50 flex items-center justify-center z-[1000]">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <span className="sr-only">Loading...</span>
    </div>
  )
}

export default function UniversalCrudList({
  tableName,
  primaryKey,
  fields,
  addFields,
  updateFields,
}: UniversalCrudListProps) {
  const [records, setRecords] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [refreshFlag, setRefreshFlag] = useState(false)
  const [qrValue, setQrValue] = useState<string | null>(null)
  const qrRef = useRef<HTMLDivElement>(null)

  // fetch records
  useEffect(() => {
    async function fetchRecords() {
      setLoading(true)
      setError('')
      try {
        const supabase = createClient()
        const { data, error } = await supabase.from(tableName).select('*')
        if (error) setError(error.message)
        else setRecords(data || [])
      } catch (e: any) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    fetchRecords()
  }, [tableName, refreshFlag])

  const triggerRefresh = () => setRefreshFlag((f) => !f)

  const handleDelete = async (id: any) => {
    if (!confirm('Are you sure you want to delete?')) return
    setLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.from(tableName).delete().eq(primaryKey, id)
      if (error) setError(error.message)
      else triggerRefresh()
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  // generate QR pointing to http://localhost:3001/shops/{storeId}
  const handleViewQr = (storeId: any) => {
    setQrValue(`${process.env.NEXT_PUBLIC_SITE_URL}/shops/${storeId}`)
  }

  const handleDownload = () => {
    if (!qrRef.current) return
    const svg = qrRef.current.querySelector('svg')
    if (!svg) return
    const serializer = new XMLSerializer()
    const svgString = serializer.serializeToString(svg)
    const blob = new Blob([svgString], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'qr-code.svg'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const closeQrModal = () => setQrValue(null)

  return (
    <>
      {loading && <FullScreenLoader />}

      <Card className="mx-auto my-4">
        <CardHeader className="flex justify-between items-center">
          <CardTitle>{tableName}</CardTitle>
          <UniversalFormModal
            title={`Add ${tableName}`}
            tableName={tableName}
            fields={addFields}
            onSuccess={triggerRefresh}
            triggerText="Add New"
          />
        </CardHeader>
        <CardContent>
          {error && <p className="text-destructive">{error}</p>}
          <Table>
            <TableHeader>
              <TableRow>
                {fields.map((f) => (
                  <TableHead key={f.name}>{f.label}</TableHead>
                ))}
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={fields.length + 1} className="text-center">
                    No records found.
                  </TableCell>
                </TableRow>
              )}
              {records.map((record) => (
                <TableRow key={record[primaryKey]}>
                  {fields.map((f) => (
                    <TableCell key={f.name}>
                      {f.render ? f.render(record[f.name], record) : record[f.name] ?? ''}
                    </TableCell>
                  ))}
                  <TableCell>
                    <UniversalFormModal
                      title={`Edit ${tableName}`}
                      tableName={tableName}
                      primaryKey={primaryKey}
                      recordId={record[primaryKey]}
                      initialValues={record}
                      fields={updateFields}
                      onSuccess={triggerRefresh}
                      triggerText="Edit"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="ml-2"
                      onClick={() => handleDelete(record[primaryKey])}
                    >
                      Delete
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="ml-2"
                      onClick={() => handleViewQr(record[primaryKey])}
                    >
                      View QR
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* QR Modal */}
      {qrValue && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 relative">
            <Button
              size="sm"
              variant="ghost"
              className="absolute top-0 right-2"
              onClick={closeQrModal}
            >
              Close
            </Button>
            <div className="flex flex-col items-center">
              <div ref={qrRef}>
                <QRCode value={qrValue} />
              </div>
              <p className="mt-2 text-sm break-all">{qrValue}</p>
              <Button
                size="sm"
                variant="outline"
                className="mt-2"
                onClick={handleDownload}
              >
                Download QR
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

