import { useMemo, useState } from 'react'
import { Badge, Button, Card, IconButton } from '../../design-system'
import {
  useUpdateResource,
  useUpdateResourceBasicInfo,
  useUpdateResourceProjectDetails,
} from '../../api'
import type { Resource } from '../../schemes'
import styled from 'styled-components'
import { arraysEqual } from '../../utils/helpers'
import { ChevronLeftIcon } from 'lucide-react'
import ProvisionButton from '../specializedButtons/ProvisionButton'
import DeleteResourceButton from '../specializedButtons/DeleteResourceButton'
import EditBasicInfo from '../modules/EditBasicInfo'
import EditProjectDetails from '../modules/EditProjectDetails'

type Props = {
  resource: Resource
  onCancel: () => void
  onSaved: () => void
}

const ResourceEditor = ({ resource, onCancel, onSaved }: Props) => {
  const [draft, setDraft] = useState<Resource>(resource)
  const resourceId = resource.resourceId

  const updateResource = useUpdateResource()
  const updateBasicInfo = useUpdateResourceBasicInfo()
  const updateProjectDetails = useUpdateResourceProjectDetails()

  const anyChangesBasicInfo = useMemo(() => {
    return JSON.stringify(draft.basicInfo) !== JSON.stringify(resource.basicInfo)
  }, [draft.basicInfo, resource.basicInfo])

  const anyChangesProjectDetails = useMemo(() => {
    return (
      draft.projectDetails.projectName !== resource.projectDetails.projectName ||
      draft.projectDetails.budget !== resource.projectDetails.budget ||
      draft.projectDetails.category !== resource.projectDetails.category ||
      !arraysEqual(draft.projectDetails.options, resource.projectDetails.options)
    )
  }, [draft, resource])

  const handleSaveAll = async () => {
    /* When Provisioned use PUT othervise PATCH separatly to not confuse the user
     with different behavior in the same form */
    if (resource.status === 'completed') {
      await updateResource.mutateAsync(draft)
      onSaved()
      return
    }
    if (anyChangesBasicInfo) {
      await updateBasicInfo.mutateAsync({ resourceId, basicInfo: draft.basicInfo })
    }
    if (anyChangesProjectDetails) {
      await updateProjectDetails.mutateAsync({
        resourceId,
        projectDetails: draft.projectDetails,
      })
    }
    onSaved()
  }

  // TODO: add fields validation before saving

  return (
    <LayoutContainer variant="elevated">
      <Header>
        <IconButton size="small" onClick={onCancel}>
          <ChevronLeftIcon />
        </IconButton>
        <span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h2>Edit Resource</h2>
            <Badge variant={resource.status === 'completed' ? 'success' : 'info'}>
              {resource.status}
            </Badge>
          </span>
          <p>Resource #{resource.resourceId}</p>
        </span>
        <span
          style={{
            marginLeft: 'auto',
            display: 'flex',
            gap: '0.5rem',
            alignItems: 'flex-end',
          }}
        >
          <ProvisionButton resource={resource} />
          <DeleteResourceButton resource={resource} variant="secondary" />
        </span>
      </Header>
      <ModulesWrapper>
        <EditBasicInfo
          resourceId={resourceId}
          resource={resource}
          draft={draft}
          setDraft={setDraft}
          anyChangesBasicInfo={anyChangesBasicInfo}
          onSaveAll={handleSaveAll}
        />
        <EditProjectDetails
          resourceId={resourceId}
          resource={resource}
          draft={draft}
          setDraft={setDraft}
          anyChangesProjectDetails={anyChangesProjectDetails}
          onSaveAll={handleSaveAll}
        />
      </ModulesWrapper>
      <Footer>
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          onClick={handleSaveAll}
          // TODO: hanlde partial save for first module
          disabled={
            updateResource.isPending ||
            (!anyChangesBasicInfo && !anyChangesProjectDetails)
          }
        >
          {updateResource.isPending ? 'Saving...' : 'Save all changes'}
        </Button>
      </Footer>
    </LayoutContainer>
  )
}
const LayoutContainer = styled(Card)`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 1rem;
  flex: 1;
`

const Header = styled.div`
  display: flex;
  gap: 0.5rem;
`

const ModulesWrapper = styled.div`
  display: flex;
  gap: 2rem;
  flex: 1;
  align-items: stretch;
`

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  margin-top: auto;
  gap: 1rem;
`

export default ResourceEditor
