import { createSignal, Show } from "solid-js";
import { A } from "@solidjs/router";
import { resetPassword, authErrorMessage } from "../services/auth";

export default function ResetPassword() {
  const [email, setEmail]     = createSignal("");
  const [error, setError]     = createSignal("");
  const [sent, setSent]       = createSignal(false);
  const [loading, setLoading] = createSignal(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await resetPassword(email());
      setSent(true);
    } catch (err) {
      setError(authErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div class="w-full max-w-md">

        {/* Logo */}
        <div class="text-center mb-8">
          <h1 class="text-4xl font-extrabold text-gray-900">
            Quiz<span class="text-primary">Master</span>
          </h1>
          <p class="text-gray-600 mt-2">Oporavak lozinke</p>
        </div>

        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <Show when={sent()} fallback={
            <>
              <Show when={error()}>
                <div class="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-xl mb-4">
                  {error()}
                </div>
              </Show>

              <p class="text-sm text-gray-600 mb-6">
                Unesite svoju e-mail adresu i poslat ćemo vam link za oporavak lozinke.
              </p>

              <form onSubmit={handleSubmit} class="space-y-4">
                <div>
                  <label class="text-sm font-medium text-gray-700 block mb-1">E-mail</label>
                  <input
                    type="email"
                    class="input input-bordered w-full"
                    value={email()}
                    onInput={e => setEmail(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  class="btn btn-neutral w-full rounded-full mt-2"
                  disabled={loading()}
                >
                  {loading()
                    ? <span class="loading loading-spinner loading-sm" />
                    : "Pošalji link za oporavak"}
                </button>
              </form>

              <p class="text-center text-sm text-gray-600 mt-6">
                <A href="/signin" class="text-primary font-medium hover:underline">
                  ← Natrag na prijavu
                </A>
              </p>
            </>
          }>
            {/* Uspješno poslano */}
            <div class="text-center space-y-4">
              <div class="text-5xl mb-2">📧</div>
              <div class="bg-green-50 text-green-700 text-sm px-4 py-3 rounded-xl">
                Link za oporavak poslan je na <strong>{email()}</strong>.
              </div>
              <p class="text-sm text-gray-600">
                Provjerite svoju e-mail adresu i kliknite na link za oporavak.
              </p>
              <A href="/signin" class="btn btn-neutral w-full rounded-full">
                Natrag na prijavu
              </A>
            </div>
          </Show>
        </div>
      </div>
    </div>
  );
}