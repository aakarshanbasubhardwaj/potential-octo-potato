// MovieCard.jsx
import React from 'react';
import { Card, CardMedia, CardContent, Typography, CardActions, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function MovieCard({ movie }) {
  const navigate = useNavigate();
  const { _id, title, poster_path, genre_ids, vote_average } = movie;

  // Use higher quality image
  const imageUrl = poster_path 
    ? `https://image.tmdb.org/t/p/w780${poster_path}` 
    : 'https://via.placeholder.com/500x750?text=No+Image';

  return (
    <Card sx={{ width: 160, marginRight: 1, display: 'flex', flexDirection: 'column' }} onClick={() => navigate(`/movie/${_id}`)}>
        <CardMedia
            component="img"
            height="250"
            image={imageUrl}
            alt={title}
            sx={{ objectFit: 'cover' }}
        />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="div" noWrap>
          {title}
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block">
          Genre: {genre_ids}
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block">
          Rating: {vote_average}
        </Typography>
      </CardContent>
      {/* <CardActions>
        <Button size="small">Details</Button>
        <Button size="small">Book</Button>
      </CardActions> */}
    </Card>
  );
}
