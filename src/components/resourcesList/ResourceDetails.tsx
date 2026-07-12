import { Badge, Button, Card } from '../../design-system'
import type { Resource } from '../../schemes'
import styled from 'styled-components'

type Props = {
  resource: Resource
  onEdit?: () => void
}

const formatDate = (value: string) => {
  const date = new Date(value)
  const dateString = date.toLocaleDateString('pl-PL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
  const timeString = date.toLocaleTimeString('pl-PL', {
    hour: '2-digit',
    minute: '2-digit',
  })
  return (
    <>
      <span>{dateString}</span>
      <span>{timeString}</span>
    </>
  )
}

const getStatusVariant = (status: Resource['status']) => {
  return status === 'completed' ? 'success' : 'info'
}

const ResourceDetails = ({ resource, onEdit }: Props) => {
  return (
    <>
      <Card
        variant="elevated"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          overflow: 'hidden',
        }}
      >
        <Header>
          <div>
            <h2>{resource.name}</h2>
            <SubtleText>Resource #{resource.resourceId}</SubtleText>
          </div>
          <Badge variant={getStatusVariant(resource.status)}>{resource.status}</Badge>
        </Header>

        <Section>
          <h3>Overview</h3>
          <Grid>
            <Field>
              <Label>Created</Label>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {formatDate(resource.createdAt)}
              </div>
            </Field>
            <Field>
              <Label>Updated</Label>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {formatDate(resource.updatedAt)}
              </div>
            </Field>
          </Grid>
        </Section>
        <Section>
          <h3>Basic Info</h3>
          <Grid>
            <Field>
              <Label>Resource Name</Label>
              <Value>
                {resource.basicInfo.resourceName || 'No resource name provided'}
              </Value>
            </Field>
            <Field>
              <Label>Owner</Label>
              <Value>{resource.basicInfo.owner || 'No owner provided'}</Value>
            </Field>
            <Field>
              <Label>Email</Label>
              <Value>{resource.basicInfo.email || 'No email provided'}</Value>
            </Field>
            <Field>
              <Label>Priority</Label>
              <Value>
                {resource.basicInfo.priority ? (
                  <Badge
                    variant={resource.basicInfo.priority === 'high' ? 'warning' : 'info'}
                  >
                    {resource.basicInfo.priority}
                  </Badge>
                ) : (
                  'No priority set'
                )}
              </Value>
            </Field>
            <Field
              style={{
                gridColumn: 'span 2',
              }}
            >
              <Label>Description</Label>
              <Value title={resource.basicInfo.description || 'No description provided'}>
                {resource.basicInfo.description || 'No description provided'}
              </Value>
            </Field>
          </Grid>
        </Section>

        <Section>
          <h3>Project Details</h3>
          <Grid>
            <Field>
              <Label>Project Name</Label>
              <Value>
                {resource.projectDetails.projectName || 'No project name provided'}
              </Value>
            </Field>
            <Field>
              <Label>Budget</Label>
              <Value>{resource.projectDetails.budget || 'No budget provided'}</Value>
            </Field>
            <Field>
              <Label>Category</Label>
              <Value>{resource.projectDetails.category || 'No category provided'}</Value>
            </Field>
            <Field style={{ gridColumn: 'span 2' }}>
              <Label>Team Members</Label>
              <TeamMembersWrapper>
                {resource.projectDetails.options.length > 0 ? (
                  resource.projectDetails.options.map((option) => (
                    <Badge key={option} variant="neutral">
                      {option}
                    </Badge>
                  ))
                ) : (
                  <SubtleText>No options selected</SubtleText>
                )}
              </TeamMembersWrapper>
            </Field>
          </Grid>
        </Section>
      </Card>
      <Button onClick={onEdit}>Edit Resource</Button>
    </>
  )
}

const Header = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`

const SubtleText = styled.p`
  margin: 0;
`

const Section = styled(Card)`
  display: grid;
  gap: 0.5rem;
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`

const Field = styled.div`
  display: grid;
  gap: 0.25rem;
`

const Label = styled.span`
  font-size: 0.85rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primaryStrong};
  text-transform: uppercase;
  letter-spacing: 0.04em;
`

const Value = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const TeamMembersWrapper = styled.div`
  display: flex;
  gap: 0.25rem;
  flex-wrap: wrap;
`

export default ResourceDetails
