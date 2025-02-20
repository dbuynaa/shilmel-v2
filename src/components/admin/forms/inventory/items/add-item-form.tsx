"use client"

import * as React from "react"
import type { JSX } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { getAllCategories } from "@/actions/inventory/categories"
import { addItem, checkItem } from "@/actions/inventory/items"
import type { UploadFilesRouter } from "@/admin/api/uploadthing/core"
import type { FileWithPreview } from "@/types"
import { itemSchema, type AddItemFormInput } from "@/validations/inventory"
import { zodResolver } from "@hookform/resolvers/zod"
import { generateReactHelpers } from "@uploadthing/react"
import { useFieldArray, useForm } from "react-hook-form"
import type { z } from "zod"

import { useToast } from "@/hooks/use-toast"
import { cn, isArrayOfFiles } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  UncontrolledFormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { FileDialog } from "@/components/file-dialog"
import { Icons } from "@/components/icons"
import { Zoom } from "@/components/image-zoom"

type AddItemFormInputs = z.infer<typeof itemSchema>

const { useUploadThing } = generateReactHelpers<UploadFilesRouter>()

export function AddItemForm({
  categories,
}: {
  categories: Awaited<ReturnType<typeof getAllCategories>>
}): JSX.Element {
  const router = useRouter()
  const { toast } = useToast()
  const [isPending, startTransition] = React.useTransition()
  const [files, setFiles] = React.useState<Record<number, FileWithPreview[]>>(
    {}
  )

  const { isUploading, startUpload, routeConfig } = useUploadThing(
    "productImage",
    {
      onClientUploadComplete: () => {
        toast({
          title: "Upload complete",
          description: "Your file has been uploaded.",
        })
      },
      onUploadError: () => {
        toast({
          title: "Upload error",
          description: "There was an error uploading your file.",
          variant: "destructive",
        })
      },
      onUploadBegin: () => {
        toast({
          title: "Uploading file",
          description: "Please wait while we upload your file.",
        })
      },
    }
  )

  const form = useForm<AddItemFormInput>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      name: "",
      category: "",
      description: "",
      price: "",
      variants: [
        {
          size: "",
          color: "",
          material: "",
          stock: 1,
          images: [],
        },
      ],
    },
  })

  const { fields, append, remove } = useFieldArray({
    name: "variants",
    control: form.control,
  })

  function onSubmit(formData: AddItemFormInputs) {
    startTransition(async () => {
      try {
        const exists = await checkItem({ name: formData.name })

        if (exists) {
          toast({
            title: "This item already exists",
            description: "Please use a different name",
            variant: "destructive",
          })
          return
        }
        const variants = await Promise.all(
          formData.variants.map(async (variant) => {
            if (!isArrayOfFiles(variant.images)) return variant
            const res = await startUpload(variant.images)
            const formattedImages =
              res?.map((image) => ({
                id: image.key,
                name: image.key.split("_")[1] ?? image.key,
                url: image.ufsUrl,
              })) ?? []

            return {
              ...variant,
              images: formattedImages,
            }
          })
        )

        await addItem({
          ...formData,
          variants,
        })

        toast({
          title: "Product added successfully",
        })

        form.reset()
        setFiles({})
        router.push("/admin/inventory/items")
      } catch (error) {
        console.log(error)
        toast({
          title: "Something went wrong",
          description: "Please try again",
          variant: "destructive",
        })
      }
    })
  }
  return (
    <Form {...form}>
      <form
        className="grid w-full gap-10"
        onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
      >
        <div className="grid grid-cols-2 gap-x-10 gap-y-5">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Product name" {...field} />
                </FormControl>
                <FormMessage className="sm:text-sm" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={(value: typeof field.value) =>
                    field.onChange(value)
                  }
                >
                  <FormControl>
                    <SelectTrigger className="capitalize">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      {categories?.map((option) => (
                        <SelectItem
                          key={option.id}
                          value={option.id}
                          className="capitalize"
                        >
                          {option.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="col-start-1 col-end-3">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Description (optional)"
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="pt-2 sm:text-sm" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    inputMode="numeric"
                    placeholder="Single item selling price"
                    value={Number.isNaN(field.value) ? "" : field.value}
                    onChange={(e) =>
                      field.onChange(e.target.valueAsNumber.toString())
                    }
                  />
                </FormControl>
                <FormMessage className="sm:text-sm" />
              </FormItem>
            )}
          />
        </div>

        {/* Variants */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Variants</h2>
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                append({
                  size: "",
                  color: "",
                  material: "",
                  stock: 1,
                  images: [],
                })
              }
            >
              Add Variant
            </Button>
          </div>

          {fields.map((field, index) => (
            <div key={field.id} className="space-y-4 rounded-lg border p-4">
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => remove(index)}
                  disabled={fields.length === 1}
                >
                  Remove
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name={`variants.${index}.size`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Size</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`variants.${index}.color`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Color</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`variants.${index}.material`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Material</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`variants.${index}.stock`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number.parseInt(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormItem className="flex w-full flex-col gap-1.5">
                  <FormLabel>Images</FormLabel>
                  {files && files[index] && isArrayOfFiles(files[index]) ? (
                    <div className="flex items-center gap-2">
                      {files[index].map((file: FileWithPreview) => (
                        <Zoom key={file.name}>
                          <Image
                            src={file.preview}
                            alt={file.name}
                            className="size-20 shrink-0 rounded-md object-cover object-center"
                            width={80}
                            height={80}
                          />
                        </Zoom>
                      ))}
                    </div>
                  ) : null}
                  <FormControl>
                    <FileDialog
                      setValue={form.setValue}
                      name={`variants.${index}.images`}
                      maxFiles={5}
                      maxSize={1024 * 1024 * 4}
                      files={
                        (files &&
                          isArrayOfFiles(files[index]) &&
                          files[index]) ||
                        []
                      }
                      setFiles={(newFiles) =>
                        setFiles((prev) => ({
                          ...prev,
                          [index]: newFiles as FileWithPreview[],
                        }))
                      }
                      isUploading={isUploading}
                      disabled={isPending}
                    />
                  </FormControl>
                  <UncontrolledFormMessage
                    message={
                      form.formState.errors.variants?.[index]?.images?.message
                    }
                  />
                </FormItem>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 pt-2">
          <Button disabled={isPending} aria-label="Add Item" className="w-fit">
            {isPending ? (
              <>
                <Icons.spinner
                  className="mr-2 size-4 animate-spin"
                  aria-hidden="true"
                />
                <span>Adding...</span>
              </>
            ) : (
              <span>Add Item</span>
            )}
            <span className="sr-only">Add Item</span>
          </Button>

          <Link
            href="/admin/inventory/items"
            className={cn(buttonVariants({ variant: "ghost" }), "w-fit")}
          >
            Cancel
          </Link>
        </div>
      </form>
    </Form>
  )
}
