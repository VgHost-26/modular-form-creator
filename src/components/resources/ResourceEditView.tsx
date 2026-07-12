import { useNavigate, useParams } from 'react-router-dom'
import { useGetResourceById } from '../../api'
import ResourceEditor from './ResourceEditor'
import styled from 'styled-components'

const ResourceEditView = () => {
  const { resourceId } = useParams()
  const navigate = useNavigate()
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
    <ResourceEditor
      key={JSON.stringify(resource)}
      resource={resource}
      onCancel={() => navigate('/')}
      onSaved={() => navigate('/')}
    />
  )
}

const Message = styled.h2`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
`

export default ResourceEditView
