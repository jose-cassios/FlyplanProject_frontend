import { useState } from "react"
import { useCitySearch } from "../hooks/useCitySearch"

interface Props {
    onSelect: (city: string) => void
    disabled?: boolean
}

export function CityAutocomplete({ onSelect, disabled }: Props) {
    const [query, setQuery] = useState("")
    const { results, loading } = useCitySearch(query)
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="relative w-full">
            <input
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value)
                    setIsOpen(true)
                }}
                placeholder="Para onde você vai?"
                disabled={disabled}
                className="bg-transparent text-lg placeholder-zinc-400 outline-none w-full"
            />

            {isOpen && results.length > 0 && (
                <div className="absolute mt-2 w-full bg-zinc-900 border border-zinc-800 rounded-lg shadow-lg z-50">
                    {results.map((item, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                const formatted = `${item.city}, ${item.state} - ${item.country}`
                                onSelect(formatted)
                                setQuery(formatted)
                                setIsOpen(false)
                            }}
                            className="w-full text-left px-4 py-3 hover:bg-zinc-800 transition"
                        >
                            <p className="text-zinc-100">
                                {item.city}
                            </p>
                            <p className="text-sm text-zinc-400">
                                {item.state} - {item.country}
                            </p>
                        </button>
                    ))}
                </div>
            )}

            {loading && (
                <p className="text-sm text-zinc-400 mt-2">
                    Buscando cidades...
                </p>
            )}
        </div>
    )
}