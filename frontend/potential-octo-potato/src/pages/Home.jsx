import PaginatedList from '../components/PaginatedList';
import SearchBox from '../components/SearchBox';

export default function Home() {
  return (
    <div>
      <SearchBox />
      <PaginatedList 
        title="Popular Movies" 
        model="popularMovie"
      />
      <PaginatedList 
        title="Top Rated Movies" 
        model="topRatedMovie"
      />
      <PaginatedList 
        title="Trending This Week" 
        model="trendingMovie"
      />
    </div>
  );
}
