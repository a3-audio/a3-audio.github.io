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

There is no deploy target in this repo. `gulp build` produces `dist/`; publishing it
is a manual step.

There used to be two rsync-over-SSH targets here. They pointed at hosts that are no
longer the project's, so they were removed rather than left pointing somewhere the
project does not control.


## TODOS

- reorganisation vom ganzen css
- Timline implementieren
- doc schreiben
̀
