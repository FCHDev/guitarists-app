import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AdminPage from "./AdminPage";
import { createGuitarist } from "../services/guitaristsApi";

// On isole complètement AdminPage de Supabase/Cloudinary : ce test vérifie
// le comportement du formulaire (champs affichés, appel à l'API avec les
// bonnes données), pas l'intégration réseau réelle.
jest.mock("../services/guitaristsApi", () => ({
  createGuitarist: jest.fn(),
  updateGuitarist: jest.fn(),
  deleteGuitarist: jest.fn(),
}));

const renderAdminPage = (guitarists = []) =>
  render(
    <MemoryRouter>
      <AdminPage guitarists={guitarists} />
    </MemoryRouter>
  );

beforeEach(() => {
  jest.clearAllMocks();
  window.alert = jest.fn();
});

test("affiche le formulaire d'ajout avec ses champs principaux", () => {
  renderAdminPage();

  expect(
    screen.getByRole("heading", { name: /ajouter un guitariste/i })
  ).toBeInTheDocument();
  expect(screen.getByLabelText(/^nom$/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/^prénom$/i)).toBeInTheDocument();
  expect(
    screen.getByLabelText(/rechercher un guitariste à modifier/i)
  ).toBeInTheDocument();
});

test("ajoute un nouveau guitariste avec les informations saisies", async () => {
  createGuitarist.mockResolvedValueOnce({ id: 42 });
  renderAdminPage();

  fireEvent.change(screen.getByLabelText(/^nom$/i), {
    target: { value: "Hendrix" },
  });
  fireEvent.change(screen.getByLabelText(/^prénom$/i), {
    target: { value: "Jimi" },
  });

  fireEvent.click(screen.getByRole("button", { name: /^ajouter$/i }));

  await waitFor(() => expect(createGuitarist).toHaveBeenCalledTimes(1));
  expect(createGuitarist).toHaveBeenCalledWith(
    expect.objectContaining({ nom: "Hendrix", prenom: "Jimi" })
  );

  await waitFor(() =>
    expect(window.alert).toHaveBeenCalledWith(
      expect.stringContaining("Jimi Hendrix a bien été ajouté")
    )
  );
});

test("affiche un message d'erreur si l'enregistrement échoue", async () => {
  createGuitarist.mockRejectedValueOnce(new Error("Erreur réseau"));
  renderAdminPage();

  fireEvent.change(screen.getByLabelText(/^nom$/i), {
    target: { value: "Hendrix" },
  });

  fireEvent.click(screen.getByRole("button", { name: /^ajouter$/i }));

  await waitFor(() =>
    expect(window.alert).toHaveBeenCalledWith(
      expect.stringContaining("Erreur lors de l'enregistrement")
    )
  );
});
