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
            <li><A href="/results" class="text-gray-300 hover:text-white font-medium">Moji rezultati</A></li>
            <li><A href="/admin/quizzes" class="text-white font-medium">Admin panel</A></li>
          </ul>
        </div>
        <div class="navbar-end gap-4">
          <A href="/signout" class="text-red-400 hover:text-red-300 text-sm font-medium">Odjava</A>
        </div>
      </div>

      <div class="max-w-4xl mx-auto px-6 py-8">
        <div class="flex justify-between items-center mb-8">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Upravljanje kvizovima</h1>
            <p class="text-gray-700 mt-1">Kreiraj, uredi ili obriši kvizove.</p>
          </div>
          <A href="/admin/quiz/new" class="btn btn-neutral rounded-full px-6">+ Novi kviz</A>
        </div>

        <Show when={quizzes.loading}>
          <div class="flex justify-center py-12">
            <span class="loading loading-spinner loading-lg text-primary" />
          </div>
        </Show>

        <Show when={quizzes() && quizzes().length === 0}>
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 text-center py-12">
            <div class="text-5xl mb-3">📝</div>
            <p class="font-semibold text-gray-700">Nema kvizova. Kreiraj prvi!</p>
            <A href="/admin/quiz/new" class="btn btn-neutral btn-sm rounded-full px-6 mt-4">
              Kreiraj kviz
            </A>
          </div>
        </Show>

        <div class="flex flex-col gap-3">
          <For each={quizzes()}>
            {(quiz) => (
              <div class="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-4">
                <div class="flex justify-between items-center gap-4">
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 flex-wrap">
                      <h2 class="font-bold text-gray-900">{quiz.title}</h2>
                      <span class="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                        {quiz.category}
                      </span>
                      <Show
                        when={quiz.isPublished}
                        fallback={
                          <span class="text-xs font-medium px-2 py-0.5 rounded-full bg-yellow-50 text-yellow-700">
                            Skica
                          </span>
                        }
                      >
                        <span class="text-xs font-medium px-2 py-0.5 rounded-full bg-green-50 text-green-700">
                          Objavljeno
                        </span>
                      </Show>
                    </div>
                    <p class="text-sm text-gray-600 mt-1 truncate">{quiz.description}</p>
                  </div>
                  <div class="flex gap-2 shrink-0">
                    <button
                      class="btn btn-sm btn-outline rounded-full px-4"
                      onClick={() => navigate(`/admin/quiz/${quiz.id}`)}
                    >
                      Uredi
                    </button>
                    <button
                      class="btn btn-sm rounded-full px-4 bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
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
            )}
          </For>
        </div>
      </div>
    </div>
  );
}