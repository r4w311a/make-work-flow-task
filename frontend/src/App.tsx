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
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  const response = await fetch(`${apiUrl}/api/users`)
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
    <div className="app-container">
      <div className="header">
        <h1>MAKE WORK FLOW</h1>
        <p>Technical Assessment</p>
      </div>

      <div className="action-bar">
        <button
          className="btn-primary"
          onClick={() => refetch()}
          disabled={isLoading}
        >
          {isLoading ? 'Fetching...' : 'Fetch Users'}
        </button>
      </div>

      {isError && <p className="status-message">Error loading users: {error?.message}</p>}

      {data && (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Created At</th>
                <th>Updated At</th>
              </tr>
            </thead>
            <tbody>
              {data.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{new Date(user.created_at).toLocaleString()}</td>
                  <td>{new Date(user.updated_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="footer">
        Developed by <span>Hussein Malkawi</span>
      </div>
    </div>
  )
}

export function App() {
  return <RouterProvider router={router} />
}
