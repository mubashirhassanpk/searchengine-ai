import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { User, Settings, Bell, Shield, LogOut, Moon, Sun, Check } from 'lucide-react'

export const Route = createFileRoute('/profile')({
  component: ProfilePage,
})

function ProfilePage() {
  const [name, setName] = useState('Alex Johnson')
  const [email, setEmail] = useState('alex@example.com')
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    weekly: true
  })
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute top-0 right-0 pointer-events-none">
        <img 
          src="/images/navigation-glass.png" 
          alt="" 
          className="w-[450px] h-[450px] object-cover opacity-10"
        />
      </div>

      <div className="max-w-2xl mx-auto px-8 py-12 relative z-10">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Profile</h1>
        <p className="text-gray-500 mb-10">Manage your account settings and preferences</p>

        {/* Profile Section */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <User size={16} className="text-gray-400" />
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Account
            </h2>
          </div>
          
          <div className="space-y-4 p-6 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-600 text-xl font-semibold">
                {name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{name}</h3>
                <p className="text-sm text-gray-500">{email}</p>
              </div>
            </div>
            
            <div className="grid gap-4 pt-4 border-t border-gray-100">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 text-gray-900"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Preferences Section */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Settings size={16} className="text-gray-400" />
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Preferences
            </h2>
          </div>
          
          <div className="p-6 border border-gray-200 rounded-lg space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Appearance</h3>
                <p className="text-sm text-gray-500">Choose your preferred theme</p>
              </div>
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border ${
                  isDarkMode 
                    ? 'bg-gray-900 text-white border-gray-900' 
                    : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                }`}
              >
                {isDarkMode ? <Moon size={16} /> : <Sun size={16} />}
                <span className="text-sm">{isDarkMode ? 'Dark' : 'Light'}</span>
              </button>
            </div>
          </div>
        </section>

        {/* Notifications Section */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Bell size={16} className="text-gray-400" />
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Notifications
            </h2>
          </div>
          
          <div className="p-6 border border-gray-200 rounded-lg space-y-4">
            {[
              { key: 'email', label: 'Email Notifications', desc: 'Receive updates via email' },
              { key: 'push', label: 'Push Notifications', desc: 'Browser push notifications' },
              { key: 'weekly', label: 'Weekly Digest', desc: 'Summary of your activity' },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">{item.label}</h3>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
                <button
                  onClick={() => setNotifications(prev => ({ 
                    ...prev, 
                    [item.key]: !prev[item.key as keyof typeof notifications] 
                  }))}
                  className={`w-12 h-6 rounded-full relative ${
                    notifications[item.key as keyof typeof notifications]
                      ? 'bg-gray-900'
                      : 'bg-gray-200'
                  }`}
                >
                  <span 
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow ${
                      notifications[item.key as keyof typeof notifications]
                        ? 'right-1'
                        : 'left-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Privacy Section */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Shield size={16} className="text-gray-400" />
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Privacy
            </h2>
          </div>
          
          <div className="p-6 border border-gray-200 rounded-lg">
            <button className="text-sm text-gray-700 hover:text-gray-900">
              Download my data
            </button>
            <span className="mx-4 text-gray-300">|</span>
            <button className="text-sm text-red-600 hover:text-red-700">
              Delete my account
            </button>
          </div>
        </section>

        {/* Save Button */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleSave}
            className={`px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 ${
              saved
                ? 'bg-green-600 text-white'
                : 'bg-gray-900 text-white hover:bg-gray-800'
            }`}
          >
            {saved ? (
              <>
                <Check size={16} />
                Saved
              </>
            ) : (
              'Save Changes'
            )}
          </button>
          
          <button className="px-6 py-2.5 text-gray-600 hover:text-gray-800 font-medium flex items-center gap-2">
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}
