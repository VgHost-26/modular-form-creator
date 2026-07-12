import { Badge, Button, Card, IconButton } from '../../design-system'
import {
  useUpdateResource,
  useUpdateResourceBasicInfo,
  useUpdateResourceProjectDetails,
} from '../../api'
import styled from 'styled-components'
import { ChevronLeftIcon } from 'lucide-react'
import ProvisionButton from '../specializedButtons/ProvisionButton'
import DeleteResourceButton from '../specializedButtons/DeleteResourceButton'
import EditBasicInfo from './modules/EditBasicInfo'
import EditProjectDetails from './modules/EditProjectDetails'
import { FormProvider, useForm } from 'react-hook-form'
import z from 'zod'
import type { Resource } from '../../schemes'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import type { DetailsModes } from '../../schemes/models'

const basicInfoSchema = z.object({
  resourceName: z.string().trim().min(1, 'Resource name is required'),
  owner: z.string().trim().min(1, 'Owner is required'),
  email: z.email('Enter a valid email address'),
  priority: z.enum(['low', 'medium', 'high']),
  description: z.string().trim().min(1, 'Description is required'),
})

const projectDetailsSchema = z.object({
  projectName: z.string().trim().min(1, 'Project name is required'),
  budget: z
    .string()
    .trim()
    .min(1, 'Budget is required')
    .max(10, 'Be realistic')
    .regex(/^\d+$/, 'Budget must be a number'),
  category: z.string().trim().min(1, 'Category is required'),
  options: z.array(z.string()).min(1, 'Select at least one team member'),
})

const masterSchema = z.object({
  basicInfo: basicInfoSchema,
  projectDetails: projectDetailsSchema,
})

export type MasterFormValues = z.infer<typeof masterSchema>

type Props = {
  resource: Resource
  mode: DetailsModes
}
const getTitle = (mode: DetailsModes) => {
  switch (mode) {
    case 'basic-info':
      return 'Edit Basic Info'
    case 'project-details':
      return 'Edit Project Details'
    case 'details':
      return 'Resource Details'
    default:
      return 'Edit Resource'
  }
}

const ResourceEditor = ({ resource, mode }: Props) => {
  const { resourceId, status, basicInfo, projectDetails } = resource

  const updateResource = useUpdateResource()
  const updateBasicInfo = useUpdateResourceBasicInfo()
  const updateProjectDetails = useUpdateResourceProjectDetails()

  const navigate = useNavigate()

  const methods = useForm<MasterFormValues>({
    resolver: zodResolver(masterSchema),
    defaultValues: {
      basicInfo,
      projectDetails,
    },
    mode: 'onSubmit',
  })
  const {
    formState: { dirtyFields },
  } = methods

  const anyChangesBasicInfo = !!dirtyFields.basicInfo
  const anyChangesProjectDetails = !!dirtyFields.projectDetails

  const handleSaveAll = async (formValues: MasterFormValues) => {
    /* 
    When Provisioned use PUT othervise PATCH separatly to not confuse the user
    with different behavior in the same form 
     */
    if (status === 'completed') {
      await updateResource.mutateAsync({ ...resource, ...formValues })
      navigate(`/`)
      return
    }

    if (anyChangesBasicInfo) {
      await updateBasicInfo.mutateAsync({
        resourceId,
        basicInfo: formValues.basicInfo,
      })
    }
    if (anyChangesProjectDetails) {
      await updateProjectDetails.mutateAsync({
        resourceId,
        projectDetails: formValues.projectDetails,
      })
    }
  }
  const handleCancel = () => {
    navigate(`/`)
  }

  return (
    <FormProvider {...methods}>
      <LayoutContainer variant="elevated">
        <form
          noValidate
          onSubmit={methods.handleSubmit(handleSaveAll)}
          style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: '1rem' }}
        >
          <Header>
            <IconButton type="button" size="small" onClick={handleCancel}>
              <ChevronLeftIcon />
            </IconButton>
            <span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h2>{getTitle(mode)}</h2>
                <Badge variant={status === 'completed' ? 'success' : 'info'}>
                  {status}
                </Badge>
              </span>
              <p>Resource #{resourceId}</p>
            </span>
            <span
              style={{
                marginLeft: 'auto',
                display: 'flex',
                gap: '0.5rem',
                alignItems: 'flex-end',
              }}
            >
              {mode === 'details' && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => navigate(`/resources/${resourceId}`)}
                >
                  Edit
                </Button>
              )}
              <ProvisionButton resource={resource} />
              <DeleteResourceButton
                resource={resource}
                variant="secondary"
                onDelete={() => navigate('/resources')}
              />
            </span>
          </Header>
          <ModulesWrapper>
            {mode !== 'project-details' && (
              <EditBasicInfo
                readonly={mode === 'details'}
                resource={resource}
                anyChangesBasicInfo={anyChangesBasicInfo}
                mode={mode}
              />
            )}
            {mode !== 'basic-info' && (
              <EditProjectDetails
                readonly={mode === 'details'}
                resource={resource}
                anyChangesProjectDetails={anyChangesProjectDetails}
                mode={mode}
              />
            )}
          </ModulesWrapper>
          {mode === 'edit' && (
            <Footer>
              <Button type="button" variant="secondary" onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  updateResource.isPending ||
                  (!anyChangesBasicInfo && !anyChangesProjectDetails)
                }
              >
                {updateResource.isPending ? 'Saving...' : 'Save all changes'}
              </Button>
            </Footer>
          )}
        </form>
      </LayoutContainer>
    </FormProvider>
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
