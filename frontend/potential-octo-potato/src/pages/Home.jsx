import PaginatedList from '../components/PaginatedList';

export default function Home() {
  return (
    <div>
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
