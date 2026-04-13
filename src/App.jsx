import { Router, Route } from "@solidjs/router";
import { lazy, Suspense, Show, createSignal } from "solid-js";
import { observeAuth } from "./services/auth";
import { getUserProfile } from "./services/db";

export const [currentUser, setCurrentUser] = createSignal(null);
export const [userProfile, setUserProfile] = createSignal(null);
export const [authReady, setAuthReady]     = createSignal(false);

export const isAdmin  = () => userProfile()?.role === "admin";
export const isLogged = () => !!currentUser();

observeAuth(async (user) => {
  if (user) {
    setCurrentUser(user);
    try {
      const profile = await getUserProfile(user.uid);
      setUserProfile(profile);
    } catch {
      setUserProfile(null);
    }
  } else {
    setCurrentUser(null);
    setUserProfile(null);
  }
  setAuthReady(true);
});

const Home          = lazy(() => import("./pages/Home"));
const SignIn        = lazy(() => import("./pages/SignIn"));
const SignUp        = lazy(() => import("./pages/SignUp"));
const SignOut       = lazy(() => import("./pages/SignOut"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const UserProfile   = lazy(() => import("./pages/UserProfile"));
const ErrorPage     = lazy(() => import("./pages/Error"));

function Loader() {
  return (
    <div class="min-h-screen flex items-center justify-center">
      <span class="loading loading-spinner loading-lg text-primary" />
    </div>
  );
}

function Guard(props) {
  return (
    <Show when={authReady()} fallback={<Loader />}>
      <Show when={isLogged()} fallback={<SignIn />}>
        <Show when={!props.adminOnly || isAdmin()} fallback={<ErrorPage code={403} />}>
          {props.children}
        </Show>
      </Show>
    </Show>
  );
}

export default function App() {
  return (
    <Router>
      <Suspense fallback={<Loader />}>
        <Route path="/signin"         component={SignIn} />
        <Route path="/signup"         component={SignUp} />
        <Route path="/reset-password" component={ResetPassword} />
        <Route path="/signout" component={() => <Guard><SignOut /></Guard>} />
        <Route path="/profile" component={() => <Guard><UserProfile /></Guard>} />
        <Route path="/"        component={() => <Guard><Home /></Guard>} />
        <Route path="*" component={() => <ErrorPage code={404} />} />
      </Suspense>
    </Router>
  );
}