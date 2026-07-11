import { Badge, Button, Card } from '../../design-system'
import type { Resource } from '../../schemes'
import styled from 'styled-components'

type Props = {
  resource: Resource
  onEdit?: () => void
}

const formatDate = (value: string) => {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

const getStatusVariant = (status: Resource['status']) => {
  return status === 'completed' ? 'success' : 'info'
}

const ResourceDetails = ({ resource, onEdit }: Props) => {
  return (
    <DetailsCard variant="elevated">
      <Header>
        <div>
          <Title>{resource.name}</Title>
          <SubtleText>Resource #{resource.resourceId}</SubtleText>
        </div>
        <HeaderActions>
          <Button variant="secondary" onClick={onEdit}>
            Edit
          </Button>
          <Badge variant={getStatusVariant(resource.status)}>{resource.status}</Badge>
        </HeaderActions>
      </Header>

      <Section>
        <SectionTitle>Overview</SectionTitle>
        <Grid>
          <Field>
            <Label>Created</Label>
            <Value>{formatDate(resource.createdAt)}</Value>
          </Field>
          <Field>
            <Label>Updated</Label>
            <Value>{formatDate(resource.updatedAt)}</Value>
          </Field>
        </Grid>
      </Section>

      <Section>
        <SectionTitle>Basic Info</SectionTitle>
        <Grid>
          <Field>
            <Label>Resource Name</Label>
            <Value>{resource.basicInfo.resourceName || 'No resource name provided'}</Value>
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
                <Badge variant={resource.basicInfo.priority === 'high' ? 'warning' : 'info'}>
                  {resource.basicInfo.priority}
                </Badge>
              ) : (
                'No priority set'
              )}
            </Value>
          </Field>
          <Field $span={2}>
            <Label>Description</Label>
            <Value>{resource.basicInfo.description || 'No description provided'}</Value>
          </Field>
        </Grid>
      </Section>

      <Section>
        <SectionTitle>Project Details</SectionTitle>
        <Grid>
          <Field>
            <Label>Project Name</Label>
            <Value>{resource.projectDetails.projectName || 'No project name provided'}</Value>
          </Field>
          <Field>
            <Label>Budget</Label>
            <Value>{resource.projectDetails.budget || 'No budget provided'}</Value>
          </Field>
          <Field>
            <Label>Category</Label>
            <Value>{resource.projectDetails.category || 'No category provided'}</Value>
          </Field>
          <Field $span={2}>
            <Label>Options</Label>
            <Tags>
              {resource.projectDetails.options.length > 0 ? (
                resource.projectDetails.options.map((option) => (
                  <Badge key={option} variant="neutral">
                    {option}
                  </Badge>
                ))
              ) : (
                <SubtleText>No options selected</SubtleText>
              )}
            </Tags>
          </Field>
        </Grid>
      </Section>
    </DetailsCard>
  )
}

const DetailsCard = styled(Card)`
  gap: ${({ theme }) => theme.spacing.xl};
`

const Header = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
`

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
`

const Title = styled.h2`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
`

const SubtleText = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.inkMuted};
`

const Section = styled.section`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
`

const SectionTitle = styled.h3`
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`

const Field = styled.div<{ $span?: number }>`
  grid-column: span ${({ $span }) => $span ?? 1};
  display: grid;
  gap: 0.35rem;
`

const Label = styled.span`
  font-size: 0.85rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.inkMuted};
  text-transform: uppercase;
  letter-spacing: 0.04em;
`

const Value = styled.div`
  color: ${({ theme }) => theme.colors.inkStrong};
  word-break: break-word;
`

const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
`

export default ResourceDetails
