import { useState } from 'react'
import { EmptyState } from './EmptyState'

export interface Column<T> {
  key: string
  header: string
  render: (item: T) => React.ReactNode
  sortable?: boolean
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  emptyMessage?: string
  searchPlaceholder?: string
  onSearch?: (query: string) => void
}

export function DataTable<T>({
  columns,
  data,
  emptyMessage = 'No hay registros.',
  searchPlaceholder = 'Buscar...',
  onSearch,
}: DataTableProps<T>) {
  const [search, setSearch] = useState('')

  const handleSearch = (value: string) => {
    setSearch(value)
    onSearch?.(value)
  }

  return (
    <div>
      {onSearch && (
        <div className="mb-4">
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full max-w-sm border border-gray-200 rounded-lg px-3 py-1.5 text-[12px] text-navy placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
          />
        </div>
      )}

      {data.length === 0 ? (
        <EmptyState message={emptyMessage} />
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl border border-gray-200">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="px-4 py-3 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wide"
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index} className="border-b border-gray-50 hover:bg-orange-50/30 transition-colors">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 text-[13px] text-navy">
                      {col.render(item)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
