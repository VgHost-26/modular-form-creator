import { useMemo, useState } from 'react'
import { useCreateResources, useGetResources } from '../../api'
import { Button, Card, Drawer, Input } from '../../design-system'
import { type GetResourcesParams } from '../../schemes/params'
import styled from 'styled-components'

const ResourcesList = () => {
  const [resourceFilters] = useState<GetResourcesParams>({
    page: 1,
    pageSize: 10,
    sortOrder: 'desc',
  })
  const [newResourceName, setNewResourceName] = useState('')
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [inspectedResourceId, setInspectedResourceId] = useState<number | null>(null)

  const { data, isSuccess, refetch } = useGetResources(resourceFilters)

  const createResource = useCreateResources({
    resourceName: newResourceName,
  })

  const resources = useMemo(() => {
    return isSuccess && data ? data.items : []
  }, [data, isSuccess])

  const inspectedResourceDetails = useMemo(() => {
    return (
      resources.find((resource) => resource.resourceId === inspectedResourceId) || null
    )
  }, [resources, inspectedResourceId])

  const handleCreateResource = async () => {
    try {
      await createResource.mutateAsync({ resourceName: newResourceName })
      refetch()
    } catch (error) {
      console.error('Error creating resource:', error)
    }
  }

  return (
    <>
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Resource Details"
      >
        <div>{inspectedResourceDetails?.name || 'No resource selected'}</div>
      </Drawer>

      <Card
        style={{
          width: '100%',
          height: '100%',
        }}
      >
        <Header>Resources</Header>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <Input
            type="text"
            placeholder="New resource name"
            value={newResourceName}
            onChange={(e) => setNewResourceName(e.target.value)}
          />
          <Button onClick={handleCreateResource} disabled={!newResourceName.trim()}>
            Create Resource
          </Button>
        </div>
        {resources ? (
          <Table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Status</th>
                <th>Progress</th>
                <th>Created at</th>
              </tr>
            </thead>
            <tbody>
              {resources.map((resource) => {
                return (
                  <Item
                    key={resource.resourceId}
                    onClick={() => {
                      setInspectedResourceId(resource.resourceId)
                      setIsDrawerOpen(true)
                    }}
                  >
                    <td>{resource.name}</td>
                    <td>{resource.status}</td>
                    <td>progress bar</td>
                    <td>{new Date(resource.createdAt).toLocaleString()}</td>
                  </Item>
                )
              })}
            </tbody>
          </Table>
        ) : (
          <div>no resources found</div>
        )}
      </Card>
    </>
  )
}

const Header = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
`
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  align-self: stretch;
  th {
    text-align: left;
    padding: 0.5rem;
    border-bottom: 1px solid #ccc;
  }
`
const Item = styled.tr`
  &:hover {
    cursor: pointer;
    background-color: #f5f5f5;
  }
  td {
    padding: 0.5rem;
    border-bottom: 1px solid #ccc;
  }
`

export default ResourcesList
