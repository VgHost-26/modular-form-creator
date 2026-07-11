import { useNavigate, useParams } from 'react-router-dom'
import { useGetResourceById } from '../../api'
import ResourceEditor from './ResourceEditor'

const ResourceEditView = () => {
  const { resourceId } = useParams()
  const navigate = useNavigate()
  const {
    data: resource,
    isLoading,
    error,
  } = useGetResourceById(resourceId ? Number(resourceId) : NaN)

  if (!resourceId) {
    return <div>Missing resource id</div>
  }

  if (isLoading || !resource) {
    return <div>Loading resource...</div>
  }

  if (error) {
    return <div>Error loading resource: {error.message}</div>
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

export default ResourceEditView
