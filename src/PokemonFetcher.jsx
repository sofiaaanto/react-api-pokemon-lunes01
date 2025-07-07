import React, { useState, useEffect } from 'react';
import './PokemonFetcher.css';

const PokemonFetcher = () => {
  const [pokemones, setPokemones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [tipoBuscado, setTipoBuscado] = useState('');

  const traduccionesTipos = {
    fuego: 'fire',
    agua: 'water',
    planta: 'grass',
    eléctrico: 'electric',
    bicho: 'bug',
    normal: 'normal',
    volador: 'flying',
    veneno: 'poison',
    tierra: 'ground',
    roca: 'rock',
    psíquico: 'psychic',
    hielo: 'ice',
    dragón: 'dragon',
    oscuro: 'dark',
    acero: 'steel',
    hada: 'fairy',
    fantasma: 'ghost',
    lucha: 'fighting'
  };

  useEffect(() => {
    const fetchPokemones = async () => {
      try {
        setCargando(true);
        setError(null);
        const fetchedPokemones = [];
        const pokemonIds = new Set();

        while (pokemonIds.size < 4) {
          const randomId = Math.floor(Math.random() * 898) + 1;
          pokemonIds.add(randomId);
        }

        const idsArray = Array.from(pokemonIds);

        for (const id of idsArray) {
          const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);
          if (!response.ok) {
            throw new Error(`Error al cargar el Pokémon con ID ${id}: ${response.statusText}`);
          }
          const data = await response.json();
          fetchedPokemones.push({
            id: data.id,
            nombre: data.name,
            imagen: data.sprites.front_default,
            tipos: data.types.map(typeInfo => typeInfo.type.name),
          });
        }
        setPokemones(fetchedPokemones);
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };

    fetchPokemones();
  }, []);

  const buscarPokemon = async () => {
    const termino = tipoBuscado.trim().toLowerCase();
    if (!termino) return;

    try {
      setCargando(true);
      setError(null);

      // Buscar por nombre
      const resNombre = await fetch(`https://pokeapi.co/api/v2/pokemon/${termino}`);
      if (resNombre.ok) {
        const data = await resNombre.json();
        setPokemones([{
          id: data.id,
          nombre: data.name,
          imagen: data.sprites.front_default,
          tipos: data.types.map(t => t.type.name)
        }]);
        return;
      }

      // Buscar por tipo (en español)
      const tipoEnIngles = traduccionesTipos[termino];
      if (!tipoEnIngles) {
        throw new Error('No se encontró ningún Pokémon con ese nombre o tipo.');
      }

      const resTipo = await fetch(`https://pokeapi.co/api/v2/type/${tipoEnIngles}`);
      if (!resTipo.ok) throw new Error('Tipo no válido');

      const dataTipo = await resTipo.json();
      const todosLosPokemones = dataTipo.pokemon;

      const detallesPokemones = await Promise.all(
        todosLosPokemones.map(async (pokeEntry) => {
          const res = await fetch(pokeEntry.pokemon.url);
          return res.json();
        })
      );

      const fetchedPokemones = detallesPokemones.map((pokeData) => ({
        id: pokeData.id,
        nombre: pokeData.name,
        imagen: pokeData.sprites.front_default,
        tipos: pokeData.types.map(t => t.type.name)
      }));

      setPokemones(fetchedPokemones);
    } catch (err) {
      setError(err.message);
      setPokemones([]);
    } finally {
      setCargando(false);
    }
  };

  const getTypeClass = (type) => {
    switch (type.toLowerCase()) {
      case 'fire': return 'type-fire';
      case 'water': return 'type-water';
      case 'grass': return 'type-grass';
      case 'electric': return 'type-electric';
      case 'bug': return 'type-bug';
      case 'normal': return 'type-normal';
      case 'flying': return 'type-flying';
      case 'poison': return 'type-poison';
      case 'ground': return 'type-ground';
      case 'rock': return 'type-rock';
      case 'psychic': return 'type-psychic';
      case 'ice': return 'type-ice';
      case 'dragon': return 'type-dragon';
      case 'dark': return 'type-dark';
      case 'steel': return 'type-steel';
      case 'fairy': return 'type-fairy';
      case 'ghost': return 'type-ghost';
      case 'fighting': return 'type-fighting';
      default: return 'type-default';
    }
    
  };
  const traduccionTiposES = {
    fire: 'Fuego',
    water: 'Agua',
    grass: 'Planta',
    electric: 'Eléctrico',
    bug: 'Bicho',
    normal: 'Normal',
    flying: 'Volador',
    poison: 'Veneno',
    ground: 'Tierra',
    rock: 'Roca',
    psychic: 'Psíquico',
    ice: 'Hielo',
    dragon: 'Dragón',
    dark: 'Oscuro',
    steel: 'Acero',
    fairy: 'Hada',
    ghost: 'Fantasma',
    fighting: 'Lucha'
  };


  return (
    <div className='pokemon-container'>
      <div style={{ marginBottom: '16px' }}>
        <input
          type="text"
          placeholder="Buscar por nombre o tipo (ej: pikachu o fuego)"
          value={tipoBuscado}
          onChange={(e) => setTipoBuscado(e.target.value)}
          className="input-tipo"
        />
        <button onClick={buscarPokemon}>Buscar</button>
      </div>

      {error && (
        <div className="error" style={{ color: 'red', marginBottom: '12px' }}>
          {error}
        </div>
      )}

      {cargando ? (
        <div className="pokemon-container">Cargando Pokémon...</div>
      ) : (
        <div className="pokemon-list">
          {pokemones.map(pokemon => (
            <div key={pokemon.id} className="pokemon-card">
              <h3>{pokemon.nombre.charAt(0).toUpperCase() + pokemon.nombre.slice(1)}</h3>
              <img src={pokemon.imagen} alt={pokemon.nombre} />
              <div className="pokemon-type">
                &nbsp;
                {pokemon.tipos.map((type, index) => (
                  <span key={index} className={`type-badge ${getTypeClass(type)}`}>
                    {traduccionTiposES[type] || type}
                  </span>
                ))}

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PokemonFetcher;
