import styled from 'styled-components'
import { Input, Select, CheckboxGroup, Button, Card } from '../../design-system'
import type { Resource } from '../../schemes'
import { useUpdateResourceProjectDetails } from '../../api'
import { useMemo, type Dispatch, type SetStateAction } from 'react'

type Props = {
  resourceId: number
  resource: Resource
  draft: Resource
  setDraft: Dispatch<SetStateAction<Resource>>
  anyChangesProjectDetails: boolean
  onSaveAll: () => void
}

const CATEGORY_OPTIONS = [
  { value: '', label: 'Select category' },
  { value: 'internal', label: 'Internal' },
  { value: 'external', label: 'External' },
  { value: 'vendor', label: 'Vendor' },
]
const TEAM_OPTIONS = ['FE devs', 'BE devs', 'Designer', 'Data Eng', 'Product Owner']

const EditProjectDetails = ({
  resourceId,
  resource,
  draft,
  setDraft,
  anyChangesProjectDetails,
  onSaveAll: onUpdateAll,
}: Props) => {
  const updateProjectDetails = useUpdateResourceProjectDetails()

  const handleCancelModuleChanges = () => {
    setDraft({ ...resource, projectDetails: { ...resource.projectDetails } })
  }

  const handleSaveProjectDetails = () => {
    if (resource.status === 'completed') {
      onUpdateAll()
      return
    }
    updateProjectDetails.mutate({
      resourceId,
      projectDetails: draft.projectDetails,
    })
  }

  const isBasicInfoComplete = useMemo(() => {
    return !!(
      resource.basicInfo.description &&
      resource.basicInfo.email &&
      resource.basicInfo.owner &&
      resource.basicInfo.priority
    )
  }, [resource.basicInfo])

  return (
    <Module variant="elevated">
      <Form
        onSubmit={(e) => {
          e.preventDefault()
          handleSaveProjectDetails()
        }}
      >
        <h3>Project Details</h3>
        <Grid>
          <Input
            label="Project Name"
            value={draft.projectDetails.projectName}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                projectDetails: {
                  ...current.projectDetails,
                  projectName: event.target.value,
                },
              }))
            }
            state={isBasicInfoComplete ? 'normal' : 'locked'}
            helperText={
              isBasicInfoComplete
                ? draft.projectDetails.projectName
                  ? undefined
                  : 'No project name provided'
                : 'Please complete the basic info section first.'
            }
          />
          <Input
            label="Budget"
            value={draft.projectDetails.budget}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                projectDetails: {
                  ...current.projectDetails,
                  budget: event.target.value,
                },
              }))
            }
            helperText={
              isBasicInfoComplete
                ? draft.projectDetails.budget
                  ? undefined
                  : 'No budget provided'
                : 'Please complete the basic info section first.'
            }
            state={isBasicInfoComplete ? 'normal' : 'locked'}
          />
          <Select
            label="Category"
            options={CATEGORY_OPTIONS}
            value={draft.projectDetails.category}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                projectDetails: {
                  ...current.projectDetails,
                  category: event.target.value,
                },
              }))
            }
            helperText={
              isBasicInfoComplete
                ? draft.projectDetails.category
                  ? undefined
                  : 'No category provided'
                : 'Please complete the basic info section first.'
            }
            state={isBasicInfoComplete ? 'normal' : 'locked'}
          />

          {/* NOTE: I'm not sure if this was intended but neither in the task description nor in the API specification
            it wasnt specified that "Options" fiels is actually Team Members which accept only specified string values
            and not ANY array of strings. I found the correct values in the backend code and later in the storybook example, 
            but at first I was a bit confused why my random strings gave me an error response.  */}

          <CheckboxGroup
            label="Team Members"
            options={TEAM_OPTIONS}
            value={draft.projectDetails.options}
            onChange={(selectedOptions) =>
              setDraft((current) => ({
                ...current,
                projectDetails: {
                  ...current.projectDetails,
                  options: selectedOptions,
                },
              }))
            }
            disabled={!isBasicInfoComplete}
          />
        </Grid>
        <Footer>
          <Button
            style={{
              width: 'fit-content',
            }}
            variant="secondary"
            onClick={handleCancelModuleChanges}
            disabled={!anyChangesProjectDetails}
          >
            Cancel project changes
          </Button>
          <Button
            style={{
              width: 'fit-content',
            }}
            onClick={handleSaveProjectDetails}
            // disabled={!anyChangesProjectDetails || !isBasicInfoComplete}
            state={
              isBasicInfoComplete
                ? anyChangesProjectDetails
                  ? 'normal'
                  : 'disabled'
                : 'locked'
            }
          >
            Save project changes
          </Button>
        </Footer>
      </Form>
    </Module>
  )
}
const Module = styled(Card)`
  display: flex;
  flex-direction: column;
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

export default EditProjectDetails
