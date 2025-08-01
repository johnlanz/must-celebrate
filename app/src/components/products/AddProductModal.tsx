import React, { Fragment, useEffect, useState } from 'react'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useForm, useFieldArray } from 'react-hook-form'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { createClient } from '@/utils/supabase/client'
import { FullScreenLoader } from '../layout/FullScreenLoader'

// Types
type MetaOption = { label: string; value: number }

interface SKUForm {
  id?: number
  sku: string
  price: number
  quantity: number
  attribute_name: string | null
  attribute_value: string | null
  file: File | null
  existingCover?: string | null
}

interface ProductData {
  id: number
  name: string
  description: string | null
  category_id: number | null
  cover: string | null
  products_skus: Array<{
    id: number
    sku: string
    price: number
    quantity: number
    attribute_name: string | null
    attribute_value: string | null
    cover: string | null
  }>
}

interface FormValues {
  id?: number
  name: string
  description: string
  categoryId: number | null
  coverFile: File | null
  skus: SKUForm[]
}

type AddProductModalProps = {
  metaCats: MetaOption[]
  metaSubs: MetaOption[]
  onSave: () => Promise<void>
  product?: ProductData
}

const attributeOptions = [
  { label: 'Weight', value: 'weight' },
  { label: 'Size', value: 'size' }
]

