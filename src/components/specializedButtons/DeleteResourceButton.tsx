import { TrashIcon } from 'lucide-react'
import { Button, Card, theme } from '../../design-system'
import type { Resource } from '../../schemes'
import styled from 'styled-components'
import { useDeleteResource } from '../../api'

type Props = {
  resource: Resource
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'small' | 'medium' | 'large'
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}
const DeleteResourceButton = ({ resource, ...props }: Props) => {
  const deleteResource = useDeleteResource()
  const handleDeleteResource = (resourceId: number) => {
    deleteResource.mutate(resourceId)
  }
  return (
    <>
      <Button
        {...props}
        popoverTarget={`delete-popover-${resource.resourceId}`}
        style={{ color: theme.colors.warning }}
      >
        <TrashIcon />
      </Button>
      <Popover popover="hint" id={`delete-popover-${resource.resourceId}`}>
        <Card variant="elevated" style={{ border: `1px solid ${theme.colors.warning}` }}>
          <p>Are you sure?</p>
          <div
            style={{
              display: 'flex',
              gap: '0.5rem',
            }}
          >
            <Button
              size="small"
              variant="secondary"
              popoverTargetAction="hide"
              popoverTarget={`delete-popover-${resource.resourceId}`}
              onClick={(e) => e.stopPropagation()}
            >
              No
            </Button>
            <Button
              size="small"
              variant="primary"
              popoverTargetAction="hide"
              popoverTarget={`delete-popover-${resource.resourceId}`}
              style={{
                backgroundColor: theme.colors.warning,
                color: theme.colors.surface,
              }}
              onClick={(e) => {
                e.stopPropagation()
                handleDeleteResource(resource.resourceId)
              }}
            >
              Yes
            </Button>
          </div>
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

export default DeleteResourceButton
