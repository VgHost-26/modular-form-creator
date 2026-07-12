import { Controller, useFormContext, type FieldPath } from 'react-hook-form'
import styled from 'styled-components'
import { Input, Select, Button, Card } from '../../../design-system'
import type { BasicInfo, Resource } from '../../../schemes'
import { useUpdateResource, useUpdateResourceBasicInfo } from '../../../api'
import type { MasterFormValues } from '../ResourceEditor'

type Props = {
  resource: Resource
  anyChangesBasicInfo: boolean
}

const PRIORITY_OPTIONS = [
  { value: '', label: 'Select priority' },
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
]

const EditBasicInfo = ({ resource, anyChangesBasicInfo }: Props) => {
  const { resourceId, basicInfo, status } = resource

  const updateBasicInfo = useUpdateResourceBasicInfo()
  const updateResource = useUpdateResource()

  const {
    control,
    trigger,
    getValues,
    resetField,
    formState: { errors },
  } = useFormContext<MasterFormValues>()

  const handleSaveBasicInfo = async () => {
    const isSectionValid = await trigger('basicInfo')

    if (isSectionValid) {
      const values = getValues('basicInfo') as BasicInfo
      if (status === 'completed') {
        updateResource.mutate({
          ...resource,
          basicInfo: values,
        })
      } else {
        updateBasicInfo.mutate({
          resourceId,
          basicInfo: values,
        })
      }
    }
  }

  const handleCancelModuleChanges = () => {
    Object.keys(basicInfo).forEach((key) => {
      const path = `basicInfo.${key}` as FieldPath<MasterFormValues>
      resetField(path)
    })
  }

  return (
    <Module variant="elevated">
      <FormContent>
        <h3>Basic Info</h3>
        <Grid>
          <Input
            label="Resource Name"
            value={basicInfo.resourceName}
            state="locked"
            helperText="Resource name cannot be changed."
          />

          <Controller
            control={control}
            name="basicInfo.owner"
            render={({ field }) => (
              <Input label="Owner" {...field} error={errors.basicInfo?.owner?.message} />
            )}
          />
          <Controller
            control={control}
            name="basicInfo.email"
            render={({ field }) => (
              <Input label="Email" {...field} error={errors.basicInfo?.email?.message} />
            )}
          />
          <Controller
            control={control}
            name="basicInfo.priority"
            render={({ field }) => (
              <Select
                label="Priority"
                options={PRIORITY_OPTIONS}
                {...field}
                error={errors.basicInfo?.priority?.message}
              />
            )}
          />
          <div style={{ gridColumn: '1/-1' }}>
            <Controller
              control={control}
              name="basicInfo.description"
              render={({ field }) => (
                <Input
                  label="Description"
                  multiline
                  {...field}
                  error={errors.basicInfo?.description?.message}
                />
              )}
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
            type="button"
            style={{
              alignSelf: 'flex-end',
              width: 'fit-content',
              justifySelf: 'flex-end',
            }}
            onClick={handleSaveBasicInfo}
            disabled={!anyChangesBasicInfo || updateBasicInfo.isPending}
          >
            {updateBasicInfo.isPending ? 'Saving...' : 'Save info changes'}
          </Button>
        </Footer>
      </FormContent>
    </Module>
  )
}

const Module = styled(Card)`
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
export default EditBasicInfo
