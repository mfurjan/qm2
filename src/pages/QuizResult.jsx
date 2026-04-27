import { createResource, Show, For } from "solid-js";
import { A, useParams } from "@solidjs/router";
import { db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";

async function getResult(id) {
  const snap = await getDoc(doc(db, "results", id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

function resultMessage(percentage) {
  if (percentage === 100) return { text: "Savršeno! Bravo! 🏆", cls: "alert-success" };
  if (percentage >= 80)  return { text: "Odličan rezultat! 🎉", cls: "alert-success" };
  if (percentage >= 60)  return { text: "Dobar rezultat! 👍", cls: "alert-info" };
  if (percentage >= 40)  return { text: "Može bolje. Pokušaj ponovo! 💪", cls: "alert-warning" };
  return { text: "Nemoj odustati, vježbaj dalje! 📚", cls: "alert-error" };
}

export default function QuizResult() {
  const params = useParams();
  const [result] = createResource(() => getResult(params.id));

  return (
    <div class="min-h-screen bg-base-200 flex items-start justify-center p-6">
      <div class="w-full max-w-2xl">

        <Show when={result.loading}>
          <div class="flex justify-center py-20">
            <span class="loading loading-spinner loading-lg text-primary" />
          </div>
        </Show>

        <Show when={result()}>
          {/* Naslov */}
          <div class="text-center mb-8">
            <h1 class="text-3xl font-bold mb-1">Rezultati kviza</h1>
            <p class="text-base-content/60">{result()?.quizTitle}</p>
          </div>

          {/* Poruka */}
          {(() => {
            const msg = resultMessage(result()?.percentage ?? 0);
            return (
              <div class={`alert ${msg.cls} mb-6 justify-center text-center`}>
                <span class="text-lg font-semibold">{msg.text}</span>
              </div>
            );
          })()}

          {/* Statistike */}
          <div class="grid grid-cols-3 gap-4 mb-6">
            <div class="card bg-base-100 shadow text-center">
              <div class="card-body py-4 px-2">
                <div class="text-3xl font-bold text-primary">{result()?.percentage}%</div>
                <div class="text-xs text-base-content/60">Uspješnost</div>
              </div>
            </div>
            <div class="card bg-base-100 shadow text-center">
              <div class="card-body py-4 px-2">
                <div class="text-3xl font-bold">{result()?.score}</div>
                <div class="text-xs text-base-content/60">Bodova od {result()?.maxScore}</div>
              </div>
            </div>
            <div class="card bg-base-100 shadow text-center">
              <div class="card-body py-4 px-2">
                <div class="text-3xl font-bold">
                  {result()?.answers?.filter(a => a.selected === a.correct).length}
                </div>
                <div class="text-xs text-base-content/60">
                  Točnih od {result()?.answers?.length}
                </div>
              </div>
            </div>
          </div>

          {/* Pregled odgovora */}
          <div class="card bg-base-100 shadow mb-6">
            <div class="card-body">
              <h2 class="card-title text-base mb-4">Pregled odgovora</h2>
              <div class="flex flex-col gap-3">
                <For each={result()?.answers}>
                  {(a, i) => (
                    <div class={`flex items-center gap-3 p-3 rounded-lg ${
                      a.selected === a.correct ? "bg-success/10" : "bg-error/10"
                    }`}>
                      <span class={`text-xl ${a.selected === a.correct ? "text-success" : "text-error"}`}>
                        {a.selected === a.correct ? "✓" : "✗"}
                      </span>
                      <div class="flex-1 text-sm">
                        <span class="font-medium">Pitanje {i() + 1}</span>
                        <span class="text-base-content/60 ml-2">
                          {a.selected === a.correct
                            ? `+${a.points} bod${a.points === 1 ? "" : "a"}`
                            : "0 bodova"}
                        </span>
                      </div>
                    </div>
                  )}
                </For>
              </div>
            </div>
          </div>

          {/* Akcije */}
          <div class="flex gap-3 justify-center">
            <A href="/" class="btn btn-primary">Natrag na početnu</A>
            <A href="/results" class="btn btn-outline">Moji rezultati</A>
          </div>
        </Show>

      </div>
    </div>
  );
}