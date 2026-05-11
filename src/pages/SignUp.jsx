import { createSignal } from "solid-js";
import { useNavigate, A } from "@solidjs/router";
import { signUp, authErrorMessage } from "../services/auth";

export default function SignUp() {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = createSignal("");
  const [email, setEmail]             = createSignal("");
  const [password, setPassword]       = createSignal("");
  const [confirmPass, setConfirmPass] = createSignal("");
  const [error, setError]             = createSignal("");
  const [loading, setLoading]         = createSignal(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (password() !== confirmPass()) { setError("Lozinke se ne podudaraju."); return; }
    if (password().length < 6)        { setError("Lozinka mora imati najmanje 6 znakova."); return; }
    setLoading(true);
    try {
      await signUp(email(), password(), displayName());
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
          <p class="text-gray-600 mt-2">Kreirajte novi račun</p>
        </div>

        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          {error() && (
            <div class="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-xl mb-4">
              {error()}
            </div>
          )}

          <form onSubmit={handleSubmit} class="space-y-4">
            <div>
              <label class="text-sm font-medium text-gray-700 block mb-1">Ime i prezime</label>
              <input
                type="text"
                class="input input-bordered w-full"
                value={displayName()}
                onInput={e => setDisplayName(e.target.value)}
                required
              />
            </div>

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
              <label class="text-sm font-medium text-gray-700 block mb-1">Lozinka</label>
              <input
                type="password"
                placeholder="Najmanje 6 znakova"
                class="input input-bordered w-full"
                value={password()}
                onInput={e => setPassword(e.target.value)}
                required
              />
            </div>

            <div>
              <label class="text-sm font-medium text-gray-700 block mb-1">Potvrda lozinke</label>
              <input
                type="password"
                placeholder="Ponovite lozinku"
                class="input input-bordered w-full"
                value={confirmPass()}
                onInput={e => setConfirmPass(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              class="btn btn-neutral w-full rounded-full mt-2"
              disabled={loading()}
            >
              {loading() ? <span class="loading loading-spinner loading-sm" /> : "Registriraj se"}
            </button>
          </form>

          <p class="text-center text-sm text-gray-600 mt-6">
            Već imate račun?{" "}
            <A href="/signin" class="text-primary font-medium hover:underline">Prijavite se</A>
          </p>
        </div>

      </div>
    </div>
  );
}