import React, { useState, useEffect } from "react"

// Define el límite de Pokémon por página
const POKEMON_PER_PAGE = 12 
// La PokeAPI tiene alrededor de 1302 pokémon actualmente
const TOTAL_POKEMON = 1025 // Usaremos un límite más sensato para el ejemplo

function App() {
  const [pokemonList, setPokemonList] = useState([])
  const [selectedPokemon, setSelectedPokemon] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = Math.ceil(TOTAL_POKEMON / POKEMON_PER_PAGE)

  useEffect(() => {
    const fetchPokemon = async () => {
      setLoading(true) // Establecer loading en true antes de la nueva petición
      setPokemonList([]) // Limpiar la lista anterior para mostrar el esqueleto/carga
      
      const offset = (currentPage - 1) * POKEMON_PER_PAGE

      try {
        // Primera llamada para obtener la lista de Pokémon de la página
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${POKEMON_PER_PAGE}&offset=${offset}`)
        const data = await res.json()

        // Segunda llamada para obtener los detalles de cada Pokémon en paralelo
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
  }, [currentPage]) // ¡Importante! El efecto se ejecuta cada vez que la página actual cambia

  // Función para manejar el cambio de página
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
    }
  }

  // Creación de botones de paginación para una mejor navegación
  const renderPageButtons = () => {
    const pagesToShow = 5 // Mostrar 5 botones de página (actual + 2 a cada lado)
    let startPage = Math.max(1, currentPage - Math.floor(pagesToShow / 2))
    let endPage = Math.min(totalPages, startPage + pagesToShow - 1)

    if (endPage - startPage + 1 < pagesToShow) {
        startPage = Math.max(1, endPage - pagesToShow + 1);
    }

    const buttons = []
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          className={`page-button ${i === currentPage ? 'active' : ''}`}
          onClick={() => handlePageChange(i)}
          disabled={loading}
        >
          {i}
        </button>
      )
    }
    return buttons
  }

  return (
    <div className="app">
      <h1 className="title">
        <img src="https://upload.wikimedia.org/wikipedia/commons/9/98/International_Pok%C3%A9mon_logo.svg" alt="Pokémon Logo" className="logo-img" />
        Pokédex
      </h1>

      {/* Paginador Superior */}
      <div className="pagination-controls top">
        <button 
          className="page-button prev"
          onClick={() => handlePageChange(currentPage - 1)} 
          disabled={currentPage === 1 || loading}
        >
          &laquo; Anterior
        </button>
        {renderPageButtons()}
        <button 
          className="page-button next"
          onClick={() => handlePageChange(currentPage + 1)} 
          disabled={currentPage === totalPages || loading}
        >
          Siguiente &raquo;
        </button>
      </div>

      {/* Tarjetas de Pokémon */}
      <div className="pokedex">
        {loading ? (
          // Mostrar tarjetas de carga (esqueleto)
          Array.from({ length: POKEMON_PER_PAGE }).map((_, index) => (
            <div key={index} className="card loading-card">
              <div className="skeleton-img"></div>
              <div className="skeleton-text"></div>
              <div className="skeleton-text short"></div>
            </div>
          ))
        ) : (
          pokemonList.map((p) => (
            <div
              key={p.id}
              className={`card ${p.types[0]}`} // Añadir el tipo principal como clase
              onClick={() => setSelectedPokemon(p)}
            >
              <p className="card-id">#{String(p.id).padStart(3, '0')}</p>
              <img src={p.image} alt={p.name} className="card-img" />
              <div className="card-info">
                <h3>{p.name.charAt(0).toUpperCase() + p.name.slice(1)}</h3>
                <div className="types-container">
                  {p.types.map(t => (
                    <span key={t} className={`type-tag ${t}`}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Paginador Inferior */}
      {!loading && (
        <div className="pagination-controls bottom">
          <button 
            className="page-button prev"
            onClick={() => handlePageChange(currentPage - 1)} 
            disabled={currentPage === 1 || loading}
          >
            &laquo; Anterior
          </button>
          {renderPageButtons()}
          <button 
            className="page-button next"
            onClick={() => handlePageChange(currentPage + 1)} 
            disabled={currentPage === totalPages || loading}
          >
            Siguiente &raquo;
          </button>
        </div>
      )}


      {/* Modal de Detalle */}
      {selectedPokemon && (
        <div className="modal-overlay" onClick={() => setSelectedPokemon(null)}>
          <div className={`modal-content ${selectedPokemon.types[0]}`} onClick={(e) => e.stopPropagation()}>
            <span className="close-button" onClick={() => setSelectedPokemon(null)}>&times;</span>
            <div className="modal-header">
                <img
                    src={selectedPokemon.image}
                    alt={selectedPokemon.name}
                    className="modal-img"
                />
                <div className="modal-title-info">
                    <p className="modal-id">#{String(selectedPokemon.id).padStart(3, '0')}</p>
                    <h2>{selectedPokemon.name.charAt(0).toUpperCase() + selectedPokemon.name.slice(1)}</h2>
                    <div className="types-container">
                        {selectedPokemon.types.map(t => (
                            <span key={t} className={`type-tag ${t}`}>{t}</span>
                        ))}
                    </div>
                </div>
            </div>

            <div className="modal-body">
                <div className="modal-info-details">
                    <p><b>Altura:</b> {selectedPokemon.height / 10} m</p>
                    <p><b>Peso:</b> {selectedPokemon.weight / 10} kg</p>
                </div>
                
                <h4>Estadísticas Base:</h4>
                <ul className="stats">
                  {selectedPokemon.stats.map((s) => (
                    <li key={s.name}>
                      <span className="stat-name">{s.name.replace('-', ' ').toUpperCase()}</span>
                      <div className="bar-container">
                        <div className="bar-label">{s.value}</div>
                        <div className="bar">
                          <div
                            className="fill"
                            // Escalar el valor de la estadística para la barra (Máx. típico es ~255)
                            style={{ width: `${Math.min(100, (s.value / 200) * 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App