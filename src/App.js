import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setPokemons, setError, setLoading, setPokemonData } from './redux/features/pokemonListSlice';
import './App.css'
import PokeCard from './components/PokeCard';
import FavoriteButton from './components/FavoriteButton';
import Pagination from './components/Pagination/Pagination';

function App() {
  // state for pagination and current page
  const [offset, setOffset] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  // Fetch the list of pokemons from the API whenever the offset changes
  const dispatch = useDispatch();
  const { pokemons, pokemonData, loading, error } = useSelector(
    (state) => state.pokemon
  );

  // Fetch the list of pokemons from the API
  useEffect(() => {
    dispatch(setLoading(true));
    fetch(`https://pokeapi.co/api/v2/pokemon?limit=10&offset=${offset}`)
      .then((response) => response.json())
      .then((data) => {
        dispatch(setPokemons(data.results));
        dispatch(setLoading(false));
      })
      .catch((error) => {
        dispatch(setLoading(false));
        dispatch(setError(error.message));
      });
  }, [dispatch, offset]);

  useEffect(() => {
    if (pokemons.length > 0) {
      const fetchData = async () => {
        const data = await Promise.all(
          pokemons.map((item) =>
            fetch(item.url).then((response) => response.json())
          )
        );
        dispatch(setPokemonData(data));
      };

      fetchData();
    }
  }, [pokemons, dispatch]);
  // Update the offset and current page number when the pagination is clicked
  const handlePaginationClick = (newOffset) => {
    setOffset(newOffset);
    setCurrentPage(Math.ceil(newOffset / 10) + 1);
  };

  // Generate an array of page numbers to display in the pagination component
  const pageNumbers = [
    currentPage - 2,
    currentPage - 1,
    currentPage,
    currentPage + 1,
    currentPage + 2].filter(
      (pageNumber) => pageNumber > 0
    );

  // Render the Pokemón App UI
  return (
    <div className="App text-gray-700">
      <p className="text-4xl font-bold">Pokemón App</p>
      <Link to="/favorites">
        <FavoriteButton />
      </Link>
      {loading ? (
        <p className="text-center text-xl mt-20">Loading...</p>
      ) : error ? (
        <p className="text-center text-xl mt-20">Error: {error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-10 mt-20">
          {pokemonData.map((data) => (
            <Link
              data-testid="poke-card"
              to={`/pokeinfo/${data.name}`}
              key={data.id}
              className="flex flex-col items-center justify-center"
            >
              <PokeCard data={data} />
            </Link>
          ))}
        </div>
      )}
      <div className="flex justify-center mt-10">
        {/* Render the Pagination component with the generated page numbers and event handlers */}
        <Pagination
          pageNumbers={pageNumbers}
          offset={offset}
          handlePaginationClick={handlePaginationClick}
          disabledPrev={offset === 0}
          disabledNext={pokemons.length < 10}
        />
      </div>
    </div>
  )
}

export default App
