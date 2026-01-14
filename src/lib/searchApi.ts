// Free Search API Integration using DuckDuckGo Instant Answer API and Wikipedia API

export interface SearchResult {
  title: string
  snippet: string
  url: string
  domain: string
  favicon: string
}

export interface WikipediaSummary {
  title: string
  extract: string
  thumbnail?: string
  url: string
}

export interface SearchResponse {
  query: string
  answer: string
  sources: SearchResult[]
  relatedQuestions: string[]
  wikipediaSummary?: WikipediaSummary
}

// DuckDuckGo Instant Answer API (free, no key required)
async function fetchDuckDuckGo(query: string): Promise<any> {
  try {
    const response = await fetch(
      `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`
    )
    if (!response.ok) throw new Error('DuckDuckGo API error')
    return await response.json()
  } catch (error) {
    console.error('DuckDuckGo fetch error:', error)
    return null
  }
}

// Wikipedia API (free, no key required)
async function fetchWikipedia(query: string): Promise<WikipediaSummary | null> {
  try {
    // First, search for the most relevant article
    const searchResponse = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*`
    )
    const searchData = await searchResponse.json()
    
    if (!searchData.query?.search?.length) return null
    
    const pageTitle = searchData.query.search[0].title
    
    // Then get the summary
    const summaryResponse = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(pageTitle)}`
    )
    
    if (!summaryResponse.ok) return null
    
    const summaryData = await summaryResponse.json()
    
    return {
      title: summaryData.title,
      extract: summaryData.extract,
      thumbnail: summaryData.thumbnail?.source,
      url: summaryData.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(pageTitle)}`
    }
  } catch (error) {
    console.error('Wikipedia fetch error:', error)
    return null
  }
}

// Wikipedia search for related articles
async function fetchWikipediaRelated(query: string): Promise<SearchResult[]> {
  try {
    const response = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&srlimit=5&format=json&origin=*`
    )
    const data = await response.json()
    
    if (!data.query?.search) return []
    
    return data.query.search.map((item: any, index: number) => ({
      title: item.title,
      snippet: item.snippet.replace(/<[^>]*>/g, ''),
      url: `https://en.wikipedia.org/wiki/${encodeURIComponent(item.title.replace(/ /g, '_'))}`,
      domain: 'wikipedia.org',
      favicon: 'W'
    }))
  } catch (error) {
    console.error('Wikipedia related fetch error:', error)
    return []
  }
}

// News API using RSS2JSON (free tier available)
async function fetchNews(query: string): Promise<SearchResult[]> {
  try {
    // Using Google News RSS feed through RSS2JSON
    const response = await fetch(
      `https://api.rss2json.com/v1/api.json?rss_url=https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-US&gl=US&ceid=US:en`
    )
    
    if (!response.ok) return []
    
    const data = await response.json()
    
    if (data.status !== 'ok' || !data.items) return []
    
    return data.items.slice(0, 5).map((item: any) => {
      const domain = new URL(item.link).hostname.replace('www.', '')
      return {
        title: item.title,
        snippet: item.description?.replace(/<[^>]*>/g, '').substring(0, 150) || '',
        url: item.link,
        domain: domain,
        favicon: domain.charAt(0).toUpperCase()
      }
    })
  } catch (error) {
    console.error('News fetch error:', error)
    return []
  }
}

// Hacker News API (free, no key required)
async function fetchHackerNews(query: string): Promise<SearchResult[]> {
  try {
    const response = await fetch(
      `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(query)}&tags=story&hitsPerPage=5`
    )
    
    if (!response.ok) return []
    
    const data = await response.json()
    
    return data.hits.map((hit: any) => ({
      title: hit.title,
      snippet: hit.story_text?.replace(/<[^>]*>/g, '').substring(0, 150) || `${hit.points} points • ${hit.num_comments} comments`,
      url: hit.url || `https://news.ycombinator.com/item?id=${hit.objectID}`,
      domain: hit.url ? new URL(hit.url).hostname.replace('www.', '') : 'news.ycombinator.com',
      favicon: 'HN'
    }))
  } catch (error) {
    console.error('HackerNews fetch error:', error)
    return []
  }
}

