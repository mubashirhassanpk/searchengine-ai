import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { TrendingUp, Zap, Globe, BookOpen, Search, ArrowRight } from 'lucide-react'

export const Route = createFileRoute('/discover')({
  component: DiscoverPage,
})

function DiscoverPage() {
  const navigate = useNavigate()

  const trendingTopics = [
    { title: 'Artificial Intelligence', description: 'Latest developments in AI and machine learning', icon: Zap, queries: ['What is GPT-5?', 'AI in healthcare', 'Machine learning trends'] },
    { title: 'Global Markets', description: 'Financial trends and economic analysis', icon: TrendingUp, queries: ['Stock market forecast', 'Crypto trends 2024', 'Interest rate predictions'] },
    { title: 'World News', description: 'Current events from around the globe', icon: Globe, queries: ['Breaking news today', 'Political updates', 'International relations'] },
    { title: 'Research Papers', description: 'Academic publications and studies', icon: BookOpen, queries: ['Latest science papers', 'Medical research', 'Technology studies'] },
  ]

  const featuredQueries = [
    'What are the latest breakthroughs in quantum computing?',
    'How is climate change affecting global agriculture?',
    'What are the best practices for remote work productivity?',
    'How do large language models work?',
    'What are the emerging trends in renewable energy?',
    'How is blockchain being used outside of cryptocurrency?',
  ]

  const handleSearch = (query: string) => {
    navigate({ to: '/', search: { q: query } })
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute top-0 right-0 w-1/2 h-full pointer-events-none">
        <img 
          src="/images/data-discovery-glass.png" 
          alt="" 
          className="absolute top-20 right-0 w-[500px] h-[500px] object-cover opacity-15"
        />
      </div>

      <div className="max-w-4xl mx-auto px-8 py-12 relative z-10">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Discover</h1>
        <p className="text-gray-500 mb-10">Explore trending topics and popular queries</p>

        {/* Trending Categories */}
        <section className="mb-12">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">
            Trending Categories
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {trendingTopics.map((topic) => {
              const Icon = topic.icon
              return (
                <div
                  key={topic.title}
                  className="group p-4 text-left border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50/50 backdrop-blur-sm"
                >
                  <div className="flex items-start gap-4 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <Icon size={20} className="text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{topic.title}</h3>
                      <p className="text-sm text-gray-500 mt-0.5">{topic.description}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3 pl-14">
                    {topic.queries.map((query) => (
                      <button
                        key={query}
                        onClick={() => handleSearch(query)}
                        className="text-xs px-2 py-1 bg-white border border-gray-200 rounded-full text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      >
                        {query}
                      </button>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Featured Queries */}
        <section>
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">
            Popular Queries
          </h2>
          <div className="space-y-1">
            {featuredQueries.map((query, index) => (
              <button
                key={index}
                onClick={() => handleSearch(query)}
                className="group flex items-center justify-between w-full text-left px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg"
              >
                <span className="flex items-center gap-3">
                  <Search size={14} className="text-gray-400" />
                  {query}
                </span>
                <ArrowRight size={14} className="text-gray-300 group-hover:text-gray-500" />
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
