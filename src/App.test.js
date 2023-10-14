import React from "react";
import { render, screen, waitFor, fireEvent  } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import configureStore from "redux-mock-store";
import App from "./App";

const mockStore = configureStore([]);

describe("App Component", () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      pokemon: {
        pokemons: [
          { name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" },
        ],
        pokemonData: [{ id: 1, name: "bulbasaur" /* Other data */ }],
        loading: false,
        error: null,
      },
    });
  });

  it("renders loading state", () => {
    store = mockStore({
      pokemon: {
        pokemons: [],
        pokemonData: [],
        loading: true,
        error: null,
      },
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders error state", () => {
    store = mockStore({
      pokemon: {
        pokemons: [],
        pokemonData: [],
        loading: false,
        error: "Some error message",
      },
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText("Error: Some error message")).toBeInTheDocument();
  });

  it("renders data state", async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("poke-card")).toBeInTheDocument();
    });
  });

  it('handles pagination click', async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    );
  
    const paginationButton = screen.getByText('2'); // Assuming the pagination button text is '2'
    fireEvent.click(paginationButton);
      await waitFor(() => {
      expect(screen.getByTestId('poke-card')).toBeInTheDocument();
    });
    // Add a delay before checking the actions to ensure all asynchronous operations are completed
    setTimeout(() => {
      // Compare the length of received actions with the expected number of actions
      expect(store.getActions()).toHaveLength(3);
      // Assuming the expected actions are correctly dispatched, you can check for specific actions and their payloads.
      expect(store.getActions()[0]).toEqual({ type: 'pokemon/setLoading', payload: true });
      expect(store.getActions()[1]).toEqual({
        type: 'pokemon/setPokemons',
        payload: [{ name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' }],
      });
      expect(store.getActions()[2]).toEqual({ type: 'pokemon/setLoading', payload: false });
    }, 1000);
  });
});
