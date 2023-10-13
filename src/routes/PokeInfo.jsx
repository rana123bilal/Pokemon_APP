import React, {useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/solid";
import PokeInfoDetails from "../components/PokeInfo/PokeInfoDetails";
import PokeStats from "../components/PokeInfo/PokeStats";

import FavoriteButton from "../components/FavoriteButton";

import { useSelector, useDispatch } from "react-redux";
import {
  setPokeInfo,
  setError,
  setLoading,
} from "../redux/features/pokemonInfoSlice";
const PokeInfo = () => {
  const dispatch = useDispatch();
  const { pokeInfo, isLoading, error } = useSelector(
    (state) => state.pokemonInfo
  );
  const [favorites, setFavorites] = useState([]);
  const { pokemon } = useParams();

  useEffect(() => {
    dispatch(setLoading(true));

    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`)
      .then((response) => response.json())
      .then((data) => {
        dispatch(setPokeInfo(data));
      })
      .catch((error) => {
        dispatch(setLoading(false));
        dispatch(setError(error.message));
      });
  }, [dispatch, pokemon]);

  // Load any saved favorites from local storage when the component mounts
  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(storedFavorites);
  }, []);

  // Add a Pokemon to the favorites list and save to local storage
  const addFavorite = (pokemonId) => {
    if (!favorites.includes(pokemonId)) {
      const newFavorites = [...favorites, pokemonId];
      setFavorites(newFavorites);
      localStorage.setItem("favorites", JSON.stringify(newFavorites));
    }
  };

  // Remove a Pokemon from the favorites list and save to local storage
  const removeFavorite = (pokemonId) => {
    const newFavorites = favorites.filter((id) => id !== pokemonId);
    setFavorites(newFavorites);
    localStorage.setItem("favorites", JSON.stringify(newFavorites));
  };

  // Add or remove a Pokemon from the favorites list depending on whether it's already in the list
  const handleAddRemoveFavorite = (pokemonId) => {
    favorites.includes(pokemonId)
      ? removeFavorite(pokemonId)
      : addFavorite(pokemonId);
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <>
      <Link
        to="/"
        className="float-left bg-white py-2 px-4 rounded shadow hover:scale-110 transition-all duration-300"
      >
        <ArrowLeftIcon className="w-5 h-5 transform" />
      </Link>
      <div className="flex flex-col sm:flex-row float-right">
        <button
          onClick={() => handleAddRemoveFavorite(pokeInfo.id)}
          className="float-right text-1xl font-bold mr-5 hover:scale-110 transition-all duration-300"
        >
          Add/Remove from favorites
        </button>
        <Link to="/favorites">
          <FavoriteButton />
        </Link>
      </div>
      <div className="text-gray-700">
        <div className="px-4 py-16 mt-10 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20 shadow-lg rounded-lg">
          <div className="grid gap-24 row-gap-8 lg:grid-cols-5">
            <PokeInfoDetails pokeInfo={pokeInfo} />
            <PokeStats pokeInfo={pokeInfo} />
          </div>
        </div>
      </div>
    </>
  );
};

export default PokeInfo;
