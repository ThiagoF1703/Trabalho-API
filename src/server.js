const app = require('./app');

const port = process.env.API_PORT || 3000;

app.listen(port, () => {
  console.log(`[BD_DSAPI] Servidor rodando em http://localhost:${port}`);
});