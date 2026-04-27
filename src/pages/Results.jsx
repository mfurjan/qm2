import { createResource, Show, For } from "solid-js";
import { A } from "@solidjs/router";
import { getUserResults } from "../services/db";
import { currentUser } from "../App";

function formatDate(ts) {
  if (!ts) return "";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString("hr-HR", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function resultBadge(percentage) {
  if (percentage >= 80) return "badge-success";
  if (percentage >= 60) return "badge-info";
  if (percentage >= 40) return "badge-warning";
  return "badge-error";
}

export default function Results() {
  const [results] = createResource(
    () => currentUser()?.uid,
    getUserResults
  );

  const stats = () => {
    const r = results() ?? [];
    if (r.length === 0) return null;
    const avg = Math.round(r.reduce((sum, r) => sum + r.percentage, 0) / r.length);
    const best = Math.max(...r.map(r => r.percentage));
    const totalScore = r.reduce((sum, r) => sum + r.score, 0);
    return { avg, best, total: r.length, totalScore };
  };

  return (
    <div class="min-h-screen bg-base-200 p-6">
      <div class="max-w-4xl mx-auto">

        {/* Header */}
        <div class="flex items-center gap-4 mb-6">
          <A href="/" class="btn btn-ghost btn-sm">← Početna</A>
          <h1 class="text-3xl font-bold">Moji rezultati</h1>
        </div>

        <Show when={results.loading}>
          <div class="flex justify-center py-12">
            <span class="loading loading-spinner loading-lg text-primary" />
          </div>
        </Show>

        <Show when={results() && results().length === 0}>
          <div class="card bg-base-100 shadow">
            <div class="card-body text-center text-base-content/60">
              <p class="text-lg">Još nisi riješio nijedan kviz.</p>
              <A href="/" class="btn btn-primary btn-sm mx-auto mt-2">
                Idi na kvizove
              </A>
            </div>
          </div>
        </Show>

        <Show when={stats()}>
          {/* Statistika */}
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div class="card bg-base-100 shadow text-center">
              <div class="card-body py-4 px-2">
                <div class="text-3xl font-bold text-primary">{stats().total}</div>
                <div class="text-xs text-base-content/60">Riješenih kvizova</div>
              </div>
            </div>
            <div class="card bg-base-100 shadow text-center">
              <div class="card-body py-4 px-2">
                <div class="text-3xl font-bold text-success">{stats().avg}%</div>
                <div class="text-xs text-base-content/60">Prosječni rezultat</div>
              </div>
            </div>
            <div class="card bg-base-100 shadow text-center">
              <div class="card-body py-4 px-2">
                <div class="text-3xl font-bold text-warning">{stats().best}%</div>
                <div class="text-xs text-base-content/60">Najbolji rezultat</div>
              </div>
            </div>
            <div class="card bg-base-100 shadow text-center">
              <div class="card-body py-4 px-2">
                <div class="text-3xl font-bold">{stats().totalScore}</div>
                <div class="text-xs text-base-content/60">Ukupno bodova</div>
              </div>
            </div>
          </div>

          {/* Lista rezultata */}
          <h2 class="text-xl font-bold mb-4">Povijest</h2>
          <div class="flex flex-col gap-3">
            <For each={results()}>
              {(r) => (
                <div class="card bg-base-100 shadow hover:shadow-md transition-shadow">
                  <div class="card-body py-4">
                    <div class="flex justify-between items-center gap-4">
                      <div class="flex-1 min-w-0">
                        <h3 class="font-semibold truncate">{r.quizTitle}</h3>
                        <p class="text-xs text-base-content/50 mt-0.5">
                          {formatDate(r.completedAt)}
                        </p>
                      </div>
                      <div class="flex items-center gap-3 shrink-0">
                        <span class="text-sm text-base-content/60">
                          {r.score}/{r.maxScore} bod.
                        </span>
                        <span class={`badge ${resultBadge(r.percentage)} badge-sm`}>
                          {r.percentage}%
                        </span>
                      </div>
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