import styled from 'styled-components'
import ResourcesList from './components/ResourcesList/ResourcesList'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

function App() {
  return (
    <AppShell>
      <QueryClientProvider client={queryClient}>
        <ResourcesList />
      </QueryClientProvider>
    </AppShell>
  )
}

const AppShell = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`

export default App
