import App from './App';

const port = process.env.PORT;

App.listen(port, () => {
  console.log(`Listening at port ${port}...`);
});
