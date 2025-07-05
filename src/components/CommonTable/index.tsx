import React from 'react'
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Pagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material'
import type { ReactNode } from 'react'

export interface ColumnType<T = any> {
  title: string | ReactNode
  dataIndex: keyof T | string
  render?: (value: unknown, record: T, index: number) => React.ReactNode
  align?: 'left' | 'center' | 'right'
  width?: number | string
}

export interface CommonTableProps<T = any> {
  columns: ColumnType<T>[]
  dataSource: T[]
  isLoading: boolean
  page?: number
  totalPage?: number
  onPageChange?: (page: number) => void
  rowKey?: (record: T) => string
  emptyText?: React.ReactNode
  size?: number
  onSizeChange?: (size: number) => void
  sizeOptions?: number[]
  pagination?: boolean
}

function CommonTable<T = any>({
  columns,
  dataSource,
  isLoading,
  page = 1,
  totalPage = 1,
  onPageChange,
  rowKey,
  emptyText = '暂无数据',
  size = 10,
  onSizeChange,
  sizeOptions = [10, 20, 50, 100],
  pagination = true,
}: CommonTableProps<T>) {
  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map(col => (
                <TableCell
                  key={String(col.dataIndex)}
                  align={col.align}
                  style={col.width ? { width: col.width } : {}}
                >
                  {col.title}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  加载中...
                </TableCell>
              </TableRow>
            ) : dataSource && dataSource.length ? (
              dataSource.map((record, idx) => (
                <TableRow key={rowKey ? rowKey(record) : idx}>
                  {columns.map((col, colIdx) => (
                    <TableCell key={String(col.dataIndex) + colIdx} align={col.align}>
                      {col.render
                        ? col.render((record as any)[col.dataIndex], record, idx)
                        : ((record as any)[col.dataIndex] as React.ReactNode)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  {emptyText}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {pagination && (
        <Box display="flex" justifyContent="flex-end" alignItems="center" mt={3} gap={2}>
          <FormControl size="small" sx={{ minWidth: 100, mr: 2 }}>
            <InputLabel id="table-size-select-label">每页条数</InputLabel>
            <Select
              labelId="table-size-select-label"
              value={size}
              label="每页条数"
              onChange={e => onSizeChange && onSizeChange(Number(e.target.value))}
              aria-label="每页条数选择"
            >
              {sizeOptions.map(opt => (
                <MenuItem key={opt} value={opt}>
                  {opt} 条/页
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {totalPage > 1 && onPageChange && (
            <Pagination
              count={totalPage}
              page={page}
              onChange={(_, value) => {
                onPageChange(value)
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              color="primary"
              aria-label="分页导航"
              showFirstButton
              showLastButton
            />
          )}
        </Box>
      )}
    </>
  )
}

export default CommonTable
