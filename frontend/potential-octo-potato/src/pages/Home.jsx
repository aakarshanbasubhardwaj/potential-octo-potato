import PaginatedList from '../components/PaginatedList';

export default function Home() {
  return (
    <div>
      <PaginatedList 
        title="Popular Movies" 
        apiEndpoint="http://localhost:3333/movies/popular" 
      />
      {/* <PaginatedList 
        title="Trending TV Shows" 
        apiEndpoint="http://localhost:3333/tv/trending" 
        CardComponent={TVShowCard} 
      /> */}
    </div>
  );
}
