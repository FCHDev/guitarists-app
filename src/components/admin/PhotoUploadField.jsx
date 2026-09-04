import { AiOutlineCloudUpload } from "react-icons/ai";

// Zone d'envoi de la photo (dropzone) + aperçu, utilisée dans le formulaire
// admin. La sélection du fichier est remontée au parent via onFileSelected,
// qui se charge de générer l'aperçu et de mémoriser le fichier (l'envoi
// réel vers Cloudinary n'a lieu qu'à l'enregistrement du guitariste).
const PhotoUploadField = ({ onFileSelected, preview }) => (
  <>
    <div className="upload-section">
      <AiOutlineCloudUpload className="upload-icon" />
      <label htmlFor="inputTag" className="upload-label">
        Choisir une image
        <input
          id="inputTag"
          type="file"
          accept="image/*"
          onChange={(event) => onFileSelected(event.target.files[0] || null)}
        />
      </label>
      <p className="upload-hint">
        La photo est envoyée automatiquement lors de l'enregistrement, plus
        besoin de bouton séparé.
      </p>
    </div>
    {preview}
  </>
);

export default PhotoUploadField;