export function AddProductModal({ metaCats, metaSubs, onSave, product }: AddProductModalProps) {
  const supabase = createClient()
  const isEdit = Boolean(product)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const defaultValues: FormValues = {
    id: product?.id,
    name: product?.name || '',
    description: product?.description || '',
    categoryId: product?.category_id || null,
    coverFile: null,
    skus: product?.products_skus.map(s => ({
      id: s.id,
      sku: s.sku,
      price: s.price,
      quantity: s.quantity,
      attribute_name: s.attribute_name,
      attribute_value: s.attribute_value,
      file: null,
      existingCover: s.cover,
    })) || [{
      sku: '',
      price: 0,
      quantity: 0,
      attribute_name: '',
      attribute_value: '',
      file: null,
      existingCover: null
    }],
  }

  const form = useForm<FormValues>({ defaultValues })
  const { fields, append, remove, replace } = useFieldArray({ name: 'skus', control: form.control })

  // Reset form when opening or when product prop changes
  useEffect(() => {
    if (open) {
      form.reset(defaultValues)
      replace(defaultValues.skus)
    }
  }, [open])

  const onSubmit = async (values: FormValues) => {
    try {
      setLoading(true)
      const { id, name, description, categoryId, coverFile, skus } = values
      let coverUrl: string | null = product?.cover || null

      // Upload new cover if provided
      if (coverFile) {
        const fileExt = coverFile.name.split('.').pop()
        const fileName = `${Date.now()}_${Math.random().toString(36).slice(2)}.${fileExt}`
        const filePath = `covers/${fileName}`
        const { error: uploadErr } = await supabase.storage.from('covers').upload(filePath, coverFile)
        if (uploadErr) throw uploadErr
        const { data: urlData } = supabase.storage.from('covers').getPublicUrl(filePath)
        if (!urlData?.publicUrl) throw new Error('Failed to get public URL')
        coverUrl = urlData.publicUrl
      }

      if (isEdit && id) {
        // Update product record
        const { error: prodErr } = await supabase
          .from('products')
          .update({ name, description, category_id: categoryId, cover: coverUrl })
          .eq('id', id)
        if (prodErr) throw prodErr

        // Handle SKUs: delete removed, update existing, insert new
        const existingIds = product?.products_skus.map(s => s.id) || []
        const submittedIds = skus.filter(s => s.id).map(s => s.id!)
        const toDelete = existingIds.filter(eid => !submittedIds.includes(eid))
        // Delete removed SKUs
        await Promise.all(toDelete.map(skuId =>
          supabase.from('products_skus').delete().eq('id', skuId)
        ))

        // Upsert submitted SKUs
        await Promise.all(skus.map(async s => {
          if (s.id) {
            // update existing
            const updateData: any = {
              sku: s.sku,
              price: Number(s.price),
              quantity: Number(s.quantity),
              attribute_name: s.attribute_name,
              attribute_value: s.attribute_value
            }
            if (s.file) {
              const ext = s.file.name.split('.').pop()
              const fn = `${Date.now()}_${Math.random().toString(36).slice(2)}_${id}.${ext}`
              const fnPat = `covers/${fn}`
              const { error: skuUploadErr } = await supabase.storage.from('covers').upload(fnPat, s.file)
              if (skuUploadErr) throw skuUploadErr
              const { data: skuUrlData } = supabase.storage.from('covers').getPublicUrl(fnPat)
              updateData.cover = skuUrlData.publicUrl
            }
            const { error: updErr } = await supabase.from('products_skus').update(updateData).eq('id', s.id)
            if (updErr) throw updErr
          } else {
            // insert new SKU
            let skuCoverUrl: string | null = null
            if (s.file) {
              const ext = s.file.name.split('.').pop()
              const fn = `${Date.now()}_${Math.random().toString(36).slice(2)}_${id}.${ext}`
              const fnPat = `covers/${fn}`
              const { error: skuUploadErr } = await supabase.storage.from('covers').upload(fnPat, s.file)
              if (skuUploadErr) throw skuUploadErr
              const { data: skuUrlData } = supabase.storage.from('covers').getPublicUrl(fnPat)
              skuCoverUrl = skuUrlData.publicUrl
            }
            const { error: insErr } = await supabase.from('products_skus').insert({
              product_id: id,
              sku: s.sku,
              price: Number(s.price),
              quantity: Number(s.quantity),
              attribute_name: s.attribute_name,
              attribute_value: s.attribute_value,
              cover: skuCoverUrl
            })
            if (insErr) throw insErr
          }
        }))
      } else {
        console.log('handle add')
        // Insert new product
        const { data: productData, error: prodErr } = await supabase
          .from('products')
          .insert({ name, description, category_id: categoryId, cover: coverUrl })
          .select('id')
          .single()
        if (prodErr) throw prodErr
        const newId = productData.id

        console.log('inssert new sku')

        // Insert SKUs
        await Promise.all(skus.map(async s => {
          let skuCoverUrl: string | null = null
          if (s.file) {
            const ext = s.file.name.split('.').pop()
            const fn = `${Date.now()}_${Math.random().toString(36).slice(2)}_${newId}.${ext}`
            const fnPat = `covers/${fn}`
            const { error: skuUploadErr } = await supabase.storage.from('covers').upload(fnPat, s.file)
            if (skuUploadErr) throw skuUploadErr
            const { data: skuUrlData } = supabase.storage.from('covers').getPublicUrl(fnPat)
            skuCoverUrl = skuUrlData.publicUrl
          }
          const { error: insErr } = await supabase.from('products_skus').insert({
            product_id: newId,
            sku: s.sku,
            price: Number(s.price),
            quantity: Number(s.quantity),
            attribute_name: s.attribute_name,
            attribute_value: s.attribute_value,
            cover: skuCoverUrl
          })
          if (insErr) throw insErr
        }))
      }

      await onSave()
      setOpen(false)
      setLoading(false)
      form.reset()
    } catch (error) {
      setLoading(false)
      console.error('Error saving product:', error)
    }
  }

  return (
    <Fragment>
      {loading && <FullScreenLoader />}
    
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant={isEdit ? 'outline' : 'default'} size="sm">
            {isEdit ? 'Edit Product' : '+ New Product'}
          </Button>
        </DialogTrigger>
        <DialogContent className="min-w-2/4 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEdit ? 'Edit product & SKUs' : 'Add product & SKUs'}</DialogTitle>
            <DialogDescription>Define your product details and SKUs below.</DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Product name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Detailed description" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value?.toString() || ''}
                          onValueChange={(v) => field.onChange(v ? Number(v) : null)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {metaCats.map((cat) => (
                              <SelectItem key={cat.value} value={cat.value.toString()}>
                                {cat.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {product?.cover && isEdit && (
                <div className="space-y-2">
                  <span className="font-medium">Current Cover:</span>
                  <img src={product.cover} alt="Current cover" className="w-full h-48 object-cover rounded" />
                </div>
              )}
              <FormField
                control={form.control}
                name="coverFile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cover Image {isEdit ? '(Upload to replace)' : ''}</FormLabel>
                    <FormControl>
                      <Input type="file" accept="image/*" onChange={(e) => field.onChange(e.target.files?.[0] || null)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <h3 className="font-medium">SKUs</h3>
                {fields.map((item, index) => {
                  const existingCover = form.getValues(`skus.${index}.existingCover`)
                  const fileField = form.getValues(`skus.${index}.file`)
                  const previewUrl = fileField ? URL.createObjectURL(fileField) : null
                  return (
                    <div key={item.id} className="grid grid-cols-5 gap-4 border rounded p-4 relative">
                      <FormField
                        control={form.control}
                        name={`skus.${index}.sku`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>SKU</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`skus.${index}.price`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price</FormLabel>
                            <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`skus.${index}.quantity`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Quantity</FormLabel>
                            <FormControl><Input type="number" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`skus.${index}.attribute_name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Attribute Name</FormLabel>
                            <FormControl>
                              <Select
                                value={field.value || ''}
                                onValueChange={(val) => field.onChange(val)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Choose an attribute" />
                                </SelectTrigger>
                                <SelectContent>
                                  {attributeOptions.map((opt) => (
                                    <SelectItem key={opt.value} value={opt.value}>
                                      {opt.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`skus.${index}.attribute_value`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Attribute Value</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="col-span-2 space-y-2">
                        {isEdit && existingCover && !previewUrl && (
                          <div className="space-y-1">
                            <span className="font-medium">Current SKU Image:</span>
                            <img src={existingCover!} alt="Current SKU cover" className="w-32 h-32 object-cover rounded" />
                          </div>
                        )}
                        {previewUrl && (
                          <div className="space-y-1">
                            <span className="font-medium">New Image Preview:</span>
                            <img src={previewUrl} alt="Preview" className="w-32 h-32 object-cover rounded" />
                          </div>
                        )}
                        <FormField
                          control={form.control}
                          name={`skus.${index}.file`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Image {isEdit ? '(Upload to replace)' : ''}</FormLabel>
                              <FormControl>
                                <Input type="file" accept="image/*" onChange={(e) => field.onChange(e.target.files?.[0] || null)} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {fields.length > 1 && (
                        <Button
                          className="absolute bottom-2 right-2"
                          variant="destructive"
                          type="button"
                          onClick={() => remove(index)}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  )
                })}
                <Button
                  variant="link"
                  type="button"
                  onClick={() => append({
                    sku: '',
                    price: 0,
                    quantity: 0,
                    attribute_name: '',
                    attribute_value: '',
                    file: null,
                    existingCover: null
                  })}
                >
                  + Add SKU
                </Button>
              </div>

              <DialogFooter>
                <Button type="submit">{isEdit ? 'Save Changes' : 'Save Product & SKUs'}</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </Fragment>
  )
}