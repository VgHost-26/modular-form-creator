import { useParams } from 'react-router-dom'
import { useGetResourceById } from '../../api'
import ResourceEditor from './ResourceEditor'
import styled from 'styled-components'
import type { DetailsModes } from '../../schemes/models'

type Props = {
  mode: DetailsModes
}

const ResourceEditView = ({ mode }: Props) => {
  const { resourceId } = useParams()
  const {
    data: resource,
    isLoading,
    error,
  } = useGetResourceById(resourceId ? Number(resourceId) : NaN)

  if (!resourceId) {
    return <Message>Missing resource id</Message>
  }

  if (isLoading) {
    return (
      <Message>
        Loading resource...
        <progress></progress>
      </Message>
    )
  }

  if (error || !resource) {
    if (error?.response?.status === 404) {
      return <Message>Resource not found</Message>
    }
    return <div>Error loading resource, {error?.response?.data.message}</div>
  }

  return (
    <Wrapper>
      <ResourceEditor key={JSON.stringify(resource)} resource={resource} mode={mode} />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  gap: 0.25rem;
  flex-direction: row;
  height: 100dvh;
  width: 100dvw;
  padding: 0.5rem;
`
const Message = styled.h2`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
`

export default ResourceEditView
