import { Show } from "solid-js";
import { A } from "@solidjs/router";
import { currentUser, userProfile, isAdmin } from "../App";

export default function Home() {
  return (
    <div class="min-h-screen bg-base-200">
      <div class="navbar bg-base-100 shadow px-4">
        <div class="navbar-start">
          <A href="/" class="text-xl font-bold text-primary"> QuizMaster</A>
        </div>
        <div class="navbar-center hidden md:flex">
          <ul class="menu menu-horizontal px-1">
            <li><A href="/">Početna</A></li>
            <li><A href="/quizzes">Kvizovi</A></li>
            <li><A href="/results">Rezultati</A></li>
          </ul>
        </div>
        <div class="navbar-end gap-2">
          <Show when={isAdmin()}>
            <div class="badge badge-warning hidden sm:flex"> Admin</div>
          </Show>
          <div class="dropdown dropdown-end">
            <div tabIndex={0} role="button" class="btn btn-ghost btn-circle avatar placeholder">
              <div class="bg-primary text-primary-content rounded-full w-10">
                <span class="text-sm font-bold">
                  {(userProfile()?.displayName || currentUser()?.email || "?")[0].toUpperCase()}
                </span>
              </div>
            </div>
            <ul tabIndex={0} class="mt-3 z-10 p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-48 border border-base-200">
              <li class="px-2 py-1 pointer-events-none">
                <span class="font-semibold text-sm">{userProfile()?.displayName}</span>
              </li>
              <div class="divider my-0" />
              <li><A href="/profile"> Moj profil</A></li>
              <Show when={isAdmin()}>
                <li><A href="/admin/quizzes"> Admin panel </A></li>
              </Show>
              <div class="divider my-0" />
              <li><A href="/signout" class="text-error"> Odjava</A></li>
            </ul>
          </div>
        </div>
      </div>

      <div class="max-w-4xl mx-auto p-6">
        <div class="mb-8">
          <h1 class="text-3xl font-bold">
            Dobrodošli, {userProfile()?.displayName || currentUser()?.email}! 
          </h1>
        </div>

        <Show when={isAdmin()}>
          <div class="alert alert-warning mb-6 text-sm">
            <span> Prijavljeni ste kao administrator — imate pristup upravljanju kvizovima.</span>
          </div>
        </Show>
      
      </div>
    </div>
  );
}
