import { createSlice } from '@reduxjs/toolkit';


// initial state for pokemon info
const initialState = {
  pokeInfo: {},
  isLoading: true,
  error: null,
};

const pokemonInfoSlice = createSlice({ //saperate slice for pokemon info
  name: 'pokemonInfo',
  initialState,
  reducers: {
    setPokeInfo: (state, action) => {
      state.pokeInfo = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const { setPokeInfo, setLoading, setError } = pokemonInfoSlice.actions;
export default pokemonInfoSlice.reducer;
