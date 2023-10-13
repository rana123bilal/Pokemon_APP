import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import App from './App';
import { setPokemons, setError, setLoading, setPokemonData } from './redux/features/pokemonListSlice';

const mockStore = configureStore([]);

// Mocking the Redux store
const initialState = {
  pokemon: {
    pokemons: [],
    pokemonData: [],
    loading: false,
    error: null,
  },
};
const store = mockStore(initialState);

describe('App component', () => {
  beforeEach(() => {
    // Clear any previous dispatched actions in the store
    store.clearActions();
  });

  it('renders loading state', () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    // Make sure Loading... text is displayed
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders error state', () => {
    // Update the store with an error
    store.dispatch(setError('Test Error'));

    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    // Make sure the error message is displayed
    expect(screen.getByText('Error: Test Error')).toBeInTheDocument();
  });

  it('renders the list of Pokemon', async () => {
    // Mock the response for fetching Pokemon data
    const mockPokemonData = [
      { id: 1, name: 'bulbasaur' },
      { id: 2, name: 'ivysaur' },
      // Add more data as needed
    ];

    // Update the store with loading and Pokemon data
    store.dispatch(setLoading(true));
    store.dispatch(setPokemonData(mockPokemonData));

    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    // Wait for the loading to complete
    await waitFor(() => {
      // Check if the Pokemon cards are displayed
      expect(screen.getAllByTestId('poke-card')).toHaveLength(mockPokemonData.length);
    });
  });

  it('handles pagination correctly', async () => {
    // Update the store with loading, Pokemon data, and offset
    const mockPokemonData = [
      { id: 1, name: 'bulbasaur' },
      { id: 2, name: 'ivysaur' },
      // Add more data as needed
    ];
    store.dispatch(setLoading(false));
    store.dispatch(setPokemonData(mockPokemonData));

    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    // Wait for the Pokemon cards to be displayed
    await waitFor(() => {
      expect(screen.getAllByTestId('poke-card')).toHaveLength(mockPokemonData.length);
    });

    // Mock the API call when clicking on pagination
    global.fetch = jest.fn().mockResolvedValue({
      json: () => ({
        results: [
          { name: 'charmander', url: 'url-1' },
          { name: 'charizard', url: 'url-2' },
          // Add more results as needed
        ],
      }),
    });

    // Click on the next page button
    fireEvent.click(screen.getByText('Next'));

    // Wait for the new Pokemon data to load
    await waitFor(() => {
      expect(screen.getAllByTestId('poke-card')).toHaveLength(2); // Adjust for the actual number of Pokemon data fetched
    });
  });
});
