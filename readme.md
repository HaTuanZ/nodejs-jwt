
### Create a secret key
```cmd
node -e "console.log(require('crypto').randomBytes(256).toString('base64'));"
```