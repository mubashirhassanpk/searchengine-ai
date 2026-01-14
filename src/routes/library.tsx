import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { Clock, Bookmark, Folder, X, Plus, Search, Trash2 } from 'lucide-react'

export const Route = createFileRoute('/library')({
  component: LibraryPage,
})

interface SearchHistoryItem {
  id: string
  query: string
  time: string
  timestamp: number
}

interface SavedItem {
  id: string
  title: string
  source: string
  date: string
  url: string
}

interface Collection {
  id: string
  name: string
  count: number
  items: string[]
}

function LibraryPage() {
  const navigate = useNavigate()
  
  const [recentSearches, setRecentSearches] = useState<SearchHistoryItem[]>([
    { id: '1', query: 'Latest tech news', time: '2 hours ago', timestamp: Date.now() - 7200000 },
    { id: '2', query: 'Market trends analysis', time: '5 hours ago', timestamp: Date.now() - 18000000 },
    { id: '3', query: 'Climate change research', time: 'Yesterday', timestamp: Date.now() - 86400000 },
    { id: '4', query: 'AI developments 2024', time: 'Yesterday', timestamp: Date.now() - 90000000 },
    { id: '5', query: 'Quantum computing basics', time: '2 days ago', timestamp: Date.now() - 172800000 },
  ])

  const [savedItems, setSavedItems] = useState<SavedItem[]>([
    { id: '1', title: 'AI Industry Report', source: 'reuters.com', date: 'Dec 15', url: '#' },
    { id: '2', title: 'Tech Sector Analysis', source: 'bloomberg.com', date: 'Dec 14', url: '#' },
    { id: '3', title: 'Innovation Trends', source: 'wired.com', date: 'Dec 12', url: '#' },
  ])

  const [collections, setCollections] = useState<Collection[]>([
    { id: '1', name: 'Research', count: 12, items: [] },
    { id: '2', name: 'Work', count: 8, items: [] },
    { id: '3', name: 'Personal', count: 5, items: [] },
  ])

  const [newCollectionName, setNewCollectionName] = useState('')
  const [isAddingCollection, setIsAddingCollection] = useState(false)
  const [activeCollection, setActiveCollection] = useState<string | null>(null)

  const handleSearchClick = (query: string) => {
    navigate({ to: '/', search: { q: query } })
  }

  const handleDeleteSearch = (id: string) => {
    setRecentSearches(prev => prev.filter(item => item.id !== id))
  }

  const handleDeleteSaved = (id: string) => {
    setSavedItems(prev => prev.filter(item => item.id !== id))
  }

  const handleAddCollection = () => {
    if (newCollectionName.trim()) {
      const newCollection: Collection = {
        id: Date.now().toString(),
        name: newCollectionName.trim(),
        count: 0,
        items: []
      }
      setCollections(prev => [...prev, newCollection])
      setNewCollectionName('')
      setIsAddingCollection(false)
    }
  }

  const handleDeleteCollection = (id: string) => {
    setCollections(prev => prev.filter(c => c.id !== id))
    if (activeCollection === id) setActiveCollection(null)
  }

  const clearAllHistory = () => {
    setRecentSearches([])
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute bottom-0 right-0 pointer-events-none">
        <img 
          src="/images/strategic-planning-glass.png" 
          alt="" 
          className="w-[400px] h-[400px] object-cover opacity-10"
        />
      </div>

      <div className="max-w-4xl mx-auto px-8 py-12 relative z-10">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Library</h1>
        <p className="text-gray-500 mb-10">Your search history and saved items</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Searches */}
          <div className="lg:col-span-2">
            <section className="mb-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-gray-400" />
                  <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Recent Searches
                  </h2>
                </div>
                {recentSearches.length > 0 && (
                  <button 
                    onClick={clearAllHistory}
                    className="text-xs text-gray-400 hover:text-gray-600"
                  >
                    Clear all
                  </button>
                )}
              </div>
              {recentSearches.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <Search size={24} className="mx-auto mb-2 opacity-50" />
                  <p>No recent searches</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {recentSearches.map((item) => (
                    <div
                      key={item.id}
                      className="group flex items-center justify-between w-full px-4 py-3 hover:bg-gray-50 rounded-lg"
                    >
                      <button
                        onClick={() => handleSearchClick(item.query)}
                        className="flex-1 text-left text-gray-700 hover:text-gray-900"
                      >
                        {item.query}
                      </button>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-400">{item.time}</span>
                        <button
                          onClick={() => handleDeleteSearch(item.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-gray-600"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Saved Items */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Bookmark size={16} className="text-gray-400" />
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Saved Items
                </h2>
              </div>
              {savedItems.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <Bookmark size={24} className="mx-auto mb-2 opacity-50" />
                  <p>No saved items</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {savedItems.map((item) => (
                    <div
                      key={item.id}
                      className="group flex items-center justify-between px-4 py-3 border border-gray-200 rounded-lg hover:border-gray-300"
                    >
                      <a href={item.url} className="flex-1">
                        <p className="font-medium text-gray-900">{item.title}</p>
                        <p className="text-sm text-gray-500 mt-0.5">{item.source}</p>
                      </a>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-400">{item.date}</span>
                        <button
                          onClick={() => handleDeleteSaved(item.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Collections Sidebar */}
          <aside>
            <div className="flex items-center gap-2 mb-4">
              <Folder size={16} className="text-gray-400" />
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Collections
              </h2>
            </div>
            <div className="space-y-2">
              {collections.map((collection) => (
                <div
                  key={collection.id}
                  className={`group flex items-center justify-between w-full px-4 py-3 text-left border rounded-lg cursor-pointer ${
                    activeCollection === collection.id 
                      ? 'border-gray-400 bg-gray-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setActiveCollection(
                    activeCollection === collection.id ? null : collection.id
                  )}
                >
                  <span className="text-gray-700">{collection.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                      {collection.count}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteCollection(collection.id)
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500"
                    >
                      <X size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {isAddingCollection ? (
              <div className="mt-4 flex gap-2">
                <input
                  type="text"
                  value={newCollectionName}
                  onChange={(e) => setNewCollectionName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddCollection()}
                  placeholder="Collection name"
                  className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
                  autoFocus
                />
                <button
                  onClick={handleAddCollection}
                  className="px-3 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800"
                >
                  Add
                </button>
                <button
                  onClick={() => {
                    setIsAddingCollection(false)
                    setNewCollectionName('')
                  }}
                  className="px-3 py-2 text-gray-500 text-sm hover:text-gray-700"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setIsAddingCollection(true)}
                className="w-full mt-4 px-4 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg flex items-center justify-center gap-2"
              >
                <Plus size={14} />
                New Collection
              </button>
            )}
          </aside>
        </div>
      </div>
    </div>
  )
}
