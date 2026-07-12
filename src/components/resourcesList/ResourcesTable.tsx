import { Badge, Button } from '../../design-system'
import { type Resource } from '../../schemes'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import { checkResourceProgress } from '../../utils/helpers'
import ProvisionButton from '../specializedButtons/ProvisionButton'
import DeleteResourceButton from '../specializedButtons/DeleteResourceButton'

type Props = {
  resources: Resource[]
  onRowClick: (resourceId: number) => void
}

const ResourcesTable = ({ resources, onRowClick }: Props) => {
  const navigate = useNavigate()

  return (
    <Table>
      <Thead>
        <tr>
          <Th>Name</Th>
          <Th>Status</Th>
          <Th>Module Progress</Th>
          <Th>Created at</Th>
          <Th>Provision</Th>
          <Th></Th>
          <Th></Th>
        </tr>
      </Thead>
      <Tbody>
        {resources.map((resource) => (
          <Item key={resource.resourceId} onClick={() => onRowClick(resource.resourceId)}>
            <td title={resource.name}>{resource.name}</td>
            <td>
              <Badge variant={resource.status === 'completed' ? 'success' : 'info'}>
                {resource.status}
              </Badge>
            </td>
            <td>
              <Badge
                title="Basic Info"
                variant={checkResourceProgress(resource) >= 1 ? 'success' : 'neutral'}
              >
                {checkResourceProgress(resource) >= 1 ? '✓' : 'X'}
              </Badge>
              —
              <Badge
                title="Project Details"
                variant={checkResourceProgress(resource) >= 2 ? 'success' : 'neutral'}
              >
                {checkResourceProgress(resource) >= 2 ? '✓' : 'X'}
              </Badge>
            </td>
            <td>
              {new Date(resource.createdAt).toLocaleString('pl-PL', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })}
            </td>
            <td>
              <ProvisionButton
                variant="ghost"
                size="small"
                resource={resource}
                onClick={(e) => e.stopPropagation()}
              />
            </td>
            <td>
              <Button
                variant="ghost"
                size="small"
                onClick={(e) => {
                  e.stopPropagation()
                  navigate(`/resources/${resource.resourceId}/edit`)
                }}
              >
                Edit
              </Button>
            </td>
            <td>
              <DeleteResourceButton
                resource={resource}
                variant="ghost"
                size="small"
                onClick={(e) => e.stopPropagation()}
              />
            </td>
          </Item>
        ))}
      </Tbody>
    </Table>
  )
}

const Table = styled.table`
  border-collapse: collapse;
  width: 100%;
  min-width: 600px;
  table-layout: fixed;
  height: 100%;
  overflow-y: scroll;
`
const Thead = styled.thead`
  position: sticky;
  top: 0;
  background-color: white;
  border-bottom: 2px solid #aaa;
  z-index: 20;
`
const Tbody = styled.tbody``
const Th = styled.th`
  text-align: left;
  padding: 0.5rem;
  border-bottom: 1px solid #ccc;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #6b7280;

  &:nth-child(2) {
    width: 15%;
  }

  &:nth-child(3) {
    width: 15%;
  }

  &:nth-child(4) {
    width: 15%;
  }

  &:nth-last-child(3) {
    width: 125px;
  }
  &:nth-last-child(2),
  &:nth-last-child(1) {
    width: 100px;
  }
`

const Item = styled.tr`
  &:hover {
    cursor: pointer;
    background-color: #f5f5f5;
  }
  td:first-child {
    font-weight: bold;
    max-width: 33%;
    min-width: 150px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  td {
    padding: 0.5rem;
    border-bottom: 1px solid #ccc;
  }
`

export default ResourcesTable
