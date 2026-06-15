# Editor inline gratis pentru CRP Arad

Site-ul are acum un editor inline pregatit pentru admin. Loginul ramane ascuns pentru vizitatori si se deschide cu:

- `https://www.crparad.ro/?login=1`
- `Ctrl + Alt + E`
- `Ctrl + Shift + E`

Dupa login cu `crparad@gmail.com`, apare bara `Editor site`. Apesi `Editeaza pagina`, dai click direct pe textele conturate, modifici, apoi apesi `Salveaza`.

## Ce functioneaza acum

- Editare inline pentru textele de pe pagina principala: hero, despre, comitet, documente, judete, evenimente, seminarii, liceu, locatie, contact si footer.
- Fara dashboard public si fara buton de login vizibil pentru vizitatori.
- Fara schimbari de layout pentru vizitatori.
- Daca endpoint-ul de salvare nu este configurat, editorul salveaza draftul local in browser si afiseaza mesajul ca lipseste publicarea in GitHub.

## Ce lipseste pentru salvare live in GitHub

Browserul nu poate scrie direct in GitHub in siguranta. Pentru salvare live trebuie un Cloudflare Worker gratuit care tine tokenul GitHub secret si accepta doar adminul Firebase.

Fisierul Worker este pregatit aici:

```text
cloudflare-worker/crp-cms-worker.js
```

Configuratia Worker este in:

```text
wrangler.toml
```

Variabilele publice sunt deja setate acolo:

```text
GITHUB_OWNER=EliasMuresan
GITHUB_REPO=CRP
GITHUB_BRANCH=main
ADMIN_EMAIL=crparad@gmail.com
ALLOWED_ORIGIN=https://www.crparad.ro
FIREBASE_API_KEY=AIzaSyBg1mDwkKxepDb7FWB0_taSsFCtSR8ONVU
```

Secretul se seteaza in Cloudflare, nu in cod:

```text
GITHUB_TOKEN=token GitHub cu acces Contents: Read and write doar pentru repo-ul CRP
```

## Deploy rapid

Ruleaza:

```bat
deploy-cloudflare-worker.bat
```

Dupa ce Worker-ul are URL, se pune URL-ul inainte de scriptul principal ca:

```html
<script>
window.CRP_CMS_SAVE_ENDPOINT = "https://workerul-tau.workers.dev";
</script>
```

Atunci butonul `Salveaza` va face commit automat in GitHub, iar GitHub Pages va publica pe domeniul existent.
