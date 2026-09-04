import * as React from "react";
import {Link} from "react-router-dom";
import {motion} from "framer-motion";
import {ArrowRight} from "lucide-react";
import ArtistsMainInfo from "./ArtistsMainInfo";
import {cloudinaryCardThumbnail} from "../utils/cloudinaryUrl";

// Lien "motion" : la carte est un <Link> react-router, avec en plus les
// props d'animation de Framer Motion (apparition au scroll, léger effet au
// survol). motion.create() enveloppe un composant existant sans changer ce
// qu'il rend (remplace l'ancienne API motion(Link), dépréciée).
const MotionCard = motion.create(Link);

// Mémoïsé : ce composant est rendu ~100 fois sur la page d'accueil, et un
// re-rendu du parent (ex. bascule du thème clair/sombre) ne doit pas
// refaire le rendu de chaque carte si son guitariste n'a pas changé.
// Comparaison par défaut de React.memo (référence des props) suffisante ici :
// CardsPage passe directement les objets guitarist de la liste, sans en
// recréer de nouveaux à chaque rendu (filter/sort/map ne clonent pas).
const CardPost = React.memo(function CardPost({guitarist}) {
    return (
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
            {/* Toute la carte est déjà un lien : ceci est un indicateur
                visuel, pas un second contrôle interactif imbriqué dans le
                <a> (un <button> dans un <a> n'est pas un HTML valide). */}
            <span className="card-cta">
                En savoir plus
                <ArrowRight size={14} aria-hidden="true" />
            </span>
        </MotionCard>
    );
});

export default CardPost;
