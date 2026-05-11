import { createSignal, Show, For, onMount } from "solid-js";
import { useNavigate, useParams } from "@solidjs/router";
import {
  createQuiz, updateQuiz, getQuiz,
  getQuestions, addQuestion, deleteQuestion,
} from "../../services/db";
import { createQuizSchema, createQuestionSchema } from "../../lib/schemas";
import { currentUser } from "../../App";

const CATEGORIES = [
  "Opće znanje", "Tehnologija", "Sport", "Povijest",
  "Geografija", "Zabava", "Glazba", "Jezici", "Znanost",
];

function emptyQuestion() {
  return { text: "", options: ["", "", "", ""], correctIndex: 0, points: 1 };
}

export default function QuizForm() {
  const params = useParams();
  const navigate = useNavigate();
  const isEdit = () => params.id !== "new";

  const [title, setTitle] = createSignal("");
  const [description, setDescription] = createSignal("");
  const [category, setCategory] = createSignal(CATEGORIES[0]);
  const [isPublished, setIsPublished] = createSignal(false);
  const [questions, setQuestions] = createSignal([emptyQuestion()]);
  const [savedQuestionIds, setSavedQuestionIds] = createSignal([]);
  const [saving, setSaving] = createSignal(false);
  const [error, setError] = createSignal("");
  const [success, setSuccess] = createSignal("");

  let titleRef, descRef;
  const questionRefs = [];

  function getQuestionRef(i) {
    if (!questionRefs[i]) questionRefs[i] = { textRef: null, optRefs: [null, null, null, null] };
    return questionRefs[i];
  }

  onMount(async () => {
    if (!isEdit()) return;
    try {
      const quiz = await getQuiz(params.id);
      if (!quiz) return navigate("/admin/quizzes");
      setTitle(quiz.title);
      setDescription(quiz.description);
      setCategory(quiz.category);
      setIsPublished(quiz.isPublished ?? false);
      const qs = await getQuestions(params.id);
      if (qs.length > 0) {
        setQuestions(qs.map(q => ({ text: q.text, options: [...q.options], correctIndex: q.correctIndex, points: q.points })));
        setSavedQuestionIds(qs.map(q => q.id));
      }
    } catch (e) {
      setError("Greška pri učitavanju kviza.");
    }
  });

  function addNewQuestion() {
    setQuestions(qs => [...qs, emptyQuestion()]);
  }

  function removeQuestion(index) {
    if (questions().length === 1) return;
    const current = readAllFromDOM();
    const next = current.filter((_, i) => i !== index);
    setQuestions(next);
    setSavedQuestionIds(ids => ids.filter((_, i) => i !== index));
    questionRefs.splice(index, 1);
  }

  function updateCorrectIndex(qIndex, value) {
    const current = readAllFromDOM();
    setQuestions(qs => qs.map((q, i) => {
      if (i !== qIndex) return current[i] ?? q;
      return { ...current[i], correctIndex: value };
    }));
  }

  function updatePoints(qIndex, value) {
    setQuestions(qs => qs.map((q, i) => i === qIndex ? { ...q, points: value } : q));
  }

  function readAllFromDOM() {
    return questions().map((q, i) => {
      const refs = questionRefs[i];
      if (!refs) return q;
      return {
        text: refs.textRef?.value ?? q.text,
        options: q.options.map((opt, oi) => refs.optRefs[oi]?.value ?? opt),
        correctIndex: q.correctIndex,
        points: q.points,
      };
    });
  }

  function validate(qs) {
    if (!titleRef?.value?.trim()) return "Naslov kviza je obavezan.";
    if (!descRef?.value?.trim()) return "Opis kviza je obavezan.";
    for (let i = 0; i < qs.length; i++) {
      const q = qs[i];
      if (!q.text.trim()) return `Pitanje ${i + 1}: tekst je obavezan.`;
      if (q.options.some(o => !o.trim())) return `Pitanje ${i + 1}: svi odgovori moraju biti popunjeni.`;
      if (q.points < 1) return `Pitanje ${i + 1}: bodovi moraju biti najmanje 1.`;
    }
    return null;
  }

  async function handleSave() {
    const currentQs = readAllFromDOM();
    const err = validate(currentQs);
    if (err) { setError(err); return; }
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const quizData = {
        ...createQuizSchema(titleRef.value.trim(), descRef.value.trim(), category(), currentUser()?.uid),
        isPublished: isPublished(),
      };
      let quizId = params.id;
      if (isEdit()) {
        await updateQuiz(quizId, quizData);
        for (const qId of savedQuestionIds()) await deleteQuestion(quizId, qId);
      } else {
        quizId = await createQuiz(quizData);
      }
      const newIds = [];
      for (let i = 0; i < currentQs.length; i++) {
        const q = currentQs[i];
        const id = await addQuestion(quizId, createQuestionSchema(q.text, q.options, q.correctIndex, q.points, i));
        newIds.push(id);
      }
      setSavedQuestionIds(newIds);
      setSuccess(isEdit() ? "Kviz uspješno ažuriran!" : "Kviz uspješno kreiran!");
      if (!isEdit()) setTimeout(() => navigate(`/admin/quiz/${quizId}`), 1000);
    } catch (e) {
      setError("Greška pri spremanju: " + e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div class="min-h-screen bg-gray-50 p-6">
      <div class="max-w-3xl mx-auto">

        {/* Header */}
        <div class="flex items-center gap-4 mb-8">
          <button
            class="text-sm text-gray-500 hover:text-gray-900 transition-colors"
            onClick={() => navigate("/admin/quizzes")}
          >
            ← Natrag
          </button>
          <h1 class="text-3xl font-extrabold text-gray-900">
            {isEdit() ? "Uredi kviz" : "Novi kviz"}
          </h1>
        </div>

        {/* Alerts */}
        <Show when={error()}>
          <div class="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-xl mb-4">
            {error()}
          </div>
        </Show>
        <Show when={success()}>
          <div class="bg-green-50 text-green-700 text-sm px-4 py-3 rounded-xl mb-4">
            {success()}
          </div>
        </Show>

        {/* Quiz info */}
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 mb-6">
          <h2 class="text-lg font-bold text-gray-900 mb-5">Osnovne informacije</h2>

          <div class="space-y-4">
            <div>
              <label class="text-sm font-medium text-gray-700 block mb-1">Naslov kviza *</label>
              <input
                ref={el => titleRef = el}
                type="text"
                class="input input-bordered w-full"
                placeholder="npr. Kviz iz geografije Europe"
                value={title()}
              />
            </div>

            <div>
              <label class="text-sm font-medium text-gray-700 block mb-1">Opis *</label>
              <textarea
                ref={el => descRef = el}
                class="textarea textarea-bordered w-full"
                rows="3"
                placeholder="Kratki opis kviza..."
                value={description()}
              />
            </div>

            <div class="flex gap-4 flex-wrap">
              <div class="flex-1 min-w-40">
                <label class="text-sm font-medium text-gray-700 block mb-1">Kategorija</label>
                <select
                  class="select select-bordered w-full"
                  value={category()}
                  onChange={e => setCategory(e.target.value)}
                >
                  <For each={CATEGORIES}>
                    {(cat) => <option value={cat}>{cat}</option>}
                  </For>
                </select>
              </div>

              <div>
                <label class="text-sm font-medium text-gray-700 block mb-1">Status</label>
                <label class="flex items-center gap-2 cursor-pointer mt-2">
                  <input
                    type="checkbox"
                    class="toggle toggle-success"
                    checked={isPublished()}
                    onChange={e => setIsPublished(e.target.checked)}
                  />
                  <span class="text-sm text-gray-700">
                    {isPublished() ? "Objavljeno" : "Skica"}
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Questions */}
        <div class="flex flex-col gap-4 mb-6">
          <h2 class="text-lg font-bold text-gray-900">
            Pitanja ({questions().length})
          </h2>

          <For each={questions()}>
            {(q, i) => {
              const refs = getQuestionRef(i());
              return (
                <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <div class="flex justify-between items-center mb-4">
                    <h3 class="font-semibold text-gray-700">Pitanje {i() + 1}</h3>
                    <button
                      class="text-sm text-red-500 hover:text-red-700 transition-colors disabled:opacity-30"
                      disabled={questions().length === 1}
                      onClick={() => removeQuestion(i())}
                    >
                      Ukloni
                    </button>
                  </div>

                  <div class="space-y-4">
                    <div>
                      <label class="text-sm font-medium text-gray-700 block mb-1">Tekst pitanja *</label>
                      <input
                        ref={el => refs.textRef = el}
                        type="text"
                        class="input input-bordered w-full"
                        placeholder="Upiši pitanje..."
                        value={q.text}
                      />
                    </div>

                    <div>
                      <label class="text-sm font-medium text-gray-700 block mb-2">Odgovori (označi točan) *</label>
                      <div class="flex flex-col gap-2">
                        <For each={q.options}>
                          {(opt, oi) => (
                            <label class="flex items-center gap-3 cursor-pointer">
                              <input
                                type="radio"
                                class="radio radio-success"
                                name={`correct-${i()}`}
                                checked={q.correctIndex === oi()}
                                onChange={() => updateCorrectIndex(i(), oi())}
                              />
                              <span class="text-xs font-semibold text-gray-500 border border-gray-200 rounded-lg w-7 h-7 flex items-center justify-center shrink-0">
                                {["A", "B", "C", "D"][oi()]}
                              </span>
                              <input
                                ref={el => refs.optRefs[oi()] = el}
                                type="text"
                                class="input input-bordered input-sm flex-1"
                                placeholder={`Odgovor ${["A", "B", "C", "D"][oi()]}...`}
                                value={opt}
                              />
                            </label>
                          )}
                        </For>
                      </div>
                    </div>

                    <div>
                      <label class="text-sm font-medium text-gray-700 block mb-1">Bodovi</label>
                      <input
                        type="number"
                        class="input input-bordered input-sm w-32"
                        min="1"
                        max="100"
                        value={q.points}
                        onChange={e => updatePoints(i(), Number(e.target.value))}
                      />
                    </div>
                  </div>
                </div>
              );
            }}
          </For>

          <button
            class="btn btn-neutral w-full rounded-full"
            onClick={addNewQuestion}
          >
            + Dodaj pitanje
          </button>
        </div>

        {/* Save */}
        <div class="flex justify-end gap-3 pb-8">
          <button
            class="btn btn-ghost rounded-full"
            onClick={() => navigate("/admin/quizzes")}
          >
            Odustani
          </button>
          <button
            class="btn btn-neutral rounded-full"
            disabled={saving()}
            onClick={handleSave}
          >
            <Show when={saving()} fallback={isEdit() ? "Spremi promjene" : "Kreiraj kviz"}>
              <span class="loading loading-spinner loading-sm" />
              Spremam...
            </Show>
          </button>
        </div>

      </div>
    </div>
  );
}