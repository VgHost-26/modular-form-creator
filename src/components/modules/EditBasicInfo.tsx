import styled from 'styled-components'
import { Input, Select, Button, Card } from '../../design-system'
import type { Resource } from '../../schemes'
import { useUpdateResourceBasicInfo } from '../../api'
import type { Dispatch, SetStateAction } from 'react'

type Props = {
  resourceId: number
  resource: Resource
  draft: Resource
  setDraft: Dispatch<SetStateAction<Resource>>
  anyChangesBasicInfo: boolean
  onSaveAll: () => void
}

const PRIORITY_OPTIONS = [
  { value: '', label: 'Select priority' },
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
]

const EditBasicInfo = ({
  resourceId,
  resource,
  draft,
  setDraft,
  anyChangesBasicInfo,
  onSaveAll,
}: Props) => {
  const updateBasicInfo = useUpdateResourceBasicInfo()

  const handleSaveBasicInfo = () => {
    if (resource.status === 'completed') {
      onSaveAll()
      return
    }
    updateBasicInfo.mutate({
      resourceId,
      basicInfo: draft.basicInfo,
    })
  }

  const handleCancelModuleChanges = () => {
    setDraft((current) => ({
      ...current,
      basicInfo: resource.basicInfo,
    }))
  }

  return (
    <Module variant="elevated">
      <Form
        onSubmit={(e) => {
          e.preventDefault()
          handleSaveBasicInfo()
        }}
      >
        <h3>Basic Info</h3>
        <Grid>
          <Input
            label="Resource Name"
            value={draft.basicInfo.resourceName}
            state="locked"
            helperText="Resource name cannot be changed."
          />
          <Input
            label="Owner"
            value={draft.basicInfo.owner}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                basicInfo: {
                  ...current.basicInfo,
                  owner: event.target.value,
                },
              }))
            }
            helperText={draft.basicInfo.owner ? undefined : 'No owner provided'}
          />
          <Input
            label="Email"
            value={draft.basicInfo.email}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                basicInfo: {
                  ...current.basicInfo,
                  email: event.target.value,
                },
              }))
            }
            helperText={draft.basicInfo.email ? undefined : 'No email provided'}
          />
          <Select
            label="Priority"
            value={draft.basicInfo.priority}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                basicInfo: {
                  ...current.basicInfo,
                  priority: event.target.value as Resource['basicInfo']['priority'],
                },
              }))
            }
            options={PRIORITY_OPTIONS}
            helperText={draft.basicInfo.priority ? undefined : 'No priority set'}
          />
          <div style={{ gridColumn: '1/-1' }}>
            <Input
              label="Description"
              multiline
              value={draft.basicInfo.description}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  basicInfo: {
                    ...current.basicInfo,
                    description: event.target.value,
                  },
                }))
              }
              helperText={
                draft.basicInfo.description ? undefined : 'No description provided'
              }
            />
          </div>
        </Grid>
        <Footer>
          <Button
            type="button"
            style={{
              width: 'fit-content',
            }}
            variant="secondary"
            onClick={handleCancelModuleChanges}
            disabled={!anyChangesBasicInfo}
          >
            Cancel info changes
          </Button>
          <Button
            type="submit"
            style={{
              alignSelf: 'flex-end',
              width: 'fit-content',
              justifySelf: 'flex-end',
            }}
            disabled={!anyChangesBasicInfo}
          >
            Save info changes
          </Button>
        </Footer>
      </Form>
    </Module>
  )
}

const Module = styled(Card)`
  flex: 1;
`
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex: 1;
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: start;
  gap: 2rem;
`

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  margin-top: auto;
  gap: 1rem;
`
export default EditBasicInfo
