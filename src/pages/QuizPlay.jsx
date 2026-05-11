import { createSignal, createResource, Show, For } from "solid-js";
import { A, useNavigate, useParams } from "@solidjs/router";
import { getQuiz, getQuestions, saveResult } from "../services/db";
import { createResultSchema } from "../lib/schemas";
import { currentUser } from "../App";

export default function QuizPlay() {
  const params = useParams();
  const navigate = useNavigate();

  const [quiz] = createResource(() => params.id, getQuiz);
  const [questions] = createResource(() => params.id, getQuestions);

  const [current, setCurrent] = createSignal(0);
  const [selected, setSelected] = createSignal(null);
  const [answers, setAnswers] = createSignal([]);
  const [saving, setSaving] = createSignal(false);

  function handleNext() {
    if (selected() === null) return;

    const q = questions()[current()];
    const newAnswer = {
      questionId: q.id,
      selected: selected(),
      correct: q.correctIndex,
      points: selected() === q.correctIndex ? q.points : 0,
    };

    const updatedAnswers = [...answers(), newAnswer];
    setAnswers(updatedAnswers);

    if (current() + 1 < questions().length) {
      setCurrent(c => c + 1);
      setSelected(null);
    } else {
      handleFinish(updatedAnswers);
    }
  }

  async function handleFinish(finalAnswers) {
    setSaving(true);
    try {
      const score = finalAnswers.reduce((sum, a) => sum + a.points, 0);
      const maxScore = questions().reduce((sum, q) => sum + q.points, 0);
      const result = createResultSchema(currentUser().uid, params.id, score, maxScore, finalAnswers);
      result.quizTitle = quiz().title;
      const resultId = await saveResult(result);
      navigate(`/quiz/result/${resultId}`, { replace: true });
    } catch (e) {
      console.error(e);
      setSaving(false);
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
        <div class="navbar-end">
          <button
            class="text-red-400 hover:text-red-300 text-sm font-medium"
            onClick={() => {
              if (confirm("Sigurno želiš odustati? Napredak će biti izgubljen.")) navigate("/");
            }}
          >
            Odustani
          </button>
        </div>
      </div>

      <div class="max-w-2xl mx-auto px-6 py-8">

        <Show when={quiz.loading || questions.loading}>
          <div class="flex justify-center py-20">
            <span class="loading loading-spinner loading-lg text-primary" />
          </div>
        </Show>

        <Show when={quiz() && questions() && questions().length > 0}>
          <div class="mb-6">
            <h1 class="text-2xl font-bold text-gray-900">{quiz()?.title}</h1>
            <p class="text-gray-600 text-sm mt-1">{quiz()?.description}</p>
          </div>

          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4">
            <div class="flex justify-between text-sm text-gray-600 mb-2">
              <span class="font-medium">Pitanje {current() + 1} od {questions().length}</span>
              <span class="font-medium">{Math.round((current() / questions().length) * 100)}%</span>
            </div>
            <div class="w-full bg-gray-100 rounded-full h-2">
              <div
                class="bg-gray-900 h-2 rounded-full transition-all"
                style={{ width: `${(current() / questions().length) * 100}%` }}
              />
            </div>
          </div>

          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 class="text-lg font-bold text-gray-900 mb-6">
              {questions()[current()]?.text}
            </h2>

            <div class="flex flex-col gap-3 mb-6">
              <For each={questions()[current()]?.options}>
                {(opt, i) => (
                  <button
                    class={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                      selected() === i()
                        ? "border-gray-900 bg-gray-900 text-white"
                        : "border-gray-200 bg-white text-gray-800 hover:border-gray-400"
                    }`}
                    onClick={() => setSelected(i())}
                  >
                    <span class={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                      selected() === i()
                        ? "bg-white text-gray-900"
                        : "bg-gray-100 text-gray-600"
                    }`}>
                      {["A", "B", "C", "D"][i()]}
                    </span>
                    <span class="flex-1">{opt}</span>
                  </button>
                )}
              </For>
            </div>

            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-500">
                Bodovi: <span class="font-semibold text-gray-700">{questions()[current()]?.points}</span>
              </span>
              <button
                class="btn btn-neutral rounded-full px-6"
                disabled={selected() === null || saving()}
                onClick={handleNext}
              >
                <Show when={saving()}>
                  <span class="loading loading-spinner loading-sm" />
                </Show>
                {current() + 1 === questions().length ? "Završi kviz" : "Sljedeće →"}
              </button>
            </div>
          </div>
        </Show>

        <Show when={questions() && questions().length === 0}>
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 text-center py-12">
            <p class="text-gray-700">Ovaj kviz nema pitanja.</p>
            <button class="btn btn-neutral rounded-full px-6 mt-4" onClick={() => navigate("/")}>
              Natrag
            </button>
          </div>
        </Show>
      </div>
    </div>
  );
}