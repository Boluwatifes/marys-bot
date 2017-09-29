import bodyParser from 'body-parser';
import express from 'express';
import axios from 'axios';

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Welcome to marys api');
})

app.post('/strain', (req, res) => {
  const { searchQuery } = req.body;
  axios.get(`https://www.cannabisreports.com/api/v1.0/strains/search/${searchQuery}`)
  .then(({ data }) => {
    let result;
    if (data.data.length > 0) {
      result = data.data.map((res) => (
        { text: res.name }
      ));
    } else {
      result = [{ text: 'No strain found' }];
    }
    console.log(result);
    res.send(result);
  }, ({ response }) => {
    res.send({
      status: 400,
      error: response.data
    });
  })
  
});

app.listen(3000, () => {
  console.log('App started here');
});
