import React from 'react';
import PokemonFetcher from'./PokemonFetcher';
import './PokemonFetcher.css';

function App(){
  return(
    <>
    <div className='titulo'>
    <h1>¡Conoce a tus Pokemones!</h1>
    <PokemonFetcher />
    </div>
    </>

  );
}

export default App;
