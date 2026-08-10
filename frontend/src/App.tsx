import {
  Outlet,
  RouterProvider,
  createRouter,
  createRoute,
  createRootRoute,
} from '@tanstack/react-router'
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query'

const queryClient = new QueryClient()

const rootRoute = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  )
}

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: IndexComponent,
})

const routeTree = rootRoute.addChildren([indexRoute])

const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

type User = {
  id: number
  name: string
  email: string
  created_at: string
  updated_at: string
}

async function fetchUsers(): Promise<User[]> {
  const response = await fetch('http://localhost:8000/api/users')
  if (!response.ok) {
    throw new Error('Network response was not ok')
  }
  return response.json()
}

function IndexComponent() {
  const { data, error, isLoading, isError, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    enabled: false,
  })

  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <button 
        onClick={() => refetch()} 
        style={{ padding: '0.75rem 1.5rem', marginBottom: '1.5rem', cursor: 'pointer', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: '#f0f0f0', fontWeight: 'bold' }}
      >
        Fetch Users
      </button>

      {isLoading && <p>Loading users...</p>}
      
      {isError && <p>Error loading users: {error?.message}</p>}

      {data && (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={tableHeaderStyle}>ID</th>
              <th style={tableHeaderStyle}>Name</th>
              <th style={tableHeaderStyle}>Email</th>
              <th style={tableHeaderStyle}>Created At</th>
              <th style={tableHeaderStyle}>Updated At</th>
            </tr>
          </thead>
          <tbody>
            {data.map((user) => (
              <tr key={user.id}>
                <td style={tableCellStyle}>{user.id}</td>
                <td style={tableCellStyle}>{user.name}</td>
                <td style={tableCellStyle}>{user.email}</td>
                <td style={tableCellStyle}>{new Date(user.created_at).toLocaleString()}</td>
                <td style={tableCellStyle}>{new Date(user.updated_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

const tableHeaderStyle = {
  borderBottom: '2px solid #ccc',
  padding: '0.75rem',
  textAlign: 'left' as const,
  backgroundColor: '#fafafa',
}

const tableCellStyle = {
  borderBottom: '1px solid #eee',
  padding: '0.75rem',
}

export function App() {
  return <RouterProvider router={router} />
}
