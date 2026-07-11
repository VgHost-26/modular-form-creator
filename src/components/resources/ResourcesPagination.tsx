import { IconButton, Select, theme } from '../../design-system'
import { type Pagination } from '../../schemes'
import styled from 'styled-components'

interface ResourcesPaginationProps {
  pagination: Pagination
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
}

const ResourcesPagination = ({
  pagination,
  onPageChange,
  onPageSizeChange,
}: ResourcesPaginationProps) => {
  const { page, pageSize, totalItems, totalPages } = pagination

  const rangeStart = Math.min((page - 1) * pageSize + 1, totalItems)
  const rangeEnd = Math.min(page * pageSize, totalItems)

  return (
    <PaginationWrapper>
      <PaginationInfo>
        Showing {rangeStart} to {rangeEnd} out of {totalItems} entries
      </PaginationInfo>
      <PaginationControls>
        {totalPages > 1 && (
          <>
            <IconButton
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              aria-label="Previous page"
            >
              &lsaquo;
            </IconButton>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <IconButton
                style={{
                  backgroundColor: p === page ? theme.colors.primary : '',
                  color: p === page ? theme.colors.surface : '',
                }}
                key={p}
                onClick={() => onPageChange(p)}
                aria-label={`Page ${p}`}
                aria-current={p === page ? 'page' : undefined}
              >
                {p}
              </IconButton>
            ))}
            <IconButton
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              aria-label="Next page"
            >
              &rsaquo;
            </IconButton>
          </>
        )}
        <Select
          value={pageSize.toString()}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          options={[
            {
              value: '10',
              label: '10',
            },
            {
              value: '25',
              label: '25',
            },
            {
              value: '50',
              label: '50',
            },
            {
              value: '100',
              label: '100',
            },
          ]}
        ></Select>
      </PaginationControls>
    </PaginationWrapper>
  )
}

const PaginationWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 1rem;
  padding-top: 0.75rem;
  border-top: 1px solid #ccc;
`

const PaginationInfo = styled.span`
  font-size: 0.875rem;
  color: #6b7280;
`

const PaginationControls = styled.div`
  display: flex;
  align-items: end;
  gap: 0.25rem;
`

export default ResourcesPagination
