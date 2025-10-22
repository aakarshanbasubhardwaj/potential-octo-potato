import PaginatedList from '../components/PaginatedList';
import SearchBox from '../components/SearchBox';
import SearchResults from '../components/SearchResults';
import { useState } from 'react';

export default function Home() {
  const [searchResults, setSearchResults] = useState([]);
  const [query, setQuery] = useState([]);

  return (
    <div>
      <SearchBox onSearch={(results, query) => {
          setSearchResults(results);
          setQuery(query);
        }}/>
        {searchResults.length > 0 ? (
        <div>
          <SearchResults searchTerm={query} initialResults={searchResults} model ={"search"} />
        </div>
      ) : (
        <>
          <PaginatedList 
            title="Popular Movies" 
            model="popularMovie"
            itemType="movies"
          />
          <PaginatedList 
            title="Top Rated Movies" 
            model="topRatedMovie"
            itemType="movies"
          />
          <PaginatedList 
            title="Trending Movies" 
            model="trendingMovie"
            itemType="movies"
          />
          <PaginatedList 
            title="Popular TV Shows" 
            model="popularTv"
            itemType="tv"
          />
          <PaginatedList 
            title="Top Rated TV Shows" 
            model="topRatedTv"
            itemType="tv"
          />
          <PaginatedList 
            title="Trending TV Shows" 
            model="trendingTv"
            itemType="tv"
          />
        </>
      )}
    </div>
  );
}
