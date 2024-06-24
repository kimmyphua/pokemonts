import { useCallback, useEffect, useState } from 'react'
import { fetchGraphQL } from './util'

interface IPokemon {
  name: string
  id: number
}

const query = `
query pokemonList($orderBy: [pokemon_v2_pokemonspecies_order_by!]) {
  pokemon: pokemon_v2_pokemonspecies(order_by: $orderBy) {
      name
      id
  }
 }   
  `

const columns = [
  { label: 'ID', accessor: 'id' },
  { label: 'Name', accessor: 'name' }
]

const upArrow = '↑'
const downArrow = '↓'

function Pokemon() {
  const [pokemonList, setPokemonList] = useState<IPokemon[]>([])
  const [hasError, setHasError] = useState(false)
  const totalPages = 10

  const handleSortChange = () => {
    console.log('handleSortChange')
  }

  const renderSortIcon = () => {
    console.log('renderSortIcon')
    return upArrow
  }

  const pokemoncallback = useCallback(
    () =>
      fetchGraphQL({
        query,
        variables: { orderBy: { id: 'asc' } },
        operationName: 'pokemonList'
      }).then((r) => {
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
    <h2>Error Loading Pokemons... 💀 </h2>
  ) : (
    <div>
      <h2>Pokemon</h2>
      <table className="table">
        <thead>
          <tr>
            {columns.map(({ label, accessor }) => {
              return (
                <th key={accessor} onClick={() => handleSortChange()}>
                  {label} {renderSortIcon()}
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {pokemonList.map((data) => (
            <tr key={data.name}>
              {columns.map(({ accessor }) => {
                const tData = data[accessor as keyof IPokemon]
                return <td key={accessor}>{tData}</td>
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((i) => (
          <span className="pagination-key">{i.toString()}</span>
        ))}
      </div>
    </div>
  )
}

export default Pokemon
