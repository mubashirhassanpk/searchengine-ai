import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { SearchBox } from '../components/SearchBox'
import { ResultView } from '../components/ResultView'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  const [query, setQuery] = useState('')
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      setQuery(searchQuery)
      setHasSearched(true)
    }
  }

  const handleNewSearch = (newQuery: string) => {
    setQuery(newQuery)
  }

  const handleBackToHome = () => {
    setQuery('')
    setHasSearched(false)
  }

  if (hasSearched) {
    return (
      <ResultView 
        query={query} 
        onNewSearch={handleNewSearch}
        onBackToHome={handleBackToHome}
      />
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background Decorative Images */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <img 
          src="/images/navigation-glass.png" 
          alt="" 
          className="absolute -top-20 -right-32 w-96 h-96 object-cover opacity-20 blur-sm"
        />
        <img 
          src="/images/strategic-planning-glass.png" 
          alt="" 
          className="absolute -bottom-20 -left-32 w-96 h-96 object-cover opacity-20 blur-sm"
        />
      </div>

      <div className="w-full max-w-3xl mx-auto relative z-10">
        {/* Hero Text */}
        <h1 className="text-4xl md:text-5xl font-medium text-gray-900 text-center mb-10 tracking-tight">
          Where knowledge begins
        </h1>

        {/* Search Box */}
        <SearchBox onSearch={handleSearch} />

        {/* Suggested Query Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
          {[
            'Latest Tech News',
            'Market Trends',
            'AI Research Papers',
            'Climate Data',
          ].map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => handleSearch(suggestion)}
              className="px-3 py-1.5 text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-full hover:bg-gray-100 hover:text-gray-800"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
