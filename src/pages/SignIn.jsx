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
    <div class="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div class="card w-full max-w-md bg-base-100 shadow-xl">
        <div class="card-body">
          <div class="text-center mb-6">
            <h1 class="text-3xl font-bold text-primary">QuizMaster</h1>
            <p class="text-base-content/60 mt-1">Prijavite se u račun</p>
          </div>

          {error() && (
            <div class="alert alert-error text-sm py-2">
              <span>{error()}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} class="space-y-4">
            <div class="form-control">
              <label class="label"><span class="label-text">E-mail</span></label>
              <input type="email" 
                class="input input-bordered" value={email()}
                onInput={e => setEmail(e.target.value)} required />
            </div>
            <div class="form-control">
              <label class="label">
                <span class="label-text">Lozinka</span>
                <A href="/reset-password" class="label-text-alt link link-primary text-xs">
                  Oporavak lozinke?
                </A>
              </label>
              <input type="password" 
                class="input input-bordered" value={password()}
                onInput={e => setPassword(e.target.value)} required />
            </div>
            <button type="submit" class="btn btn-primary w-full mt-2" disabled={loading()}>
              {loading() ? <span class="loading loading-spinner loading-sm" /> : "Prijava"}
            </button>
          </form>

          <p class="text-center text-sm mt-4">
            Nemate račun?{" "}
            <A href="/signup" class="link link-primary">Registrirajte se</A>
          </p>
        </div>
      </div>
    </div>
  );
}