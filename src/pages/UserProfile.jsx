import { createSignal, Show } from "solid-js";
import { A } from "@solidjs/router";
import { currentUser, userProfile, setUserProfile, isAdmin } from "../App";
import { updateDisplayName, changeEmail, changePassword, authErrorMessage } from "../services/auth";
import { updateUserProfile } from "../services/db";

export default function UserProfile() {
  const [tab, setTab] = createSignal("info");

  const [displayName, setDisplayName] = createSignal(currentUser()?.displayName ?? "");
  const [infoMsg, setInfoMsg]         = createSignal({ type: "", text: "" });
  const [infoLoading, setInfoLoading] = createSignal(false);

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

  const [currPass, setCurrPass]       = createSignal("");
  const [newPass, setNewPass]         = createSignal("");
  const [confirmPass, setConfirmPass] = createSignal("");
  const [passMsg, setPassMsg]         = createSignal({ type: "", text: "" });
  const [passLoading, setPassLoading] = createSignal(false);

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
        <div class={`text-sm px-4 py-3 rounded-xl mb-4 ${
          props.msg.type === "success"
            ? "bg-green-50 text-green-700"
            : "bg-red-50 text-red-700"
        }`}>
          {props.msg.text}
        </div>
      </Show>
    );
  }

  return (
    <div class="min-h-screen bg-gray-50">
      {/* Navbar */}
      <div class="navbar bg-gray-900 px-6">
        <div class="navbar-start">
          <A href="/" class="text-xl font-bold text-white">
            Quiz <span class="text-primary">Master</span>
          </A>
        </div>
        <div class="navbar-center hidden md:flex">
          <ul class="menu menu-horizontal gap-1">
            <li><A href="/" class="text-gray-300 hover:text-white font-medium">Početna</A></li>
            <li><A href="/results" class="text-gray-300 hover:text-white font-medium">Moji rezultati</A></li>
            <Show when={isAdmin()}>
              <li><A href="/admin/quizzes" class="text-gray-300 hover:text-white font-medium">Admin panel</A></li>
            </Show>
          </ul>
        </div>
        <div class="navbar-end gap-4">
          <A href="/signout" class="text-red-400 hover:text-red-300 text-sm font-medium">Odjava</A>
        </div>
      </div>

      <div class="max-w-2xl mx-auto px-6 py-8">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900">Moj profil</h1>
          <p class="text-gray-700 mt-1">Upravljaj svojim podacima.</p>
        </div>

        {/* Avatar kartica */}
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6 flex items-center gap-4">
          <div class="bg-gray-900 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold shrink-0">
            {(userProfile()?.displayName || currentUser()?.email || "?")[0].toUpperCase()}
          </div>
          <div>
            <p class="font-bold text-lg text-gray-900">{userProfile()?.displayName || "—"}</p>
            <p class="text-gray-600 text-sm">{currentUser()?.email}</p>
            <span class={`text-xs font-medium px-2 py-0.5 rounded-full mt-1 inline-block ${
              isAdmin() ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-700"
            }`}>
              {isAdmin() ? "Administrator" : "Korisnik"}
            </span>
          </div>
        </div>

        {/* Tabovi */}
        <div class="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6">
          {["info", "email", "password"].map(t => (
            <button
              class={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                tab() === t
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              onClick={() => setTab(t)}
            >
              {t === "info" ? "Osobni podaci" : t === "email" ? "E-mail" : "Lozinka"}
            </button>
          ))}
        </div>

        {/* Tab: Info */}
        <Show when={tab() === "info"}>
          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 class="font-bold text-gray-900 mb-4">Uredi profil</h2>
            <MsgAlert msg={infoMsg()} />
            <form onSubmit={handleUpdateInfo} class="space-y-4">
              <div>
                <label class="text-sm font-medium text-gray-700 block mb-1">Ime i prezime</label>
                <input type="text" class="input input-bordered w-full"
                  value={displayName()} onInput={e => setDisplayName(e.target.value)} required />
              </div>
              <div>
                <label class="text-sm font-medium text-gray-700 block mb-1">Uloga</label>
                <input type="text" class="input input-bordered w-full bg-gray-50"
                  value={isAdmin() ? "Administrator" : "Korisnik"} disabled />
                <p class="text-xs text-gray-500 mt-1">Samo administrator može mijenjati uloge.</p>
              </div>
              <button type="submit" class="btn btn-neutral rounded-full px-6" disabled={infoLoading()}>
                {infoLoading() ? <span class="loading loading-spinner loading-sm" /> : "Spremi promjene"}
              </button>
            </form>
          </div>
        </Show>

        {/* Tab: Email */}
        <Show when={tab() === "email"}>
          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 class="font-bold text-gray-900 mb-4">Promjena e-maila</h2>
            <MsgAlert msg={emailMsg()} />
            <form onSubmit={handleChangeEmail} class="space-y-4">
              <div>
                <label class="text-sm font-medium text-gray-700 block mb-1">Nova e-mail adresa</label>
                <input type="email" class="input input-bordered w-full"
                  value={newEmail()} onInput={e => setNewEmail(e.target.value)} required />
              </div>
              <div>
                <label class="text-sm font-medium text-gray-700 block mb-1">Potvrdi lozinkom</label>
                <input type="password" class="input input-bordered w-full"
                  value={emailPass()} onInput={e => setEmailPass(e.target.value)} required />
              </div>
              <button type="submit" class="btn btn-neutral rounded-full px-6" disabled={emailLoading()}>
                {emailLoading() ? <span class="loading loading-spinner loading-sm" /> : "Promijeni e-mail"}
              </button>
            </form>
          </div>
        </Show>

        {/* Tab: Lozinka */}
        <Show when={tab() === "password"}>
          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 class="font-bold text-gray-900 mb-4">Promjena lozinke</h2>
            <MsgAlert msg={passMsg()} />
            <form onSubmit={handleChangePassword} class="space-y-4">
              <div>
                <label class="text-sm font-medium text-gray-700 block mb-1">Trenutna lozinka</label>
                <input type="password" class="input input-bordered w-full"
                  value={currPass()} onInput={e => setCurrPass(e.target.value)} required />
              </div>
              <div>
                <label class="text-sm font-medium text-gray-700 block mb-1">Nova lozinka</label>
                <input type="password" class="input input-bordered w-full"
                  value={newPass()} onInput={e => setNewPass(e.target.value)} required />
              </div>
              <div>
                <label class="text-sm font-medium text-gray-700 block mb-1">Potvrda nove lozinke</label>
                <input type="password" class="input input-bordered w-full"
                  value={confirmPass()} onInput={e => setConfirmPass(e.target.value)} required />
              </div>
              <button type="submit" class="btn btn-neutral rounded-full px-6" disabled={passLoading()}>
                {passLoading() ? <span class="loading loading-spinner loading-sm" /> : "Promijeni lozinku"}
              </button>
            </form>
          </div>
        </Show>
      </div>
    </div>
  );
}