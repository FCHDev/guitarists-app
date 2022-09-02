import * as React from "react";
import { API_URL } from "../config";
import { Link } from "react-router-dom";

import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import ArtistsMainInfo from "./ArtistsMainInfo";

// console.log(new Date().getFullYear());

export default function CardPost({ card }) {
  return (
    <Link to={`/card/${card.id}`}>
      <Card sx={{ maxWidth: 365 }} style={{ margin: "10px" }}>
        <CardMedia
          component="img"
          height="350"
          image={
            card.attributes.pic !== null
              ? API_URL + card.attributes.pic.data.attributes.url
              : "Pas d'image"
          }
          alt={card.attributes.nom}
        />
        <CardContent>
          <ArtistsMainInfo card={card} />
          <Typography variant="body2" color="text.secondary">
            {card.attributes.bio.substring(0, 70) + "..."}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small">Learn More</Button>
        </CardActions>
      </Card>
    </Link>
  );
}
