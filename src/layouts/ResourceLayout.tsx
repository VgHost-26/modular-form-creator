import ResourcesListView from '../components/resources/ResourcesListView'
import ResourceEditView from '../components/resources/ResourceEditView'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'

const MainLayout = () => {
  const { resourceId } = useParams()

  return (
    <ResourceLayout>
      {resourceId ? <ResourceEditView /> : <ResourcesListView />}
    </ResourceLayout>
  )
}

const ResourceLayout = styled.div`
  display: flex;
  gap: 0.25rem;
  flex-direction: row;
  height: 100dvh;
  width: 100dvw;
  padding: 0.5rem;
`
export default MainLayout
