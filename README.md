# QuizMaster — Faza 2

## Pokretanje

```bash
npm install
npm run dev
```

## Firebase postavljanje

1. Idi na [Firebase Console](https://console.firebase.google.com) → novi projekt
2. **Authentication** → Sign-in method → uključi **Email/Password**
3. **Firestore Database** → Create database → Start in test mode
4. Project Settings → Your apps → Web app → kopiraj config
5. Popuni `.env` datoteku:

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

## Kreiranje admin korisnika

Nakon registracije, u **Firestore Console** pronađi:
`users/{uid}` → promijeni polje `role` na `"admin"`

## Struktura projekta

```
src/
├── lib/
│   ├── firebase.js      # Firebase inicijalizacija (čita iz .env)
│   └── schemas.js       # Struktura Firestore dokumenata
├── pages/
│   ├── Error.jsx        # 404 / 403 / 500 stranica
│   ├── Home.jsx         # Dashboard (zaštićena)
│   ├── ResetPassword.jsx
│   ├── SignIn.jsx
│   ├── SignOut.jsx
│   ├── SignUp.jsx
│   └── UserProfile.jsx  # Uredi ime, e-mail, lozinku
├── services/
│   ├── auth.js          # signUp, signIn, logOut, resetPassword, changeEmail/Password
│   └── db.js            # Firestore CRUD za korisnike, kvizove, rezultate
├── App.jsx              # Routing + globalno auth stanje
└── index.jsx            # Entry point
```
