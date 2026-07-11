import { useEffect, useMemo, useState, type Dispatch, type SetStateAction } from 'react'
import { Button, Card, Checkbox, Input } from '../../design-system'
import styled from 'styled-components'
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react'
import { useDebounce } from '../../hooks/useDebounce'
import type { Filters } from '../resources/ResourcesListView'

type Props = {
  filters: Filters
  setFilters: Dispatch<SetStateAction<Filters>>
  defaultFilters: Filters
}
const ResourcesFilters = ({ filters, setFilters, defaultFilters }: Props) => {
  const { sortOrder, status, name } = filters
  const [resourceName, setResourceName] = useState(name || '')

  const debouncedResourceName = useDebounce(resourceName, 500)

  const filterStatus = useMemo(() => {
    if (!status) {
      return {
        completed: false,
        draft: false,
      }
    } else {
      return {
        completed: status === 'completed',
        draft: status === 'draft',
      }
    }
  }, [status])

  const areFiltersChanged = useMemo(() => {
    return JSON.stringify(filters) !== JSON.stringify(defaultFilters)
  }, [filters, defaultFilters])

  const handleStatusChange = (_status: 'completed' | 'draft') => {
    const newStatus = status === _status ? undefined : _status
    setFilters((prev) => ({ ...prev, status: newStatus }))
  }
  const handleToggleSortOrder = () => {
    setFilters((prev) => ({ ...prev, sortOrder: sortOrder === 'desc' ? 'asc' : 'desc' }))
  }

  useEffect(() => {
    setFilters((prev) => ({ ...prev, name: debouncedResourceName }))
  }, [debouncedResourceName, setFilters])

  return (
    <>
      <span style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        {areFiltersChanged && (
          <Button variant="secondary" onClick={() => setFilters(defaultFilters)}>
            Clear
          </Button>
        )}
        <Button
          popoverTarget="filter-popover"
          variant={areFiltersChanged ? 'primary' : 'secondary'}
        >
          Filter
        </Button>
      </span>
      <Popover popover="auto" id="filter-popover">
        <Card variant="elevated">
          <Input
            label="Resource Name"
            placeholder="Resource Name"
            value={resourceName}
            onChange={(e) => setResourceName(e.target.value)}
          />
          <Checkbox
            label="Completed"
            checked={filterStatus.completed}
            onChange={() => handleStatusChange('completed')}
          />
          <Checkbox
            label="Draft"
            checked={filterStatus.draft}
            onChange={() => handleStatusChange('draft')}
          />
          <Button
            size="small"
            variant="ghost"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
            onClick={handleToggleSortOrder}
          >
            Sort order: {sortOrder}{' '}
            {sortOrder === 'desc' ? <ChevronDownIcon /> : <ChevronUpIcon />}
          </Button>
        </Card>
      </Popover>
    </>
  )
}

const Popover = styled.div`
  position-area: bottom;
  background: none;
  border: none;
  overflow: visible;
`

export default ResourcesFilters
