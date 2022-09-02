import * as React from "react";
import { API_URL } from "../config";
import { Link } from "react-router-dom";

import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

export default function CardPost({ card }) {
  return (
    <Card sx={{ maxWidth: 345 }} style={{ margin: "10px" }}>
      <CardMedia
        component="img"
        height="280"
        image={
          card.attributes.pic !== null
            ? API_URL + card.attributes.pic.data.attributes.url
            : "Pas d'image"
        }
        alt={card.attributes.nom}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {card.attributes.nom}, {card.attributes.prenom}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {card.attributes.bio.substring(0, 100) + "..."}
        </Typography>
      </CardContent>
      <CardActions>
        <Link to={`/card/${card.id}`}>
          <Button size="small">Learn More</Button>
        </Link>
      </CardActions>
    </Card>
  );
}
