import React, { useState, useEffect, useRef } from "react";
import useItems from "../../Hooks/useItems";
import { Link } from "react-router-dom";
import { debounce } from "lodash";

const SearchBar = () => {
  const [items] = useItems(); // Fetch items using your custom hook
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
  const inputRef = useRef(null);

  const filterItems = debounce((query, items) => {
    if (query.trim() === "") {
      setSearchResults([]);
      setShowResults(false);
    } else {
      const filteredItems = items.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filteredItems);
      setShowResults(true);
    }
  }, 300);

  useEffect(() => {
    filterItems(query, items);
  }, [query, items]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim() === "") return;
    setShowResults(false);
    // Redirect to the search results page or handle the search action
  };

  const handleClickOutside = (event) => {
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      setShowResults(false);
    }
  };

  useEffect(() => {
    const handleKeydown = (event) => {
      if (event.ctrlKey && event.key === "s") {
        event.preventDefault();
        inputRef.current.focus();
      }
    };

    document.addEventListener("keydown", handleKeydown);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("keydown", handleKeydown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="p-6 flex justify-center text-center items-center relative bg-white">
      <form
        onSubmit={handleSearch}
        className="flex items-center relative w-full "
        ref={searchRef}
      >
        <label
          for="default-search"
          class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
        >
          Search
        </label>
        <div class="relative w-full">
          <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              class="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Product . . ."
            type="search"
            id="default-search"
            class="block w-full p-4 ps-10 text-sm text-gray-900  border-gray-300 rounded-lg  border  dark:placeholder-gray-400 dark:text-white  "
            required
          />
          <button
            type="submit"
            class="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Search
          </button>
        </div>
        {showResults && (
          <ul className="absolute top-full mt-2 w-full bg-white border rounded-md z-10">
            {searchResults.length > 0 ? (
              searchResults.slice(0, 4).map((item) => (
                <li key={item._id} className="px-4 py-2 hover:bg-gray-100">
                  <Link
                    to={`/shop/category/${item._id}`}
                    onClick={() => setShowResults(false)}
                    className="block text-black"
                  >
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="mask mask-squircle w-12 h-12">
                          <img loading="lazy" src={item?.img} alt={item.name} />
                        </div>
                      </div>
                      <div>
                        <div className="font-bold">{item.name}</div>
                      </div>
                    </div>
                  </Link>
                </li>
              ))
            ) : (
              <li className="p-3 text-gray-500">No results found</li>
            )}
          </ul>
        )}
      </form>
    </nav>
  );
};

export default SearchBar;
