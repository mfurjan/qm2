# Opis aplikacije
 
QuizMaster je web aplikacija namijenjena izradi, uređivanju i rješavanju kvizova. Aplikacija pruža jednostavno, pregledno i prilagodljivo rješenje za sve koji žele kreirati interaktivne kvizove ili ih rješavati. Sustav je osmišljen s podjelom uloga: administrator upravlja sadržajem, a korisnici taj sadržaj dobivaju kroz rješavanje kvizova. Cilj aplikacije je omogućiti brzo kreiranje kvizova s višestrukim izborom odgovora, automatsko bodovanje i prikaz rezultata. Sve u jednostavnom sučelju bez nepotrebnih komplikacija. Mnogi postojeći alati za izradu kvizova su: prekomplicirani — imaju previše opcija i zahtijevaju dugo učenje, ograničeni — ne dopuštaju prilagodbu bodovnih vrijednosti ili sadržaja, skupi — napredne funkcije se trebaju plaćati, ovisni o internetu — ne nude mogućnost self-hostinga. QuizMaster riješava sve navedene probleme nudeći open-source rješenje koje je dovoljno jednostavno za brzu upotrebu, a dovoljno fleksibilno za raznolike potrebe. QuizMaster je namijenjen širokoj publici odnosno svima koji žele kreirati ili rješavati kvizove, bez obzira na dob, zanimanje ili razinu tehničkog znanja. Aplikacija nema ograničenja ni na jednu skupinu korisnika.
 
## Konkretni primjeri korištenja:
 
- Učenik priprema kviz iz geografije i dijeli ga s razredom kao ponavljanje za ispit
- Grupa prijatelja organizira kviz večer s pitanjima iz sporta i zabave
- Zaposlenik u tvrtki kreira kviz za edukaciju kolega
- Znatiželjni korisnik jednostavno želi ispitati vlastito znanje iz omiljene teme
- Organizator društvenog događaja priprema zabavni kviz za sudionike

Kvizovi su jedan od najučinkovitijih alata. Istraživanja pokazuju da aktivno prisjećanje gradiva značajno poboljšava dugoročno pamćenje, čak i u usporedbi s ponovljenim čitanjem. Ali, većina učenika nema pristup lakim alatima koji bi im omogućili da sami kreiraju materijale za učenje. Odabirom ove teme nastoji se stvoriti alat koji je dovoljno jednostavan da ga bilo tko može koristiti bez ikakvog učenja o alatu, a dovoljno moćan da pruži stvarnu vrijednost bilo u kontekstu učenja, poslovne edukacije, zabave i slično. Uz to, razvoj ovakve aplikacije pokriva cjeloviti razvoj aplikacije: dizajn korisničkog sučelja, upravljanje korisnicima, operacije s bazom podataka te logika bodovanja što čini ovaj projekt izvrsnom prilikama za demonstraciju raznovrsnih tehničkih kompetencija. Upravo kombinacija jednostavnosti za krajnjeg korisnika i tehničke složenosti u pozadini čini QuizMaster zanimljivim i relevantnim projektom.
 
### Aplikacija se sastoji od:
 
Frontend: HTML, CSS, JavaScript - prilagodljivo sučelje koje je prilagođeno stolnim računalima Backend: Node.js Baza podataka: Firebase - relacijska baza s tablicama za korisnike, kvizove, pitanja, odgovore i rezultate Autentifikacija: Sustav prijave s razdvojenim ulogama (admin / korisnik)
 
### Sadržajni opseg kvizova Aplikacija nije ograničena na jednu temu. Kvizovi mogu biti iz područja:
 
- Općeg znanja
- Tehnologije i informatike
- Sporta i rekreacije
- Povijesti i geografije
- Zabave, filmova i glazbe
- Stranih jezika
- Prirodnih i društvenih znanosti

