import { ExternalLink } from 'lucide-react'

interface Source {
  id: number
  title: string
  domain: string
  favicon: string
  url: string
  snippet?: string
}

interface SourceCardProps {
  source: Source
  isHighlighted: boolean
}

export function SourceCard({ source, isHighlighted }: SourceCardProps) {
  return (
    <a
      href={source.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex-shrink-0 w-48 p-3 rounded-lg border ${
        isHighlighted
          ? 'border-gray-300 bg-gray-50 shadow-sm'
          : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
      }`}
    >
      <div className="flex items-start gap-2">
        <div className="w-6 h-6 rounded bg-gray-100 flex-shrink-0 flex items-center justify-center text-xs font-bold text-gray-600">
          {source.favicon}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-gray-900 line-clamp-2 leading-tight">
            {source.title}
          </p>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-xs text-gray-500 truncate">
              {source.domain}
            </span>
            <ExternalLink size={10} className="text-gray-400 flex-shrink-0" />
          </div>
        </div>
      </div>
    </a>
  )
}
