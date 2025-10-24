import React, { useState, useEffect } from "react"

function App() {
  const [pokemonList, setPokemonList] = useState([])
  const [selectedPokemon, setSelectedPokemon] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=20")
        const data = await res.json()
        const detailedData = await Promise.all(
          data.results.map(async (p) => {
            const res = await fetch(p.url)
            const details = await res.json()
            return {
              id: details.id,
              name: details.name,
              image: details.sprites.other["official-artwork"].front_default,
              types: details.types.map(t => t.type.name),
              stats: details.stats.map(s => ({
                name: s.stat.name,
                value: s.base_stat
              })),
              height: details.height,
              weight: details.weight
            }
          })
        )
        setPokemonList(detailedData)
      } catch (err) {
        console.error("Error al cargar pokémon:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchPokemon()
  }, [])

  if (loading) return <p className="loading">Cargando pokémon...</p>

  return (
    <div className="app">
      <h1 className="title">Pokédex</h1>

      <div className="pokedex">
        {pokemonList.map((p) => (
          <div
            key={p.id}
            className="card"
            onClick={() => setSelectedPokemon(p)}
          >
            <img src={p.image} alt={p.name} />
            <h3>{p.name.charAt(0).toUpperCase() + p.name.slice(1)}</h3>
            <p className="type">{p.types.join(", ")}</p>
          </div>
        ))}
      </div>

      {selectedPokemon && (
        <div className="modal" onClick={() => setSelectedPokemon(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedPokemon.image}
              alt={selectedPokemon.name}
              className="modal-img"
            />
            <h2>{selectedPokemon.name.toUpperCase()}</h2>
            <p><b>Tipos:</b> {selectedPokemon.types.join(", ")}</p>
            <p><b>Altura:</b> {selectedPokemon.height / 10} m</p>
            <p><b>Peso:</b> {selectedPokemon.weight / 10} kg</p>
            <h4>Estadísticas:</h4>
            <ul className="stats">
              {selectedPokemon.stats.map((s) => (
                <li key={s.name}>
                  <span>{s.name}</span>
                  <div className="bar">
                    <div
                      className="fill"
                      style={{ width: `${s.value}%` }}
                    ></div>
                  </div>
                  <span>{s.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

export default App