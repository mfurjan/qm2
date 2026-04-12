  import { useNavigate } from "@solidjs/router";
import { Show } from "solid-js";

const ERROR_DATA = {
  404: {
    title: "Stranica nije pronađena",
    message: "Stranica koju tražite ne postoji.",
  },
  403: {
    title: "Nema pristupa",
    message: "Nemate pristup ovoj stranici.",
  },
  500: {
    title: "Greška poslužitelja",
    message: "Došlo je do neočekivane greške. Pokušajte ponovo.",
  },
};

export default function Error(props) {
  const navigate   = useNavigate();
  const code       = () => props.code ?? 404;
  const data       = () => ERROR_DATA[code()] ?? ERROR_DATA[404];

  return (
    <div class="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div class="card w-full max-w-md bg-base-100 shadow-xl text-center">
        <div class="card-body items-center">
          <div class="text-7xl mb-2">{data().emoji}</div>
          <div class="badge badge-ghost text-lg font-mono mb-2">{code()}</div>
          <h1 class="text-2xl font-bold">{data().title}</h1>
          <p class="text-base-content/60 mt-1">{data().message}</p>
          <div class="card-actions mt-6 gap-2">
            <button class="btn btn-ghost btn-sm" onClick={() => navigate(-1)}>
              Natrag
            </button>
            <button class="btn btn-primary btn-sm" onClick={() => navigate("/")}>
              Početna stranica
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
