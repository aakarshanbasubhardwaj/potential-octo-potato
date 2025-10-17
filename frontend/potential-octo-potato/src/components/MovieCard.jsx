// MovieCard.jsx
import React from 'react';
import { Card, CardMedia, CardContent, Typography, CardActions, Button } from '@mui/material';

export default function MovieCard({ movie }) {
  const { title, poster_path, release_date, vote_average } = movie;

  // Use higher quality image
  const imageUrl = poster_path 
    ? `https://image.tmdb.org/t/p/w780${poster_path}` 
    : 'https://via.placeholder.com/500x750?text=No+Image';

  return (
    <Card sx={{ width: 160, marginRight: 1, display: 'flex', flexDirection: 'column' }}>
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
          Release: {release_date}
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
