import React from 'react'
import { Box, Button, TextField } from '@mui/material'
import { useForm, FormProvider, Path } from 'react-hook-form'

export interface SearchFormProps<T extends Record<string, any> = any> {
  onSearch: (values: T) => void
  onReset?: () => void
  defaultValues?: T
  searchPlaceholder?: string
  fields?: React.ReactNode
  searchFieldName?: keyof T
  searchLabel?: string
  loading?: boolean
}

function SearchForm<T extends Record<string, any> = any>({
  onSearch,
  onReset,
  defaultValues,
  searchPlaceholder = '搜索',
  fields,
  searchFieldName = 'search',
  searchLabel = '',
  loading = false,
}: SearchFormProps<T>) {
  const methods = useForm<T>({ defaultValues: defaultValues as any })
  const { handleSubmit, reset, register } = methods

  const handleFormSearch = (values: T) => {
    onSearch(values)
  }

  const handleFormReset = () => {
    reset()
    onReset?.()
  }

  return (
    <FormProvider {...methods}>
      <Box component="form" onSubmit={handleSubmit(handleFormSearch)} mb={2} display="flex" gap={2}>
        <TextField
          {...register(searchFieldName as Path<T>)}
          label={searchLabel || searchPlaceholder}
          variant="outlined"
          size="small"
          inputProps={{ 'aria-label': searchPlaceholder, tabIndex: 0 }}
        />
        {fields}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          aria-label="搜索"
          tabIndex={0}
          disabled={loading}
        >
          搜索
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={handleFormReset}
          aria-label="重置搜索"
          tabIndex={0}
          disabled={loading}
        >
          重置
        </Button>
      </Box>
    </FormProvider>
  )
}

export default SearchForm
