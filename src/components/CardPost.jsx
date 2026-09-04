import * as React from "react";
import {Link} from "react-router-dom";
import {motion} from "framer-motion";
import {ArrowRight, Pencil} from "lucide-react";
import ArtistsMainInfo from "./ArtistsMainInfo";
import {cloudinaryCardThumbnail} from "../utils/cloudinaryUrl";

const MotionCard = motion.create(Link);

const CardPost = React.memo(function CardPost({guitarist, isConnected}) {
    return (
        <div className="card-wrap">
            <MotionCard
                to={`/card/${guitarist.id}`}
                className="card"
                initial={{opacity: 0, y: 16}}
                whileInView={{opacity: 1, y: 0}}
                viewport={{once: true, margin: "-60px"}}
                transition={{duration: 0.35, ease: "easeOut"}}
                whileHover={{y: -6}}
            >
                <div className="card-avatar-ring">
                    <img
                        className={`card-avatar${guitarist.mort ? " card-avatar--deceased" : ""}`}
                        src={guitarist.imgURL !== null ? cloudinaryCardThumbnail(guitarist.imgURL) : "Pas d'image"}
                        alt={guitarist.nom}
                        loading="lazy"
                    />
                </div>
                <ArtistsMainInfo guitarist={guitarist}/>
                <p className="card-bio">{guitarist.bio || ""}</p>
                <span className="card-cta">
                    En savoir plus
                    <ArrowRight size={14} aria-hidden="true" />
                </span>
            </MotionCard>
            {/* En dehors du <Link> de la carte (pas de <a> imbriqué en HTML) :
                positionné par-dessus au survol/clic, mène directement sur la
                fiche admin avec ce guitariste déjà sélectionné. Visible
                uniquement pour un admin connecté. */}
            {isConnected ? (
                <Link
                    to={`/admin?edit=${guitarist.id}`}
                    className="card-edit-btn"
                    title={`Modifier ${guitarist.nom}`}
                    aria-label={`Modifier ${guitarist.nom}`}
                >
                    <Pencil size={13} aria-hidden="true" />
                </Link>
            ) : null}
        </div>
    );
});
export default CardPost;
