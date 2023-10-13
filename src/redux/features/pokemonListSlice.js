import { createSlice } from '@reduxjs/toolkit';

const pokemonSlice = createSlice({ //saperate slice for pokemons
  name: 'pokemon',
  initialState: {
    pokemons: [],
    pokemonData: [],
    loading: false,
    error: null,
  },
  reducers: {
    setPokemons(state, action) {
      state.pokemons = action.payload;
    },
    setPokemonData(state, action) {
      state.pokemonData = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
  },
});

export const {
  setPokemons,
  setPokemonData,
  setLoading,
  setError,
} = pokemonSlice.actions;

export default pokemonSlice.reducer;
