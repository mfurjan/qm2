import { createSignal, createResource, Show, For } from "solid-js";
import { A, useNavigate } from "@solidjs/router";
import { currentUser, userProfile, isAdmin } from "../App";
import { getAllQuizzes } from "../services/db";

export default function Home() {
  const navigate = useNavigate();
  const [search, setSearch] = createSignal("");
  const [quizzes] = createResource(getAllQuizzes);

  const filtered = () => {
    const q = search().toLowerCase();
    return (quizzes() ?? [])
      .filter(quiz => quiz.isPublished)
      .filter(quiz =>
        quiz.title.toLowerCase().includes(q) ||
        quiz.category.toLowerCase().includes(q)
      );
  };

  return (
    <div class="min-h-screen bg-base-200">
      {/* Navbar */}
      <div class="navbar bg-base-100 shadow px-4">
        <div class="navbar-start">
          <A href="/" class="text-xl font-bold text-primary">QuizMaster</A>
        </div>
        <div class="navbar-center hidden md:flex">
          <ul class="menu menu-horizontal px-1">
            <li><A href="/">Početna</A></li>
            <li><A href="/results">Moji rezultati</A></li>
            <Show when={isAdmin()}>
              <li><A href="/admin/quizzes">Admin panel</A></li>
            </Show>
          </ul>
        </div>
        <div class="navbar-end gap-2">
          <Show when={isAdmin()}>
            <div class="badge badge-primary hidden sm:flex">Admin</div>
          </Show>
          <div class="dropdown dropdown-end">
            <div tabIndex={0} role="button" class="btn btn-ghost btn-circle avatar placeholder">
              <div class="bg-primary text-primary-content rounded-full w-10">
                <span class="text-sm font-bold">
                  {(userProfile()?.displayName || currentUser()?.email || "?")[0].toUpperCase()}
                </span>
              </div>
            </div>
            <ul tabIndex={0} class="mt-3 z-10 p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-48 border border-base-200">
              <li class="px-2 py-1 pointer-events-none">
                <span class="font-semibold text-sm">{userProfile()?.displayName}</span>
              </li>
              <div class="divider my-0" />
              <li><A href="/profile">Moj profil</A></li>
              <li><A href="/results">Moji rezultati</A></li>
              <Show when={isAdmin()}>
                <li><A href="/admin/quizzes">Admin panel</A></li>
              </Show>
              <div class="divider my-0" />
              <li><A href="/signout" class="text-error">Odjava</A></li>
            </ul>
          </div>
        </div>
      </div>

      <div class="max-w-4xl mx-auto p-6">
        {/* Pozdrav */}
        <div class="mb-6">
          <h1 class="text-3xl font-bold">
            Dobrodošli, {userProfile()?.displayName || currentUser()?.email}!
          </h1>
          <p class="text-base-content/60 mt-1">Odaberi kviz i provjeri svoje znanje.</p>
        </div>

        <Show when={isAdmin()}>
          <div class="alert alert-info mb-6 text-sm">
            <span>Prijavljeni ste kao administrator — imate pristup upravljanju kvizovima.</span>
          </div>
        </Show>

        {/* Pretraživanje */}
        <div class="form-control mb-6">
          <input
            type="text"
            class="input input-bordered w-full"
            placeholder="Pretraži kvizove po nazivu ili kategoriji..."
            onInput={e => setSearch(e.target.value)}
          />
        </div>

        {/* Loading */}
        <Show when={quizzes.loading}>
          <div class="flex justify-center py-12">
            <span class="loading loading-spinner loading-lg text-primary" />
          </div>
        </Show>

        {/* Nema kvizova */}
        <Show when={!quizzes.loading && filtered().length === 0}>
          <div class="card bg-base-100 shadow">
            <div class="card-body text-center text-base-content/60">
              <p class="text-lg">Nema dostupnih kvizova.</p>
              <Show when={search()}>
                <p class="text-sm">Pokušaj s drugim pojmom za pretraživanje.</p>
              </Show>
            </div>
          </div>
        </Show>

        {/* Lista kvizova */}
        <div class="grid gap-4 sm:grid-cols-2">
          <For each={filtered()}>
            {(quiz) => (
              <div class="card bg-base-100 shadow hover:shadow-md transition-shadow">
                <div class="card-body">
                  <div class="flex justify-between items-start">
                    <h2 class="card-title text-lg">{quiz.title}</h2>
                    <span class="badge badge-outline badge-sm shrink-0">{quiz.category}</span>
                  </div>
                  <p class="text-sm text-base-content/60 line-clamp-2">{quiz.description}</p>
                  <div class="card-actions justify-end mt-2">
                    <button
                      class="btn btn-primary btn-sm"
                      onClick={() => navigate(`/quiz/${quiz.id}`)}
                    >
                      Započni kviz →
                    </button>
                  </div>
                </div>
              </div>
            )}
          </For>
        </div>
      </div>
    </div>
  );
}