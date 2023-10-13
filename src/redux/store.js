import { configureStore } from '@reduxjs/toolkit';
import pokemonListReducer from './features/pokemonListSlice';
import pokemonInfoReducer from './features/pokemonInfoSlice';


//configure store for pokemon
const store = configureStore({
  reducer: {
    pokemon: pokemonListReducer,
    pokemonInfo: pokemonInfoReducer
  },
});

export default store;