import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '@/shared/context/AuthContext'
import { MenuConfigProvider } from '@/shared/context/MenuConfigContext'
import { AppRouter } from '@/app/router'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <MenuConfigProvider>
          <AppRouter />
        </MenuConfigProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
