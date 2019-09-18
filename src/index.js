import App from './App';

const port = process.env.LISTEN_PORT;

App.listen(port, () => {
  console.log(`Listening at port ${port}...`);
});
