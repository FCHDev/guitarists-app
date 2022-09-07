import * as React from "react";
import { Link } from "react-router-dom";

import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import ArtistsMainInfo from "./ArtistsMainInfo";

export default function CardPost({ guitarist }) {
  // console.log(guitarist);
  return (
    <Link to={`/card/${guitarist.id}`}>
      <Card sx={{ maxWidth: 365 }} style={{ margin: "10px" }}>
        <CardMedia
          component="img"
          height="350"
          image={guitarist.pic !== null ? guitarist.pic.url : "Pas d'image"}
          alt={guitarist.nom}
        />
        <CardContent>
          <ArtistsMainInfo guitarist={guitarist} />
          <Typography variant="body2" color="text.secondary">
            {guitarist.bio.substring(0, 70) + "..."}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small">En savoir plus</Button>
        </CardActions>
      </Card>
    </Link>
  );
}
