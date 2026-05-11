import { createSignal } from "solid-js";
import { useNavigate, A } from "@solidjs/router";
import { signIn, authErrorMessage } from "../services/auth";

export default function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail]       = createSignal("");
  const [password, setPassword] = createSignal("");
  const [error, setError]       = createSignal("");
  const [loading, setLoading]   = createSignal(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signIn(email(), password());
      await new Promise(resolve => setTimeout(resolve, 500));
      navigate("/");
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
          <p class="text-gray-600 mt-2">Prijavite se u račun</p>
        </div>

        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          {error() && (
            <div class="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-xl mb-4">
              {error()}
            </div>
          )}

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
            <div>
              <div class="flex justify-between items-center mb-1">
                <label class="text-sm font-medium text-gray-700">Lozinka</label>
                <A href="/reset-password" class="text-xs text-primary hover:underline">
                  Oporavak lozinke?
                </A>
              </div>
              <input
                type="password"
                class="input input-bordered w-full"
                value={password()}
                onInput={e => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" class="btn btn-neutral w-full rounded-full mt-2" disabled={loading()}>
              {loading() ? <span class="loading loading-spinner loading-sm" /> : "Prijava"}
            </button>
          </form>

          <p class="text-center text-sm text-gray-600 mt-6">
            Nemate račun?{" "}
            <A href="/signup" class="text-primary font-medium hover:underline">Registrirajte se</A>
          </p>
        </div>
      </div>
    </div>
  );
}