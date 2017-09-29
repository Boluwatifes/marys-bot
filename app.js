import bodyParser from 'body-parser';
import express from 'express';

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Welcome to marys api');
})

app.post('/strain', (req, res) => {
  const { searchQuery } = req.body;
  res.send({
    status: 200,
    searchQuery
  });
});

app.listen(4000, () => {
  console.log('App started here');
});
