# zoopla-property-manager

## Project Live

https://zoopla-admin.netlify.com

### To be done
- Separate actions, state and mutations.
- Adding i18 Translation support.
- Persist changes in DB instead of app state. Perform query on actions (store/modules/management.js).
- Add loader to listen to state
- Validation Helper not implemented yet (will be working on the store actions)
- Move the object property to a DB so the fields are dynamic (they may want to have a property type for example in the future).
- Add tests to the store

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Run your unit tests
```
npm run test:unit
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
