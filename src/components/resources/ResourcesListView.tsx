import { useMemo, useState } from 'react'
import { useCreateResources, useGetResources } from '../../api/index.ts'
import { Button, Card, Drawer, Input } from '../../design-system/index.ts'
import { type GetResourcesParams } from '../../schemes/params.ts'
import styled from 'styled-components'
import ResourcesTable from './ResourcesTable.tsx'
import ResourcesPagination from './ResourcesPagination.tsx'
import ResourceDetails from './ResourceDetails.tsx'
import { useNavigate } from 'react-router-dom'
import ResourcesFilters from '../specializedButtons/ResourcesFilters.tsx'

export type Filters = GetResourcesParams
const DEFAULT_FILTERS: Filters = {
  page: 1,
  pageSize: 10,
  sortOrder: 'desc',
  name: '',
}

const ResourcesListView = () => {
  const [resourceFilters, setResourceFilters] =
    useState<GetResourcesParams>(DEFAULT_FILTERS)

  const [newResourceName, setNewResourceName] = useState('')
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [inspectedResourceId, setInspectedResourceId] = useState<number | null>(null)
  const navigate = useNavigate()

  const { data, isSuccess } = useGetResources(resourceFilters)

  const createResource = useCreateResources({
    resourceName: newResourceName,
  })

  const resources = useMemo(() => {
    return isSuccess && data ? data.items : []
  }, [data, isSuccess])

  const pagination = useMemo(() => {
    return isSuccess && data ? data.pagination : null
  }, [data, isSuccess])

  const inspectedResourceDetails = useMemo(() => {
    return (
      resources.find((resource) => resource.resourceId === inspectedResourceId) || null
    )
  }, [resources, inspectedResourceId])

  const handleCreateResource = () => {
    createResource.mutate({ resourceName: newResourceName })
    setNewResourceName('')
  }
  const handlePageChange = (page: number) => {
    setResourceFilters((prev) => ({ ...prev, page }))
  }
  const handlePageSizeChange = (pageSize: number) => {
    setResourceFilters((prev) => ({ ...prev, pageSize }))
  }

  return (
    <>
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Resource Details"
      >
        {inspectedResourceDetails ? (
          <ResourceDetails
            key={inspectedResourceDetails._id}
            resource={inspectedResourceDetails}
            onEdit={() =>
              navigate(`/resources/${inspectedResourceDetails.resourceId}/edit`)
            }
          />
        ) : (
          <div>Resource no longer exists</div>
        )}
      </Drawer>

      <LayoutContainer>
        <Header>Resources</Header>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem',
          }}
        >
          <form
            style={{ display: 'flex', gap: '0.5rem', flex: 1 }}
            onSubmit={(e) => {
              e.preventDefault()
              handleCreateResource()
            }}
          >
            <Input
              type="text"
              placeholder="New resource name"
              value={newResourceName}
              onChange={(e) => setNewResourceName(e.target.value)}
            />
            <Button onClick={handleCreateResource} disabled={!newResourceName.trim()}>
              Create Resource
            </Button>
          </form>
          <ResourcesFilters
            filters={resourceFilters}
            setFilters={setResourceFilters}
            defaultFilters={DEFAULT_FILTERS}
          />
        </div>
        {resources.length > 0 ? (
          <Content>
            <TableScrollWrapper>
              <ResourcesTable
                resources={resources}
                onRowClick={(resourceId) => {
                  setInspectedResourceId(resourceId)
                  setIsDrawerOpen(true)
                }}
              />
            </TableScrollWrapper>
            {pagination && (
              <ResourcesPagination
                pagination={pagination}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
              />
            )}
          </Content>
        ) : (
          <Message>No resources found, let's create one!</Message>
        )}
      </LayoutContainer>
    </>
  )
}

const LayoutContainer = styled(Card)`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 0.25rem;
  flex: 1;
`
const TableScrollWrapper = styled.div`
  min-height: 0;
  overflow-y: auto;
`
const Content = styled.div`
  display: flex;
  flex: 1;
  min-height: 0;
  flex-direction: column;
`
const Header = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
`
const Message = styled.h2`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
`

export default ResourcesListView
