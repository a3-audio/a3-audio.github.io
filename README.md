# README

Make changes at the Homepage in folder `src` and run `gulp` to compile the files in the `dist` folder and open the `index.html` in the browser. Run `gulp build` to compile the files for production, which will be in the `dist` folder.


## useage

### installation

```bash
npm install
```

### development

```bash
gulp
```

### build

```bash
gulp build
```

### deploy

We offer two gulp targets for automated deployment to our web servers.

`gulp stage` deploys to our staging machine at https://stage.a3-audio.com.

`gulp deploy` deploys to our production machine at https://a3-audio.com.

To do so, you need the appropriate public/private key pair stored as `~/.ssh/id_ed25519.a3-web-deployment`.
It is not available via this repo, for obvious reasons, and is protected by a strong passphrase.
To enable passwordless deployment, make sure to add it to your ssh-agent or keyring application.


## TODOS

- reorganisation vom ganzen css
- Timline implementieren
- doc schreiben
̀
