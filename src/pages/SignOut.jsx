// src/pages/SignOut.jsx

import { onMount } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { logOut } from "../services/auth";

export default function SignOut() {
  const navigate = useNavigate();

  onMount(async () => {
    await logOut();
    navigate("/signin");
  });

  return (
    <div class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <span class="loading loading-spinner loading-lg text-primary" />
        <p class="mt-4 text-base-content/60">Odjava u tijeku...</p>
      </div>
    </div>
  );
}