Svaki kviz sastoji se od: naslova, opisa, jednog ili više pitanja, ponuđenih odgovora (višestruki izbor), označenog točnog odgovora i bodovne vrijednosti po pitanju. Sustav automatski izračunava ukupni rezultat, prikazuje postotak uspješnosti i pohranjuje rezultat u bazu podataka: naslov, opis, jedno ili više pitanja, ponuđeni odgovori (višestruki izbor), označen točan odgovor i bodovna vrijednosti po pitanju. Sustav automatski izračunava ukupni rezultat, prikazuje postotak uspješnosti i pohranjuje rezultat u bazu podataka.
 
## Osnovne funkcionalnosti
 
| Funkcionalnost | Opis | Status |
|---|---|---|
| Registracija i prijava korisnika | Korisnik može kreirati račun i prijaviti se | ✅ Riješeno |
| Prijava administratora | Administrator se prijavljuje posebnim računom s proširenim ovlastima | ✅ Riješeno |
| Kreiranje kviza | Administrator kreira kviz s naslovom i opisom | ✅ Riješeno |
| Dodavanje pitanja | Administrator dodaje pitanja s ponuđenim odgovorima | ✅ Riješeno |
| Označavanje točnog odgovora | Administrator označava koji je odgovor točan | ✅ Riješeno |
| Prikaz popisa kvizova | Korisnik vidi sve dostupne kvizove | ✅ Riješeno |
| Rješavanje kviza | Korisnik prolazi kroz pitanja i bira odgovore | ✅ Riješeno |
| Automatsko bodovanje | Sustav automatski izračunava rezultat | ✅ Riješeno |
| Prikaz rezultata | Nakon završetka kviza prikazuju se osvojeni bodovi i postotak | ✅ Riješeno |
| Pohrana rezultata | Rezultat se sprema u bazu podataka | ✅ Riješeno |
 
## Dodatne funkcije
 
| Funkcionalnost | Opis | Status |
|---|---|---|
| Pregled povijesti rezultata | Korisnik može pregledati sve prethodne rezultate | ✅ Riješeno |
| Statistika po korisniku | Prikaz prosječnog rezultata i broja riješenih kvizova | ✅ Riješeno |
| Uređivanje kviza | Administrator može naknadno mijenjati kviz i pitanja | ✅ Riješeno |
| Brisanje kviza | Administrator može obrisati kviz | ✅ Riješeno |
| Bodovna vrijednost po pitanju | Svako pitanje može imati različitu težinu | ✅ Riješeno |
| Poruka o rezultatu | Personalizirana poruka ovisno o ostvarenom postotku | ✅ Riješeno |
| Pretraživanje kvizova | Korisnik može pretraživati kvizove po nazivu ili temi | ✅ Riješeno |
| Kategorije kvizova | Kvizovi se mogu svrstati u kategorije | ✅ Riješeno |
 
## Korisnički tijekovi (registracija i prijava korisnika)
 
- Korisnik otvara aplikaciju i vidi početnu stranicu s opcijama Prijava i Registracija
- Klikne na Registracija, unosi korisničko ime, e-mail adresu i lozinku
- Potvrđuje registraciju - sustav kreira novi korisnički račun
- Korisnik se preusmjerava na stranicu za prijavu
- Unosi e-mail i lozinku, klikne Prijava
- Sustav provjerava podatke za prijavu i preusmjerava korisnika na nadzornu ploču (dashboard)
Rješavanje kviza
 
- Prijavljeni korisnik vidi popis dostupnih kvizova na nadzornoj ploči
- Klikne na željeni kviz — prikazuje mu se naslov, opis i broj pitanja
- Klikne Započni kviz
- Sustav prikazuje prvo pitanje s ponuđenim odgovorima (A, B, C, D)
- Korisnik odabire odgovor i klikne Sljedeće pitanje
- Nakon zadnjeg pitanja, korisnik klikne Završi kviz
- Sustav izračunava rezultat i prikazuje stranicu s rezultatima: Broj točnih odgovora, ukupni broj bodova, postotak uspješnosti, poruka (npr. "Odličan rezultat!")

<img src="/prototip.png" alt="opis"/>
