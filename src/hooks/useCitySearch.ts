import { useEffect, useState } from "react"
import { searchCities } from "../lib/services/locations.service"

export function useCitySearch(query: string) {
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (!query) {
        setResults([])
        return
      }

      try {
        setLoading(true)
        const data = await searchCities(query)
        setResults(data)
      } finally {
        setLoading(false)
      }
    }, 500) // debounce 500ms

    return () => clearTimeout(timeout)
  }, [query])

  return { results, loading }
}