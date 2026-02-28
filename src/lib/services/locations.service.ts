import axios from "axios"

export async function searchCities(query: string) {
  if (!query) return []

  const response = await axios.get(
    "https://nominatim.openstreetmap.org/search",
    {
      params: {
        q: query,
        format: "json",
        addressdetails: 1,
        limit: 5
      },
      headers: {
        "Accept-Language": "pt-BR"
      }
    }
  )

  return response.data
    .map((item: any) => {
      const city =
        item.address.city ||
        item.address.town ||
        item.address.village ||
        item.address.municipality ||
        item.address.county

      if (!city) return null

      return {
        city,
        state: item.address.state || '',
        country: item.address.country || ''
      }
    })
    .filter(Boolean)
}