// Stack Exchange API (free, no key required for basic usage)
async function fetchStackExchange(query: string): Promise<SearchResult[]> {
  try {
    const response = await fetch(
      `https://api.stackexchange.com/2.3/search/excerpts?order=desc&sort=relevance&q=${encodeURIComponent(query)}&site=stackoverflow&pagesize=3`
    )
    
    if (!response.ok) return []
    
    const data = await response.json()
    
    return data.items?.map((item: any) => ({
      title: item.title?.replace(/&#[0-9]+;/g, ''),
      snippet: item.excerpt?.replace(/<[^>]*>/g, '').substring(0, 150) || '',
      url: `https://stackoverflow.com/q/${item.question_id}`,
      domain: 'stackoverflow.com',
      favicon: 'SO'
    })) || []
  } catch (error) {
    console.error('StackExchange fetch error:', error)
    return []
  }
}

// Generate AI-like answer from collected data
function generateAnswer(
  query: string,
  ddgData: any,
  wikiSummary: WikipediaSummary | null,
  sources: SearchResult[]
): string {
  let answer = ''
  
  // Start with Wikipedia summary if available
  if (wikiSummary?.extract) {
    answer += `${wikiSummary.extract}[1]\n\n`
  }
  
  // Add DuckDuckGo abstract if available
  if (ddgData?.Abstract) {
    answer += `${ddgData.Abstract}[2]\n\n`
  }
  
  // Add DuckDuckGo answer if available
  if (ddgData?.Answer) {
    answer += `**Quick Answer:** ${ddgData.Answer}[2]\n\n`
  }
  
  // Add definition if available
  if (ddgData?.Definition) {
    answer += `**Definition:** ${ddgData.Definition}[2]\n\n`
  }
  
  // If we have related topics from DuckDuckGo
  if (ddgData?.RelatedTopics?.length > 0) {
    answer += '**Key Information:**\n\n'
    ddgData.RelatedTopics.slice(0, 4).forEach((topic: any, index: number) => {
      if (topic.Text) {
        answer += `• ${topic.Text}[${index + 3}]\n\n`
      }
    })
  }
  
  // Add information from other sources
  if (sources.length > 0) {
    answer += '**From Recent Sources:**\n\n'
    sources.slice(0, 3).forEach((source, index) => {
      if (source.snippet) {
        answer += `• **${source.title}**: ${source.snippet}[${index + 4}]\n\n`
      }
    })
  }
  
  // If still empty, provide a generic response
  if (!answer.trim()) {
    answer = `Here's what I found about "${query}":\n\n`
    answer += `Based on available sources, this topic covers various aspects that may include recent developments, historical context, and practical applications.\n\n`
    
    if (sources.length > 0) {
      answer += '**Available Sources:**\n\n'
      sources.forEach((source, index) => {
        answer += `• **${source.domain}**: ${source.title}[${index + 1}]\n\n`
      })
    }
  }
  
  return answer
}

// Generate related questions based on the query and results
function generateRelatedQuestions(query: string, ddgData: any): string[] {
  const questions: string[] = []
  
  // Extract from DuckDuckGo related topics
  if (ddgData?.RelatedTopics) {
    ddgData.RelatedTopics.slice(0, 3).forEach((topic: any) => {
      if (topic.Text && topic.Text.length < 100) {
        questions.push(`What is ${topic.Text.split(' - ')[0]}?`)
      }
    })
  }
  
  // Generate contextual questions
  const baseQuestions = [
    `What are the latest developments in ${query}?`,
    `How does ${query} work?`,
    `What are the benefits of ${query}?`,
    `Who are the key players in ${query}?`,
    `What is the history of ${query}?`,
    `What are common misconceptions about ${query}?`,
    `How is ${query} changing in 2024?`,
    `What are the challenges facing ${query}?`
  ]
  
  // Add base questions if we need more
  while (questions.length < 5) {
    const q = baseQuestions[questions.length]
    if (q && !questions.includes(q)) {
      questions.push(q)
    } else {
      break
    }
  }
  
  return questions.slice(0, 5)
}

// Main search function that combines all sources
export async function performSearch(query: string, source: string = 'All'): Promise<SearchResponse> {
  // Fetch from multiple sources in parallel
  const [ddgData, wikiSummary, wikiRelated, newsResults, hnResults, soResults] = await Promise.all([
    fetchDuckDuckGo(query),
    fetchWikipedia(query),
    fetchWikipediaRelated(query),
    source === 'All' || source === 'News' ? fetchNews(query) : Promise.resolve([]),
    source === 'All' || source === 'Web' ? fetchHackerNews(query) : Promise.resolve([]),
    source === 'All' || source === 'Academic' ? fetchStackExchange(query) : Promise.resolve([])
  ])
  
  // Combine all sources
  let allSources: SearchResult[] = []
  
  // Add Wikipedia as first source if we have summary
  if (wikiSummary) {
    allSources.push({
      title: wikiSummary.title,
      snippet: wikiSummary.extract.substring(0, 150),
      url: wikiSummary.url,
      domain: 'wikipedia.org',
      favicon: 'W'
    })
  }
  
  // Add DuckDuckGo source if we have abstract
  if (ddgData?.AbstractURL) {
    allSources.push({
      title: ddgData.Heading || query,
      snippet: ddgData.Abstract?.substring(0, 150) || '',
      url: ddgData.AbstractURL,
      domain: ddgData.AbstractSource || 'duckduckgo.com',
      favicon: ddgData.AbstractSource?.charAt(0).toUpperCase() || 'D'
    })
  }
  
  // Add other Wikipedia results
  allSources = [...allSources, ...wikiRelated.slice(0, 2)]
  
  // Add news results
  allSources = [...allSources, ...newsResults]
  
  // Add HackerNews results
  allSources = [...allSources, ...hnResults]
  
  // Add StackOverflow results
  allSources = [...allSources, ...soResults]
  
  // Remove duplicates based on URL
  const uniqueSources = allSources.filter((source, index, self) =>
    index === self.findIndex(s => s.url === source.url)
  ).slice(0, 8)
  
  // Assign IDs to sources
  const sourcesWithIds = uniqueSources.map((source, index) => ({
    ...source,
    id: index + 1
  }))
  
  // Generate the answer
  const answer = generateAnswer(query, ddgData, wikiSummary, sourcesWithIds)
  
  // Generate related questions
  const relatedQuestions = generateRelatedQuestions(query, ddgData)
  
  return {
    query,
    answer,
    sources: sourcesWithIds,
    relatedQuestions,
    wikipediaSummary: wikiSummary || undefined
  }
}

// Image search using Wikimedia Commons
export async function searchImages(query: string): Promise<SearchResult[]> {
  try {
    const response = await fetch(
      `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&srnamespace=6&srlimit=10&format=json&origin=*`
    )
    
    if (!response.ok) return []
    
    const data = await response.json()
    
    return data.query?.search?.map((item: any) => ({
      title: item.title.replace('File:', ''),
      snippet: item.snippet.replace(/<[^>]*>/g, ''),
      url: `https://commons.wikimedia.org/wiki/${encodeURIComponent(item.title)}`,
      domain: 'wikimedia.org',
      favicon: 'WM'
    })) || []
  } catch (error) {
    console.error('Image search error:', error)
    return []
  }
}
