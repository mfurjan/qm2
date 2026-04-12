import { createSignal } from "solid-js";
import { useNavigate, A } from "@solidjs/router";
import { signUp, authErrorMessage } from "../services/auth";

export default function SignUp() {
  const navigate = useNavigate();
  const [displayName, setDisplayName]     = createSignal("");
  const [email, setEmail]                 = createSignal("");
  const [password, setPassword]           = createSignal("");
  const [confirmPass, setConfirmPass]     = createSignal("");
  const [error, setError]                 = createSignal("");
  const [loading, setLoading]             = createSignal(false);

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
    <div class="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div class="card w-full max-w-md bg-base-100 shadow-xl">
        <div class="card-body">
          <div class="text-center mb-6">
            <h1 class="text-3xl font-bold text-primary">QuizMaster</h1>
            <p class="text-base-content/60 mt-1">Kreirajte novi račun</p>
          </div>

          {error() && (
            <div class="alert alert-error text-sm py-2"><span>{error()}</span></div>
          )}

          <form onSubmit={handleSubmit} class="space-y-3">
            <div class="form-control">
              <label class="label"><span class="label-text">Ime i prezime</span></label>
              <input type="text" class="input input-bordered"
                value={displayName()} onInput={e => setDisplayName(e.target.value)} required />
            </div>
            <div class="form-control">
              <label class="label"><span class="label-text">E-mail</span></label>
              <input type="email" class="input input-bordered"
                value={email()} onInput={e => setEmail(e.target.value)} required />
            </div>
            <div class="form-control">
              <label class="label"><span class="label-text">Lozinka</span></label>
              <input type="password" placeholder="Najmanje 6 znakova" class="input input-bordered"
                value={password()} onInput={e => setPassword(e.target.value)} required />
            </div>
            <div class="form-control">
              <label class="label"><span class="label-text">Potvrda lozinke</span></label>
              <input type="password" placeholder="Ponovite lozinku" class="input input-bordered"
                value={confirmPass()} onInput={e => setConfirmPass(e.target.value)} required />
            </div>
            <button type="submit" class="btn btn-primary w-full mt-2" disabled={loading()}>
              {loading() ? <span class="loading loading-spinner loading-sm" /> : "Registriraj se"}
            </button>
          </form>

          <p class="text-center text-sm mt-4">
            Već imate račun?{" "}
            <A href="/signin" class="link link-primary">Prijavite se</A>
          </p>
        </div>
      </div>
    </div>
  );
}
