# Administrare cu Pages CMS

Site-ul este pregatit pentru Pages CMS, un CMS gratuit si open-source pentru site-uri statice tinute in GitHub. Continutul editabil este in `content/`, iar schema editorului este in `.pages.yml`.

## Ce poate edita administratorul

- Pagina principala: hero, texte, imagini, butoane, carduri, judete, evenimente, seminarii, locatie, contact si footer.
- Galerii de evenimente: lista de imagini, titlul si descrierea galeriei.
- Media: imaginile din folderele `images`, `conferinta1`, `conferinta2`, `eveniment3` si `seminariipoze`.

## Cum se foloseste

1. Pune site-ul intr-un repository GitHub sau deschide repository-ul existent.
2. Verifica sa existe in root fisierul `.pages.yml`.
3. Intra in https://app.pagescms.org/ si conecteaza-te cu GitHub.
4. Alege repository-ul site-ului.
5. Editeaza:
   - `Pagina principala` pentru continutul de pe `index.html`.
   - `Galerii evenimente` pentru galeriile foto.
6. Apasa Save/Commit. Pages CMS salveaza modificarile in GitHub.
7. Deploy-ul existent publica site-ul ca pana acum. Domeniul din `CNAME` ramane neschimbat.

## Preview local

Deschide site-ul prin server local, nu direct ca fisier:

```powershell
npx http-server . -p 8080
```

Apoi intra pe:

```text
http://127.0.0.1:8080/index.html
```

Motivul: browserul blocheaza `fetch()` pentru fisiere locale deschise cu `file:///`, iar continutul CMS din JSON se incarca prin HTTP.

## Unde sunt fisierele

- `.pages.yml` - schema pentru editorul Pages CMS.
- `content/site.json` - continutul paginii principale.
- `content/galleries/conferinta1.json` - galeria foto pentru `conferinta1.html`.
- `pgpr1.js` - incarca JSON-ul si il aplica pe HTML-ul existent.

## Observatie despre Git

Folderul local verificat nu contine inca `.git`. Pentru ca Pages CMS sa poata salva editarile, site-ul trebuie sa fie intr-un repository GitHub real.
