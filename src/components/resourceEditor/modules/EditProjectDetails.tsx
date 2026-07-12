import styled from 'styled-components'
import { Input, Select, CheckboxGroup, Button, Card } from '../../../design-system'
import type { ProjectDetails, Resource } from '../../../schemes'
import { useUpdateResource, useUpdateResourceProjectDetails } from '../../../api'
import { Controller, useFormContext, type FieldPath } from 'react-hook-form'
import type { MasterFormValues } from '../ResourceEditor'

type Props = {
  resource: Resource
  anyChangesProjectDetails: boolean
}

const CATEGORY_OPTIONS = [
  { value: '', label: 'Select category' },
  { value: 'internal', label: 'Internal' },
  { value: 'external', label: 'External' },
  { value: 'vendor', label: 'Vendor' },
]
const TEAM_OPTIONS = ['FE devs', 'BE devs', 'Designer', 'Data Eng', 'Product Owner']

const EditProjectDetails = ({ resource, anyChangesProjectDetails }: Props) => {
  const { resourceId, projectDetails, basicInfo, status } = resource

  const updateProjectDetails = useUpdateResourceProjectDetails()
  const updateResource = useUpdateResource()

  const {
    control,
    trigger,
    getValues,
    resetField,
    formState: { errors },
  } = useFormContext<MasterFormValues>()

  const isBasicInfoComplete = !!basicInfo.description

  const handleSaveProjectDetails = async () => {
    const isSectionValid = await trigger('projectDetails')

    if (isSectionValid) {
      const values = getValues('projectDetails') as ProjectDetails
      if (status === 'completed') {
        updateResource.mutate({
          ...resource,
          projectDetails: values,
        })
      } else {
        updateProjectDetails.mutate({
          resourceId,
          projectDetails: values,
        })
      }
    }
  }

  const handleCancelModuleChanges = () => {
    Object.keys(projectDetails).forEach((key) => {
      const path = `projectDetails.${key}` as FieldPath<MasterFormValues>
      resetField(path)
    })
  }

  return (
    <Module variant="elevated">
      <FormContent>
        <h3>Project Details</h3>
        <Grid>
          <Controller
            control={control}
            name="projectDetails.projectName"
            render={({ field }) => (
              <Input
                label="Project Name"
                {...field}
                state={isBasicInfoComplete ? 'normal' : 'locked'}
                error={errors.projectDetails?.projectName?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="projectDetails.budget"
            render={({ field }) => (
              <Input
                label="Budget"
                {...field}
                state={isBasicInfoComplete ? 'normal' : 'locked'}
                helperText={
                  isBasicInfoComplete
                    ? field.value
                      ? undefined
                      : 'No budget provided'
                    : 'Please complete the basic info section first.'
                }
                error={errors.projectDetails?.budget?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="projectDetails.category"
            render={({ field }) => (
              <Select
                label="Category"
                options={CATEGORY_OPTIONS}
                {...field}
                state={isBasicInfoComplete ? 'normal' : 'locked'}
                error={errors.projectDetails?.category?.message}
              />
            )}
          />

          {/* NOTE: I'm not sure if this was intended but neither in the task description nor in the API specification
            it wasnt specified that "Options" fiels is actually Team Members which accept only specified string values
            and not ANY array of strings. I found the correct values in the backend code and later in the storybook example, 
            but at first I was a bit confused why my random strings gave me an error response.  */}

          <Controller
            control={control}
            name="projectDetails.options"
            render={({ field }) => (
              <CheckboxGroup
                label="Team Members"
                options={TEAM_OPTIONS}
                value={field.value || []}
                onChange={field.onChange}
                disabled={!isBasicInfoComplete}
                error={errors.projectDetails?.options?.message}
              />
            )}
          />
        </Grid>
        <Footer>
          <Button
            type="button"
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
            type="button"
            style={{
              width: 'fit-content',
            }}
            onClick={handleSaveProjectDetails}
            state={
              isBasicInfoComplete
                ? anyChangesProjectDetails
                  ? 'normal'
                  : 'disabled'
                : 'locked'
            }
          >
            {updateProjectDetails.isPending ? 'Saving...' : 'Save project changes'}
          </Button>
        </Footer>
      </FormContent>
    </Module>
  )
}
const Module = styled(Card)`
  display: flex;
  flex-direction: column;
  flex: 1;
`
const FormContent = styled.div`
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
