import { useState, useRef, useEffect } from 'react'
import { Paperclip, ArrowRight, ChevronDown, X, FileText } from 'lucide-react'

interface SearchBoxProps {
  onSearch: (query: string) => void
  initialValue?: string
  compact?: boolean
}

interface AttachedFile {
  name: string
  size: string
  type: string
}

export function SearchBox({ onSearch, initialValue = '', compact = false }: SearchBoxProps) {
  const [query, setQuery] = useState(initialValue)
  const [isFocused, setIsFocused] = useState(false)
  const [sourceOpen, setSourceOpen] = useState(false)
  const [selectedSource, setSelectedSource] = useState('All')
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const sources = ['All', 'Web', 'Academic', 'News', 'Images']

  useEffect(() => {
    setQuery(initialValue)
  }, [initialValue])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setSourceOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      onSearch(query.trim())
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleFileAttach = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const newFiles = Array.from(files).map(file => ({
        name: file.name,
        size: formatFileSize(file.size),
        type: file.type.split('/')[1]?.toUpperCase() || 'FILE'
      }))
      setAttachedFiles(prev => [...prev, ...newFiles])
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const removeFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      {/* Attached Files Preview */}
      {attachedFiles.length > 0 && !compact && (
        <div className="flex flex-wrap gap-2 mb-2">
          {attachedFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-full text-sm"
            >
              <FileText size={14} className="text-gray-500" />
              <span className="text-gray-700 truncate max-w-[150px]">{file.name}</span>
              <span className="text-gray-400 text-xs">{file.size}</span>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="p-0.5 hover:bg-gray-200 rounded-full"
              >
                <X size={12} className="text-gray-500" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div
        className={`relative flex items-center w-full bg-white border rounded-full ${
          isFocused ? 'border-gray-300 ring-2 ring-gray-100' : 'border-gray-200'
        } ${compact ? 'px-3 py-2' : 'px-4 py-3'}`}
      >
        {/* Source Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setSourceOpen(!sourceOpen)}
            className={`flex items-center gap-1 text-gray-600 hover:text-gray-900 border-r border-gray-200 pr-3 mr-3 ${
              compact ? 'text-xs' : 'text-sm'
            }`}
          >
            <span className="font-medium">{selectedSource}</span>
            <ChevronDown size={compact ? 12 : 14} className={sourceOpen ? 'rotate-180' : ''} />
          </button>
          
          {sourceOpen && (
            <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50 min-w-[100px]">
              {sources.map((source) => (
                <button
                  key={source}
                  type="button"
                  onClick={() => {
                    setSelectedSource(source)
                    setSourceOpen(false)
                  }}
                  className={`w-full px-3 py-1.5 text-left text-sm hover:bg-gray-50 ${
                    selectedSource === source ? 'text-gray-900 bg-gray-50' : 'text-gray-600'
                  }`}
                >
                  {source}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Input Field */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything..."
          className={`flex-1 bg-transparent outline-none text-gray-900 placeholder-gray-400 ${
            compact ? 'text-sm' : 'text-base'
          }`}
        />

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileChange}
          className="hidden"
          accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
        />

        {/* Action Buttons */}
        <div className="flex items-center gap-2 ml-2">
          <button
            type="button"
            onClick={handleFileAttach}
            className={`p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full ${
              attachedFiles.length > 0 ? 'text-gray-600' : ''
            }`}
            title="Attach file"
          >
            <Paperclip size={compact ? 16 : 18} />
            {attachedFiles.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-gray-900 text-white text-[10px] rounded-full flex items-center justify-center">
                {attachedFiles.length}
              </span>
            )}
          </button>
          
          <button
            type="submit"
            disabled={!query.trim()}
            className={`p-2 rounded-full ${
              query.trim()
                ? 'bg-gray-900 text-white hover:bg-gray-800'
                : 'bg-gray-100 text-gray-400'
            }`}
            title="Search"
          >
            <ArrowRight size={compact ? 16 : 18} />
          </button>
        </div>
      </div>
    </form>
  )
}
