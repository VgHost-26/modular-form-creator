import { Controller, useFormContext, type FieldPath } from 'react-hook-form'
import styled from 'styled-components'
import { Input, Select, Button, Card, Badge } from '../../../design-system'
import type { BasicInfo, Resource } from '../../../schemes'
import { useUpdateResource, useUpdateResourceBasicInfo } from '../../../api'
import type { MasterFormValues } from '../ResourceEditor'
import { isBasicInfoComplete } from '../../../utils/helpers'
import { useNavigate } from 'react-router-dom'
import type { DetailsModes } from '../../../schemes/models'

type Props = {
  resource: Resource
  anyChangesBasicInfo: boolean
  readonly?: boolean
  mode: DetailsModes
}

const PRIORITY_OPTIONS = [
  { value: '', label: 'Select priority' },
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
]

const EditBasicInfo = ({
  resource,
  anyChangesBasicInfo,
  readonly = false,
  mode,
}: Props) => {
  const { resourceId, basicInfo, status } = resource

  const updateBasicInfo = useUpdateResourceBasicInfo()
  const updateResource = useUpdateResource()
  const basicInfoCompleted = isBasicInfoComplete(basicInfo)

  const navigate = useNavigate()

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
        await updateBasicInfo.mutateAsync({
          resourceId,
          basicInfo: values,
        })
        navigate(`/resources/${resourceId}/project-details`)
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
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          Basic Info
          {basicInfoCompleted ? (
            <Badge variant="success">✓</Badge>
          ) : (
            <Badge variant="neutral">X</Badge>
          )}
        </h3>
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
              <Input
                label="Owner"
                {...field}
                error={errors.basicInfo?.owner?.message}
                disabled={readonly}
              />
            )}
          />
          <Controller
            control={control}
            name="basicInfo.email"
            render={({ field }) => (
              <Input
                label="Email"
                {...field}
                error={errors.basicInfo?.email?.message}
                disabled={readonly}
              />
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
                disabled={readonly}
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
                  disabled={readonly}
                />
              )}
            />
          </div>
        </Grid>
        {!readonly && mode !== 'edit' ? (
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
        ) : null}
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
