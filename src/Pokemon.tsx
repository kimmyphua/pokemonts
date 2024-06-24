import { useCallback, useEffect, useState } from 'react'
import { fetchGraphQL } from './util'

interface IPokemon {
  name: string
  id: number
}

const query = `
query pokemonList {
  pokemon: pokemon_v2_pokemonspecies(order_by: {id: asc}) {
      name
      id
  }
 }   
  `

function Pokemon() {
  const [pokemonList, setPokemonList] = useState<IPokemon[]>([])
  const [hasError, setHasError] = useState(false)
  const totalPages = 10
  const pokemoncallback = useCallback(
    () =>
      fetchGraphQL(query, null, 'pokemonList').then((r) => {
        if (r.errors != null) {
          setHasError(true)
          return
        }
        setPokemonList(r.data.pokemon)
      }),
    []
  )
  useEffect(() => {
    pokemoncallback()
  }, [pokemoncallback])

  return hasError ? (
    <h2>Error Loading Pokemons...</h2>
  ) : (
    <div>
      <h2>Pokemon</h2>
      {pokemonList.map((poke) => (
        <div key={poke.name}>
          #{poke.id} - {poke.name}
        </div>
      ))}
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((i) => (
          <span className="pagination-key">{i.toString()}</span>
        ))}
      </div>
    </div>
  )
}

export default Pokemon
