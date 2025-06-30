import React, { useState, useEffect } from 'react';
import './PokemonFetcher.css'; // Opcional: para estilos básicos

const PokemonFetcher = () => {
  const [pokemones, setPokemones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
useEffect(() => {
    const fetchPokemones = async () => {
      try {
        setCargando(true);
        setError(null);
        const fetchedPokemones = [];
        const pokemonIds = new Set(); // Usar un Set para asegurar IDs únicos

        // Generar 4 IDs de Pokémon únicos aleatorios
        while (pokemonIds.size < 4) {
          const randomId = Math.floor(Math.random() * 898) + 1; // 898 es el número actual de Pokémon en la PokeAPI (puedes ajustarlo)
          pokemonIds.add(randomId);
        }

        // Convertir el Set a un array para iterar
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
  }, []); // El array vacío asegura que se ejecute solo una vez al montar el componente

  if (cargando) {
    return <div className="pokemon-container">Cargando Pokémon...</div>;
  }

  if (error) {
    return <div className="pokemon-container error">Error: {error}</div>;
  }

  return (
    <div className='pokemon-container'>
      <h2>Tus 4 Pokémon Aleatorios</h2>
      <div className="pokemon-list"> 
        {pokemones.map(pokemon => (
          <div key={pokemon.id} className="pokemon-card">
            <h3>{pokemon.nombre.charAt(0).toUpperCase() + pokemon.nombre.slice(1)}</h3>
            <img src={pokemon.imagen} alt={pokemon.nombre} />
            <p>
              **Tipos:** {pokemon.tipos.map(type => type.charAt(0).toUpperCase() + type.slice(1)).join(', ')}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PokemonFetcher;