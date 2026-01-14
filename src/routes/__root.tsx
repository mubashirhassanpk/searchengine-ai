import { createRootRoute, Outlet, Link, useLocation } from '@tanstack/react-router'
import { Home, Compass, Library, User } from 'lucide-react'

export const Route = createRootRoute({
  component: RootLayout,
})

function RootLayout() {
  const location = useLocation()
  const currentPath = location.pathname

  const navItems = [
    { icon: Home, path: '/', label: 'Home' },
    { icon: Compass, path: '/discover', label: 'Discover' },
    { icon: Library, path: '/library', label: 'Library' },
    { icon: User, path: '/profile', label: 'Profile' },
  ]

  return (
    <div className="flex min-h-screen bg-white">
      {/* Fixed Left Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-16 bg-[#f8f8f7] border-r border-gray-200 flex flex-col items-center py-6 z-50">
        {/* Logo */}
        <div className="mb-8">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
            <span className="text-white font-bold text-sm">IC</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col items-center gap-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = currentPath === item.path || 
              (item.path !== '/' && currentPath.startsWith(item.path))
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`group relative w-10 h-10 flex items-center justify-center rounded-lg ${
                  isActive 
                    ? 'bg-gray-200 text-gray-900' 
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                }`}
                title={item.label}
              >
                <Icon size={20} strokeWidth={1.5} />
                
                {/* Tooltip */}
                <span className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                  {item.label}
                </span>
              </Link>
            )
          })}
        </nav>

        {/* Bottom indicator */}
        <div className="mt-auto">
          <div className="w-2 h-2 rounded-full bg-green-500" title="Connected" />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-16">
        <Outlet />
      </main>
    </div>
  )
}
