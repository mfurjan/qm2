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
    <div class="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div class="card w-full max-w-md bg-base-100 shadow-xl">
        <div class="card-body">
          <div class="text-center mb-6">
            <h1 class="text-2xl font-bold">Oporavak lozinke</h1>
        </div>

          <Show when={sent()} fallback={
            <>
              <Show when={error()}>
                <div class="alert alert-error text-sm py-2">
                  <span>{error()}</span>
                </div>
              </Show>

              <form onSubmit={handleSubmit} class="space-y-4">
                <div class="form-control">
                  <label class="label"><span class="label-text">E-mail</span></label>
                  <input
                    type="email"
                    class="input input-bordered"
                    value={email()}
                    onInput={e => setEmail(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" class="btn btn-primary w-full" disabled={loading()}>
                  {loading()
                    ? <span class="loading loading-spinner loading-sm" />
                    : "Pošalji link za oporavak"}
                </button>
              </form>

              <p class="text-center text-sm mt-4">
                <A href="/signin" class="link link-primary">Natrag na prijavu</A>
              </p>
            </>
          }>

            <div class="text-center space-y-4">
              <div class="alert alert-success text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>
                  Link za oporavak poslan je na <strong>{email()}</strong>.
                </span>
              </div>
              <A href="/signin" class="btn btn-primary w-full">Natrag na prijavu</A>
            </div>
          </Show>
        </div>
      </div>
    </div>
  );
}
