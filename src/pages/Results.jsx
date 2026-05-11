import { createResource, Show, For } from "solid-js";
import { A } from "@solidjs/router";
import { getUserResults } from "../services/db";
import { currentUser, isAdmin } from "../App";

function formatDate(ts) {
  if (!ts) return "";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString("hr-HR", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function resultBg(percentage) {
  if (percentage >= 80) return "bg-green-50 text-green-700";
  if (percentage >= 60) return "bg-blue-50 text-blue-700";
  if (percentage >= 40) return "bg-yellow-50 text-yellow-700";
  return "bg-red-50 text-red-700";
}

export default function Results() {
  const [results] = createResource(() => currentUser()?.uid, getUserResults);

  const stats = () => {
    const r = results() ?? [];
    if (r.length === 0) return null;
    const avg = Math.round(r.reduce((sum, x) => sum + x.percentage, 0) / r.length);
    const best = Math.max(...r.map(x => x.percentage));
    const totalScore = r.reduce((sum, x) => sum + x.score, 0);
    return { avg, best, total: r.length, totalScore };
  };

  return (
    <div class="min-h-screen bg-gray-50">
      {/* Navbar */}
      <div class="navbar bg-gray-900 px-6">
        <div class="navbar-start">
          <A href="/" class="text-xl font-bold text-white">
            Quiz <span class="text-primary">Master</span>
          </A>
        </div>
        <div class="navbar-center hidden md:flex">
          <ul class="menu menu-horizontal gap-1">
            <li><A href="/" class="text-gray-300 hover:text-white font-medium">Početna</A></li>
            <li><A href="/results" class="text-white font-medium">Moji rezultati</A></li>
            <Show when={isAdmin()}>
              <li><A href="/admin/quizzes" class="text-gray-300 hover:text-white font-medium">Admin panel</A></li>
            </Show>
          </ul>
        </div>
        <div class="navbar-end gap-4">
          <A href="/signout" class="text-red-400 hover:text-red-300 text-sm font-medium">Odjava</A>
        </div>
      </div>

      <div class="max-w-4xl mx-auto px-6 py-8">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900">Moji rezultati</h1>
          <p class="text-gray-700 mt-1">Pregled svih tvojih riješenih kvizova.</p>
        </div>

        <Show when={results.loading}>
          <div class="flex justify-center py-12">
            <span class="loading loading-spinner loading-lg text-primary" />
          </div>
        </Show>

        <Show when={results() && results().length === 0}>
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 text-center py-12">
            <div class="text-5xl mb-3">📭</div>
            <p class="font-semibold text-gray-700">Još nisi riješio nijedan kviz.</p>
            <A href="/" class="btn btn-neutral btn-sm rounded-full px-6 mt-4">
              Idi na kvizove
            </A>
          </div>
        </Show>

        <Show when={stats()}>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <div class="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm text-center">
              <div class="text-3xl mb-1">🎯</div>
              <div class="text-2xl font-bold text-gray-900">{stats().total}</div>
              <div class="text-sm text-gray-700">Riješenih</div>
            </div>
            <div class="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm text-center">
              <div class="text-3xl mb-1">📈</div>
              <div class="text-2xl font-bold text-gray-900">{stats().avg}%</div>
              <div class="text-sm text-gray-700">Prosjek</div>
            </div>
            <div class="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm text-center">
              <div class="text-3xl mb-1">🏆</div>
              <div class="text-2xl font-bold text-gray-900">{stats().best}%</div>
              <div class="text-sm text-gray-700">Najbolji</div>
            </div>
            <div class="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm text-center">
              <div class="text-3xl mb-1">⭐</div>
              <div class="text-2xl font-bold text-gray-900">{stats().totalScore}</div>
              <div class="text-sm text-gray-700">Ukupno bod.</div>
            </div>
          </div>

          <h2 class="text-xl font-bold text-gray-900 mb-4">Povijest</h2>
          <div class="flex flex-col gap-3">
            <For each={results()}>
              {(r) => (
                <div class="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-4">
                  <div class="flex justify-between items-center gap-4">
                    <div class="flex-1 min-w-0">
                      <h3 class="font-semibold text-gray-900 truncate">{r.quizTitle}</h3>
                      <p class="text-xs text-gray-500 mt-0.5">{formatDate(r.completedAt)}</p>
                    </div>
                    <div class="flex items-center gap-3 shrink-0">
                      <span class="text-sm text-gray-600">{r.score}/{r.maxScore} bod.</span>
                      <span class={`text-sm font-bold px-3 py-1 rounded-full ${resultBg(r.percentage)}`}>
                        {r.percentage}%
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </For>
          </div>
        </Show>
      </div>
    </div>
  );
}