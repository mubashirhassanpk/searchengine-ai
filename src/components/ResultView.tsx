import { useState, useEffect } from 'react'
import { SearchBox } from './SearchBox'
import { SourceCard } from './SourceCard'
import { ArrowLeft, Bookmark, Share2, Copy, Check, Loader2 } from 'lucide-react'
import { performSearch, SearchResponse } from '../lib/searchApi'

interface ResultViewProps {
  query: string
  source?: string
  onNewSearch: (query: string) => void
  onBackToHome: () => void
}

export function ResultView({ query, source = 'All', onNewSearch, onBackToHome }: ResultViewProps) {
  const [highlightedSource, setHighlightedSource] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaved, setIsSaved] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [searchResponse, setSearchResponse] = useState<SearchResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchResults = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        const response = await performSearch(query, source)
        setSearchResponse(response)
      } catch (err) {
        console.error('Search error:', err)
        setError('Failed to fetch results. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchResults()
  }, [query, source])

  const handleCitationHover = (sourceId: number) => {
    setHighlightedSource(sourceId)
  }

  const handleCitationLeave = () => {
    setHighlightedSource(null)
  }

  const handleSave = () => {
    setIsSaved(!isSaved)
    // Save to localStorage
    if (!isSaved && searchResponse) {
      const saved = JSON.parse(localStorage.getItem('savedSearches') || '[]')
      saved.push({
        query,
        timestamp: Date.now(),
        answer: searchResponse.answer.substring(0, 200)
      })
      localStorage.setItem('savedSearches', JSON.stringify(saved))
    }
  }

  const handleCopy = async () => {
    try {
      const textToCopy = searchResponse?.answer.replace(/\[\d+\]/g, '').replace(/\*\*/g, '') || ''
      await navigator.clipboard.writeText(textToCopy)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy')
    }
  }

  const handleShare = async () => {
    try {
      await navigator.share({
        title: query,
        text: searchResponse?.answer.substring(0, 200) || '',
        url: window.location.href
      })
    } catch (err) {
      handleCopy()
    }
  }

  const renderAnswerWithCitations = (text: string) => {
    const parts = text.split(/(\[\d+\])/g)
    return parts.map((part, index) => {
      const match = part.match(/\[(\d+)\]/)
      if (match) {
        const sourceId = parseInt(match[1])
        return (
          <sup
            key={index}
            onMouseEnter={() => handleCitationHover(sourceId)}
            onMouseLeave={handleCitationLeave}
            onClick={() => {
              const sourceEl = document.getElementById(`source-${sourceId}`)
              sourceEl?.scrollIntoView({ behavior: 'smooth', block: 'center' })
            }}
            className="inline-flex items-center justify-center w-4 h-4 ml-0.5 text-[10px] font-medium text-gray-500 bg-gray-100 rounded cursor-pointer hover:bg-gray-200 hover:text-gray-700"
          >
            {sourceId}
          </sup>
        )
      }
      const boldParts = part.split(/\*\*(.*?)\*\*/g)
      return boldParts.map((boldPart, boldIndex) => {
        if (boldIndex % 2 === 1) {
          return <strong key={`${index}-${boldIndex}`} className="font-semibold text-gray-900">{boldPart}</strong>
        }
        return <span key={`${index}-${boldIndex}`}>{boldPart}</span>
      })
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
          <div className="text-center">
            <p className="text-gray-600 font-medium">Searching across multiple sources...</p>
            <p className="text-gray-400 text-sm mt-1">Wikipedia • News • Hacker News • Stack Overflow</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 font-medium">{error}</p>
          <button
            onClick={onBackToHome}
            className="mt-4 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
          >
            Go back
          </button>
        </div>
      </div>
    )
  }

  if (!searchResponse) {
    return null
  }

  const { answer, sources, relatedQuestions, wikipediaSummary } = searchResponse

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 bg-white border-b border-gray-100 z-40">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-4">
          <button
            onClick={onBackToHome}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex-1 max-w-2xl">
            <SearchBox onSearch={onNewSearch} initialValue={query} compact />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              className={`p-2 rounded-lg ${
                isSaved 
                  ? 'text-yellow-600 bg-yellow-50' 
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
              }`}
              title={isSaved ? 'Saved' : 'Save'}
            >
              <Bookmark size={18} fill={isSaved ? 'currentColor' : 'none'} />
            </button>
            <button
              onClick={handleCopy}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg"
              title="Copy"
            >
              {isCopied ? <Check size={18} className="text-green-600" /> : <Copy size={18} />}
            </button>
            <button
              onClick={handleShare}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg"
              title="Share"
            >
              <Share2 size={18} />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex gap-8">
          <div className="flex-1 max-w-3xl">
            {/* Wikipedia Thumbnail if available */}
            {wikipediaSummary?.thumbnail && (
              <div className="mb-6 flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <img
                  src={wikipediaSummary.thumbnail}
                  alt={wikipediaSummary.title}
                  className="w-24 h-24 object-cover rounded"
                />
                <div>
                  <h2 className="font-semibold text-gray-900">{wikipediaSummary.title}</h2>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-3">
                    {wikipediaSummary.extract.substring(0, 200)}...
                  </p>
                  <a
                    href={wikipediaSummary.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline mt-2 inline-block"
                  >
                    Read more on Wikipedia →
                  </a>
                </div>
              </div>
            )}

            {/* Sources */}
            <section className="mb-8">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Sources ({sources.length})
              </h2>
              <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
                {sources.map((source: any) => (
                  <SourceCard
                    key={source.id}
                    source={source}
                    isHighlighted={highlightedSource === source.id}
                  />
                ))}
              </div>
            </section>

            {/* Answer */}
            <section className="mb-10">
              <article className="prose prose-gray max-w-none">
                <div className="text-[15px] leading-relaxed text-gray-700 font-['Inter',system-ui,sans-serif] whitespace-pre-line">
                  {renderAnswerWithCitations(answer)}
                </div>
              </article>
            </section>

            {/* Related Questions */}
            <section className="border-t border-gray-100 pt-8">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">
                Related Questions
              </h2>
              <ul className="space-y-2">
                {relatedQuestions.map((question: string, index: number) => (
                  <li key={index}>
                    <button
                      onClick={() => onNewSearch(question)}
                      className="text-left text-gray-700 hover:text-gray-900 hover:underline text-[15px]"
                    >
                      {question}
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Quick Links
              </h3>
              <div className="space-y-3">
                {sources.slice(0, 5).map((source: any) => (
                  <a
                    key={source.id}
                    id={`source-${source.id}`}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block p-3 rounded-lg border ${
                      highlightedSource === source.id
                        ? 'border-gray-300 bg-gray-50'
                        : 'border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded bg-gray-100 flex-shrink-0 mt-0.5 flex items-center justify-center text-[10px] font-bold text-gray-500">
                        {source.favicon}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {source.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {source.domain}
                        </p>
                      </div>
                    </div>
                  </a>
                ))}
              </div>

              {/* API Sources Info */}
              <div className="mt-6 p-3 bg-gray-50 rounded-lg">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Data Sources
                </h4>
                <ul className="text-xs text-gray-500 space-y-1">
                  <li>• Wikipedia API</li>
                  <li>• DuckDuckGo Instant</li>
                  <li>• Hacker News</li>
                  <li>• Stack Exchange</li>
                  <li>• Google News RSS</li>
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
