import { createSignal, createResource, Show, For } from "solid-js";
import { A, useNavigate } from "@solidjs/router";
import { getAllQuizzes, deleteQuiz } from "../../services/db";

export default function QuizList() {
  const navigate = useNavigate();
  const [quizzes, { refetch }] = createResource(getAllQuizzes);
  const [deletingId, setDeletingId] = createSignal(null);

  async function handleDelete(id) {
    if (!confirm("Sigurno želiš obrisati ovaj kviz?")) return;
    setDeletingId(id);
    try {
      await deleteQuiz(id);
      refetch();
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div class="min-h-screen bg-base-200 p-6">
      <div class="max-w-4xl mx-auto">
        <div class="flex justify-between items-center mb-6">
          <div class="flex items-center gap-3">
            <A href="/" class="btn btn-ghost btn-sm">← Početna</A>
            <h1 class="text-3xl font-bold">Upravljanje kvizovima</h1>
          </div>
          <A href="/admin/quiz/new" class="btn btn-primary">+ Novi kviz</A>
        </div>

        <Show when={quizzes.loading}>
          <div class="flex justify-center py-12">
            <span class="loading loading-spinner loading-lg text-primary" />
          </div>
        </Show>

        <Show when={quizzes.error}>
          <div class="alert alert-error">Greška pri učitavanju kvizova.</div>
        </Show>

        <Show when={quizzes() && quizzes().length === 0}>
          <div class="card bg-base-100 shadow">
            <div class="card-body text-center text-base-content/60">
              <p class="text-lg">Nema kvizova. Kreiraj prvi kviz!</p>
              <A href="/admin/quiz/new" class="btn btn-primary btn-sm mx-auto mt-2">
                Kreiraj kviz
              </A>
            </div>
          </div>
        </Show>

        <div class="flex flex-col gap-4">
          <For each={quizzes()}>
            {(quiz) => (
              <div class="card bg-base-100 shadow hover:shadow-md transition-shadow">
                <div class="card-body">
                  <div class="flex justify-between items-start gap-4">
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-2 flex-wrap">
                        <h2 class="card-title text-lg">{quiz.title}</h2>
                        <span class="badge badge-outline badge-sm">{quiz.category}</span>
                        <Show
                          when={quiz.isPublished}
                          fallback={<span class="badge badge-warning badge-sm">Skica</span>}
                        >
                          <span class="badge badge-success badge-sm">Objavljeno</span>
                        </Show>
                      </div>
                      <p class="text-sm text-base-content/60 mt-1 truncate">{quiz.description}</p>
                    </div>
                    <div class="flex gap-2 shrink-0">
                      <button
                        class="btn btn-sm btn-outline"
                        onClick={() => navigate(`/admin/quiz/${quiz.id}`)}
                      >
                        Uredi
                      </button>
                      <button
                        class="btn btn-sm btn-error btn-outline"
                        disabled={deletingId() === quiz.id}
                        onClick={() => handleDelete(quiz.id)}
                      >
                        <Show when={deletingId() === quiz.id} fallback="Obriši">
                          <span class="loading loading-spinner loading-xs" />
                        </Show>
                      </button>
                    </div>
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