// MovieCard.jsx
import React from 'react';
import { Card, CardMedia, CardContent, Typography, CardActions, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function MovieCard({ movie, model, itemType }) {
  const navigate = useNavigate();
  const { _id, title, poster_path, genres, vote_average } = movie;

  // if (!title || !poster_path || vote_average == null || !genres?.length) {
  //   return null;
  // }

  const imageUrl = poster_path 
    ? `https://image.tmdb.org/t/p/w780${poster_path}` 
    : 'https://via.placeholder.com/500x750?text=No+Image';

  return (
    <Card sx={{ width: 160, display: 'flex', flexDirection: 'column', height: 380,}} onClick={() => navigate(`/movie/${_id}/${model}`, { state: { itemType } })}>
        <CardMedia
            component="img"
            height="250"
            image={imageUrl}
            alt={title}
            sx={{ objectFit: 'cover' }}
        />
      <CardContent sx={{ flexGrow: 1, overflow: 'hidden' }}>
        <Typography gutterBottom variant="overline" component="div" noWrap>
          {title}
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block" sx={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
          {genres.join(' ')}
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block">
          {vote_average.toFixed(1)} ⭐
        </Typography>
      </CardContent>
    </Card>
  );
}
