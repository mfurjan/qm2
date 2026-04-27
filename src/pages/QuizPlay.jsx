import { createSignal, createResource, Show, For } from "solid-js";
import { useNavigate, useParams } from "@solidjs/router";
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

      const result = createResultSchema(
        currentUser().uid,
        params.id,
        score,
        maxScore,
        finalAnswers
      );
      result.quizTitle = quiz().title;

      const resultId = await saveResult(result);
      navigate(`/quiz/result/${resultId}`, { replace: true });
    } catch (e) {
      console.error(e);
      setSaving(false);
    }
  }

  return (
    <div class="min-h-screen bg-base-200 flex items-start justify-center p-6">
      <div class="w-full max-w-2xl">

        <Show when={quiz.loading || questions.loading}>
          <div class="flex justify-center py-20">
            <span class="loading loading-spinner loading-lg text-primary" />
          </div>
        </Show>

        <Show when={quiz() && questions() && questions().length > 0}>
          {/* Header */}
          <div class="mb-6">
            <button class="btn btn-ghost btn-sm mb-2" onClick={() => navigate("/")}>
              ← Odustani
            </button>
            <h1 class="text-2xl font-bold">{quiz()?.title}</h1>
            <p class="text-base-content/60 text-sm">{quiz()?.description}</p>
          </div>

          {/* Progress */}
          <div class="mb-4">
            <div class="flex justify-between text-sm text-base-content/60 mb-1">
              <span>Pitanje {current() + 1} od {questions().length}</span>
              <span>{Math.round((current() / questions().length) * 100)}%</span>
            </div>
            <progress
              class="progress progress-primary w-full"
              value={current()}
              max={questions().length}
            />
          </div>

          {/* Pitanje */}
          <div class="card bg-base-100 shadow">
            <div class="card-body gap-4">
              <h2 class="text-lg font-semibold">
                {questions()[current()]?.text}
              </h2>

              <div class="flex flex-col gap-3">
                <For each={questions()[current()]?.options}>
                  {(opt, i) => (
                    <button
                      class={`btn btn-outline justify-start gap-3 text-left h-auto py-3 ${
                        selected() === i() ? "btn-primary" : ""
                      }`}
                      onClick={() => setSelected(i())}
                    >
                      <span class="badge badge-outline w-8 shrink-0">
                        {["A", "B", "C", "D"][i()]}
                      </span>
                      <span class="flex-1 whitespace-normal">{opt}</span>
                    </button>
                  )}
                </For>
              </div>

              <div class="flex justify-between items-center mt-2">
                <span class="text-sm text-base-content/50">
                  Bodovi: {questions()[current()]?.points}
                </span>
                <button
                  class="btn btn-primary"
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
          </div>
        </Show>

        <Show when={questions() && questions().length === 0}>
          <div class="card bg-base-100 shadow">
            <div class="card-body text-center">
              <p>Ovaj kviz nema pitanja.</p>
              <button class="btn btn-primary mt-4" onClick={() => navigate("/")}>
                Natrag
              </button>
            </div>
          </div>
        </Show>

      </div>
    </div>
  );
}