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
  const { searchString } = req.body;
  axios.get(`https://www.cannabisreports.com/api/v1.0/strains/search/${searchString}`)
  .then(({ data }) => {
    let result;
    if (data.data.length > 0) {
      result = data.data.map((res) => (
        { attachment: {
          type: 'template',
          payload: {
            template_type: 'button',
            text: res.name,
            buttons: [
              {
                url: `https://marys-api.herokuapp.com/detail?url=${res.link}`,
                type:'json_plugin_url',
                title:'Get Details'
              }
            ]
          }
        } }
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

app.get('/detail', (req, res) => {
  const { url } = req.query;

  res.send({ text: url });
});

app.post('/detail', (req, res) => {
  const { url } = req.query;

  res.send([{ text: url }]);
});

app.listen(process.env.PORT || 3000, () => {
  console.log('App started here');
});
