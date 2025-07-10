import { useEffect } from 'react'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { Box, TextField, Button, IconButton, Stack, Typography } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import { useQuery, useMutation } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PageContainer from '@/components/PageContainer'
import ImageUploader, { ImageObject } from '@/components/ImageUploader'
import { seoMetasService } from '@/services/seo-metas'
import { UpdateSeoMetasRequest } from '@/types/seo-metas'
import { isValidUrl } from '@/constans/regex'
import { assetService } from '@/services/asset'

type SeoMetasFormValues = {
  title: string
  description: string
  images: {
    url: ImageObject[]
    href?: string
  }[]
}

export default function SeoMetas() {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<SeoMetasFormValues>({
    defaultValues: {
      title: '',
      description: '',
      images: [{ url: [], href: '' }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'images',
  })

  const { data: seoMetasData } = useQuery({
    queryKey: ['seoMetas'],
    queryFn: seoMetasService.getSeoMetas,
  })

  const updateMutation = useMutation({
    mutationFn: async (data: SeoMetasFormValues) => {
      const signatureInfo = await assetService.getSignature().then(res => res.data.data)
      let paramImages: UpdateSeoMetasRequest['images'] = []
      if (data.images && data.images.length > 0) {
        paramImages = await Promise.all(
          data.images.map(async img => {
            const imageItem = img.url[0]
            const file = imageItem?.file
            if (file) {
              const url = await assetService.uploadFile(file, signatureInfo)
              return {
                url,
                href: img.href || undefined,
              }
            } else {
              return {
                url: imageItem?.data,
                href: img.href || undefined,
              }
            }
          })
        )
      }
      const updateParams: UpdateSeoMetasRequest = {
        title: data.title,
        description: data.description,
        images: paramImages,
      }
      return seoMetasService.updateSeoMetas(updateParams)
    },
    onSuccess: () => {
      toast.success('SEO 信息更新成功')
    },
    onError: () => {
      toast.error('SEO 信息更新失败')
    },
  })

  useEffect(() => {
    if (seoMetasData?.data) {
      const formData: SeoMetasFormValues = {
        title: seoMetasData.data.title,
        description: seoMetasData.data.description,
        images: seoMetasData.data.images.map((img, idx) => ({
          url: [{ id: `img-${idx}`, data: img.url }],
          href: img.href,
        })),
      }
      reset(formData)
    }
  }, [seoMetasData, reset])

  const handleFormSubmit = (data: SeoMetasFormValues) => {
    updateMutation.mutate(data)
  }

  return (
    <Box>
      <Header title="SEO 管理" />
      <PageContainer sx={{ bgcolor: '#fff' }}>
        <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} sx={{ maxWidth: 800 }}>
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="网页名称"
              {...register('title')}
              error={!!errors.title}
              helperText={errors.title?.message}
            />

            <Controller
              name="description"
              control={control}
              rules={{
                maxLength: {
                  value: 150,
                  message: '描述不能超过150个字符',
                },
              }}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <TextField
                  fullWidth
                  label="网页描述"
                  multiline
                  rows={4}
                  value={value}
                  onChange={e => {
                    const newValue = e.target.value
                    if (newValue.length <= 150) {
                      onChange(newValue)
                    }
                  }}
                  error={!!error}
                  helperText={
                    <Box component="span" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>{error?.message}</span>
                      <span>{value?.length || 0}/150</span>
                    </Box>
                  }
                />
              )}
            />

            <Box>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                轮播图
              </Typography>
              {fields.map((field, index) => (
                <Box
                  key={field.id}
                  sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}
                >
                  <Stack direction="row" spacing={2} alignItems="flex-start">
                    <Box flex={1}>
                      <ImageUploader
                        value={field.url}
                        onChange={(images: ImageObject[]) => {
                          const newImages = [...fields]
                          newImages[index] = { ...newImages[index], url: images }
                          reset({ ...seoMetasData?.data, images: newImages })
                        }}
                      />
                      {errors.images?.[index]?.url && (
                        <Typography color="error" variant="caption">
                          请上传图片
                        </Typography>
                      )}
                    </Box>
                    <Box flex={1}>
                      <TextField
                        fullWidth
                        label="链接地址"
                        {...register(`images.${index}.href`, {
                          pattern: {
                            value: isValidUrl,
                            message: '请输入有效的URL地址',
                          },
                        })}
                        error={!!errors.images?.[index]?.href}
                        helperText={errors.images?.[index]?.href?.message}
                      />
                    </Box>
                    <IconButton
                      onClick={() => remove(index)}
                      disabled={fields.length === 1}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                </Box>
              ))}
              <Button
                startIcon={<AddIcon />}
                onClick={() => append({ url: [], href: '' })}
                sx={{ mt: 2 }}
              >
                添加图片
              </Button>
            </Box>
          </Stack>
        </Box>
      </PageContainer>
      <Footer
        onSave={handleSubmit(handleFormSubmit)}
        saveLoading={updateMutation.isPending}
        onCancel={() => {
          if (isDirty) {
            reset()
          }
        }}
      />
    </Box>
  )
}
