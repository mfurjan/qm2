import { createSignal, createResource, Show, For } from "solid-js";
import { A, useNavigate } from "@solidjs/router";
import { currentUser, userProfile, isAdmin } from "../App";
import { getAllQuizzes, getUserResults } from "../services/db";

export default function Home() {
  const navigate = useNavigate();
  const [search, setSearch] = createSignal("");
  const [quizzes] = createResource(getAllQuizzes);
  const [results] = createResource(() => currentUser()?.uid, getUserResults);

  const filtered = () => {
    const q = search().toLowerCase();
    return (quizzes() ?? [])
      .filter(quiz => quiz.isPublished)
      .filter(quiz =>
        quiz.title.toLowerCase().includes(q) ||
        quiz.category.toLowerCase().includes(q)
      );
  };

  const stats = () => {
    const r = results() ?? [];
    if (r.length === 0) return null;
    const avg = Math.round(r.reduce((sum, x) => sum + x.percentage, 0) / r.length);
    const totalScore = r.reduce((sum, x) => sum + x.score, 0);
    return { total: r.length, avg, totalScore };
  };

  const categoryEmoji = (cat) => {
    const map = {
      "Opće znanje": "🌍", "Tehnologija": "💻", "Sport": "⚽",
      "Povijest": "📜", "Geografija": "🗺️", "Zabava": "🎬",
      "Glazba": "🎵", "Jezici": "🗣️", "Znanost": "🔬",
    };
    return map[cat] ?? "📚";
  };

  const categoryBg = (cat) => {
    const map = {
      "Opće znanje": "bg-orange-50", "Tehnologija": "bg-green-50", "Sport": "bg-blue-50",
      "Povijest": "bg-yellow-50", "Geografija": "bg-teal-50", "Zabava": "bg-pink-50",
      "Glazba": "bg-purple-50", "Jezici": "bg-red-50", "Znanost": "bg-indigo-50",
    };
    return map[cat] ?? "bg-gray-50";
  };

  return (
    <div class="min-h-screen bg-gray-50">
      {/* Navbar */}
      <div class="navbar bg-gray-900 px-6">
        <div class="navbar-start">
          <span class="text-xl font-bold text-white">
            Quiz <span class="text-primary">Master</span>
          </span>
        </div>
        <div class="navbar-center hidden md:flex">
          <ul class="menu menu-horizontal gap-1">
            <li><A href="/" class="font-medium text-gray-300 hover:text-white">Početna</A></li>
            <li><A href="/results" class="font-medium text-gray-300 hover:text-white">Rezultati</A></li>
            <Show when={isAdmin()}>
              <li><A href="/admin/quizzes" class="font-medium text-gray-300 hover:text-white">Admin panel</A></li>
            </Show>
          </ul>
        </div>
        <div class="navbar-end gap-3">
          <span class="text-sm font-medium text-gray-300 hidden sm:block">
            {userProfile()?.displayName}
          </span>
          <div class="dropdown dropdown-end">
            <div tabIndex={0} role="button" class="btn btn-ghost btn-circle avatar placeholder">
              <div class="bg-primary text-primary-content rounded-full w-10">
                <span class="text-sm font-bold">
                  {(userProfile()?.displayName || currentUser()?.email || "?")[0].toUpperCase()}
                </span>
              </div>
            </div>
            <ul tabIndex={0} class="mt-3 z-10 p-2 shadow-xl menu menu-sm dropdown-content bg-white rounded-box w-52 border border-gray-100">
              <li class="px-2 py-1 pointer-events-none">
                <span class="font-bold text-sm">{userProfile()?.displayName}</span>
              </li>
              <div class="divider my-0" />
              <li><A href="/profile">👤 Moj profil</A></li>
              <li><A href="/results">📊 Moji rezultati</A></li>
              <Show when={isAdmin()}>
                <li><A href="/admin/quizzes">⚙️ Admin panel</A></li>
              </Show>
              <div class="divider my-0" />
              <li><A href="/signout" class="text-error">🚪 Odjava</A></li>
            </ul>
          </div>
        </div>
      </div>

      <div class="max-w-5xl mx-auto px-6 py-8">

        {/* Pozdrav */}
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900">
            Dobrodošli natrag, {userProfile()?.displayName?.split(" ")[0] || currentUser()?.email} 👋
          </h1>
          <p class="text-gray-700 mt-1">Nastavi učiti - odaberi kviz i provjeri svoje znanje.</p>
        </div>

        {/* Statistika */}
        <Show when={stats()}>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div class="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
              <div class="text-3xl">🎯</div>
              <div>
                <div class="text-2xl font-bold text-gray-900">{stats().total}</div>
                <div class="text-sm text-gray-700">Riješenih kvizova</div>
              </div>
            </div>
            <div class="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
              <div class="text-3xl">📈</div>
              <div>
                <div class="text-2xl font-bold text-gray-900">{stats().avg}%</div>
                <div class="text-sm text-gray-700">Prosječni rezultat</div>
              </div>
            </div>
            <div class="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
              <div class="text-3xl">⭐</div>
              <div>
                <div class="text-2xl font-bold text-gray-900">{stats().totalScore}</div>
                <div class="text-sm text-gray-700">Ukupno bodova</div>
              </div>
            </div>
          </div>
        </Show>

        {/* Header kvizova + pretraživanje */}
        <div class="flex justify-between items-center mb-4 gap-4 flex-wrap">
          <h2 class="text-xl font-bold text-gray-900"> Kvizovi</h2>
          <input
            type="text"
            class="input input-bordered input-sm w-56"
            placeholder="🔍 Pretraži kvizove..."
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
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 text-center py-12">
            <div class="text-5xl mb-3">🤔</div>
            <p class="font-semibold text-gray-700">Nema dostupnih kvizova.</p>
            <Show when={search()}>
              <p class="text-sm text-gray-600 mt-1">Pokušaj s drugim pojmom.</p>
            </Show>
          </div>
        </Show>

        {/* Lista kvizova */}
        <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <For each={filtered()}>
            {(quiz) => (
              <div class="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 overflow-hidden flex flex-col">
                <div class={`${categoryBg(quiz.category)} flex items-center justify-center py-6 text-5xl`}>
                  {categoryEmoji(quiz.category)}
                </div>
                <div class="p-4 flex flex-col flex-1">
                  <span class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    {quiz.category}
                  </span>
                  <h3 class="font-bold text-gray-900 mb-1 leading-snug">{quiz.title}</h3>
                  <p class="text-sm text-gray-600 line-clamp-2 flex-1">{quiz.description}</p>
                  <div class="flex justify-end mt-4">
                    <button
                      class="btn btn-neutral btn-sm rounded-full px-5"
                      onClick={() => navigate(`/quiz/${quiz.id}`)}
                    >
                      Počni
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