import { createSignal, Show } from "solid-js";
import { A } from "@solidjs/router";
import { currentUser, userProfile, setUserProfile, isAdmin } from "../App";
import { updateDisplayName, changeEmail, changePassword, authErrorMessage } from "../services/auth";
import { updateUserProfile } from "../services/db";

export default function UserProfile() {
  const [tab, setTab] = createSignal("info");

  const [displayName, setDisplayName]   = createSignal(currentUser()?.displayName ?? "");
  const [infoMsg, setInfoMsg]           = createSignal({ type: "", text: "" });
  const [infoLoading, setInfoLoading]   = createSignal(false);

  async function handleUpdateInfo(e) {
    e.preventDefault();
    setInfoLoading(true);
    setInfoMsg({ type: "", text: "" });
    try {
      await updateDisplayName(displayName());
      await updateUserProfile(currentUser().uid, { displayName: displayName() });
      setUserProfile(p => ({ ...p, displayName: displayName() }));
      setInfoMsg({ type: "success", text: "Profil uspješno ažuriran!" });
    } catch {
      setInfoMsg({ type: "error", text: "Greška pri ažuriranju profila." });
    } finally {
      setInfoLoading(false);
    }
  }

  const [newEmail, setNewEmail]         = createSignal("");
  const [emailPass, setEmailPass]       = createSignal("");
  const [emailMsg, setEmailMsg]         = createSignal({ type: "", text: "" });
  const [emailLoading, setEmailLoading] = createSignal(false);

  async function handleChangeEmail(e) {
    e.preventDefault();
    setEmailLoading(true);
    setEmailMsg({ type: "", text: "" });
    try {
      await changeEmail(emailPass(), newEmail());
      await updateUserProfile(currentUser().uid, { email: newEmail() });
      setEmailMsg({ type: "success", text: "E-mail uspješno promijenjen!" });
      setNewEmail(""); setEmailPass("");
    } catch (err) {
      setEmailMsg({ type: "error", text: authErrorMessage(err.code) });
    } finally {
      setEmailLoading(false);
    }
  }

  const [currPass, setCurrPass]         = createSignal("");
  const [newPass, setNewPass]           = createSignal("");
  const [confirmPass, setConfirmPass]   = createSignal("");
  const [passMsg, setPassMsg]           = createSignal({ type: "", text: "" });
  const [passLoading, setPassLoading]   = createSignal(false);

  async function handleChangePassword(e) {
    e.preventDefault();
    if (newPass() !== confirmPass()) { setPassMsg({ type: "error", text: "Lozinke se ne podudaraju." }); return; }
    if (newPass().length < 6)        { setPassMsg({ type: "error", text: "Min. 6 znakova." }); return; }
    setPassLoading(true);
    setPassMsg({ type: "", text: "" });
    try {
      await changePassword(currPass(), newPass());
      setPassMsg({ type: "success", text: "Lozinka uspješno promijenjena!" });
      setCurrPass(""); setNewPass(""); setConfirmPass("");
    } catch (err) {
      setPassMsg({ type: "error", text: authErrorMessage(err.code) });
    } finally {
      setPassLoading(false);
    }
  }

  function MsgAlert(props) {
    return (
      <Show when={props.msg.text}>
        <div class={`alert text-sm py-2 ${props.msg.type === "success" ? "alert-success" : "alert-error"}`}>
          <span>{props.msg.text}</span>
        </div>
      </Show>
    );
  }

  return (
    <div class="min-h-screen bg-base-200">
      <div class="navbar bg-base-100 shadow px-4">
        <div class="navbar-start">
          <A href="/" class="text-xl font-bold text-primary"> QuizMaster</A>
        </div>
        <div class="navbar-end gap-2">
          <A href="/" class="btn btn-ghost btn-sm">Početna</A>
          <A href="/signout" class="btn btn-error btn-sm">Odjava</A>
        </div>
      </div>

      <div class="max-w-2xl mx-auto p-6">
        <h1 class="text-2xl font-bold mb-6">Moj profil</h1>

        <div class="card bg-base-100 shadow mb-6">
          <div class="card-body flex flex-row items-center gap-4 py-4">
            <div class="avatar placeholder">
              <div class="bg-primary text-primary-content rounded-full w-16">
                <span class="text-2xl font-bold">
                  {(userProfile()?.displayName || currentUser()?.email || "?")[0].toUpperCase()}
                </span>
              </div>
            </div>
            <div>
              <p class="font-bold text-lg">{userProfile()?.displayName || "—"}</p>
              <p class="text-base-content/60 text-sm">{currentUser()?.email}</p>
              <div class="badge badge-primary badge-sm mt-1">
                {isAdmin() ? "Administrator" : "Korisnik"}
              </div>
            </div>
          </div>
        </div>

        <div class="tabs tabs-boxed mb-6">
          <button class={`tab ${tab() === "info" ? "tab-active" : ""}`} onClick={() => setTab("info")}>
            Osobni podaci
          </button>
          <button class={`tab ${tab() === "email" ? "tab-active" : ""}`} onClick={() => setTab("email")}>
            E-mail
          </button>
          <button class={`tab ${tab() === "password" ? "tab-active" : ""}`} onClick={() => setTab("password")}>
            Lozinka
          </button>
        </div>

        <Show when={tab() === "info"}>
          <div class="card bg-base-100 shadow">
            <div class="card-body">
              <h2 class="card-title">Uredi profil</h2>
              <MsgAlert msg={infoMsg()} />
              <form onSubmit={handleUpdateInfo} class="space-y-4">
                <div class="form-control">
                  <label class="label"><span class="label-text">Ime i prezime</span></label>
                  <input type="text" class="input input-bordered"
                    value={displayName()} onInput={e => setDisplayName(e.target.value)} required />
                </div>
                <div class="form-control">
                  <label class="label"><span class="label-text">Uloga</span></label>
                  <input type="text" class="input input-bordered input-disabled"
                    value={isAdmin() ? "Administrator" : "Korisnik"} disabled />
                  <label class="label">
                    <span class="label-text-alt text-base-content/40">Samo administrator može mijenjati uloge.</span>
                  </label>
                </div>
                <button type="submit" class="btn btn-primary" disabled={infoLoading()}>
                  {infoLoading() ? <span class="loading loading-spinner loading-sm" /> : "Spremi promjene"}
                </button>
              </form>
            </div>
          </div>
        </Show>

        <Show when={tab() === "email"}>
          <div class="card bg-base-100 shadow">
            <div class="card-body">
              <h2 class="card-title">Promjena e-maila</h2>
              <MsgAlert msg={emailMsg()} />
              <form onSubmit={handleChangeEmail} class="space-y-4">
                <div class="form-control">
                  <label class="label"><span class="label-text">Nova e-mail adresa</span></label>
                  <input type="email" class="input input-bordered"
                    value={newEmail()} onInput={e => setNewEmail(e.target.value)} required />
                </div>
                <div class="form-control">
                  <label class="label"><span class="label-text">Potvrdi lozinkom</span></label>
                  <input type="password" class="input input-bordered"
                    value={emailPass()} onInput={e => setEmailPass(e.target.value)} required />
                </div>
                <button type="submit" class="btn btn-primary" disabled={emailLoading()}>
                  {emailLoading() ? <span class="loading loading-spinner loading-sm" /> : "Promijeni e-mail"}
                </button>
              </form>
            </div>
          </div>
        </Show>

        {/* Tab: Lozinka */}
        <Show when={tab() === "password"}>
          <div class="card bg-base-100 shadow">
            <div class="card-body">
              <h2 class="card-title">Promjena lozinke</h2>
              <MsgAlert msg={passMsg()} />
              <form onSubmit={handleChangePassword} class="space-y-4">
                <div class="form-control">
                  <label class="label"><span class="label-text">Trenutna lozinka</span></label>
                  <input type="password" class="input input-bordered"
                    value={currPass()} onInput={e => setCurrPass(e.target.value)} required />
                </div>
                <div class="form-control">
                  <label class="label"><span class="label-text">Nova lozinka</span></label>
                  <input type="password" class="input input-bordered"
                    value={newPass()} onInput={e => setNewPass(e.target.value)} required />
                </div>
                <div class="form-control">
                  <label class="label"><span class="label-text">Potvrda nove lozinke</span></label>
                  <input type="password" class="input input-bordered"
                    value={confirmPass()} onInput={e => setConfirmPass(e.target.value)} required />
                </div>
                <button type="submit" class="btn btn-primary" disabled={passLoading()}>
                  {passLoading() ? <span class="loading loading-spinner loading-sm" /> : "Promijeni lozinku"}
                </button>
              </form>
            </div>
          </div>
        </Show>
      </div>
    </div>
  );
}
