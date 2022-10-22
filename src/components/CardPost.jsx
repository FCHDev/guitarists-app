import * as React from "react";
import {Link} from "react-router-dom";

import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import ArtistsMainInfo from "./ArtistsMainInfo";
import {Fade} from "@mui/material";

export default function CardPost({guitarist}) {
    return (
        <Fade
            in={true}
            appear={true}
            unmountOnExit
            timeout={{enter: 1500, exit: 1000}}
        >
            <Link to={`/card/${guitarist.id}`}>
                <Card
                    sx={{maxWidth: 365}}
                    className="card"
                    // style={{ margin: "10px", background: "#e5e5e5" }}
                >
                    <CardMedia
                        component="img"
                        height="350"
                        image={guitarist.imgURL !== null ? guitarist.imgURL : "Pas d'image"}
                        alt={guitarist.nom}
                    />
                    <CardContent>
                        <ArtistsMainInfo guitarist={guitarist}/>
                        <Typography variant="body2" component="h3">
                            {guitarist.bio.substring(0, 80) + "..."}
                        </Typography>
                    </CardContent>
                    <CardActions className="savoir-plus">
                        <Button className="savoir-plus" size="small">
                            En savoir plus
                        </Button>
                    </CardActions>
                </Card>
            </Link>
        </Fade>
    );
}
