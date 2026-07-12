import styled from 'styled-components'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import ResourceEditView from './components/resourceEditor/ResourceEditView'
import ResourcesListView from './components/resourcesList/ResourcesListView'

const queryClient = new QueryClient()

function App() {
  return (
    <AppShell>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<ResourcesListView />} />
            <Route path="/resources/:resourceId/edit" element={<ResourceEditView />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
        <ToastContainer position="bottom-left" />
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
