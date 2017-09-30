import bodyParser from 'body-parser';
import express from 'express';
import axios from 'axios';

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Welcome to marys api');
});

app.post('/strain', (req, res) => {
  const { searchString } = req.body;
  axios.get(`https://www.cannabisreports.com/api/v1.0/strains/search/${searchString}`)
  .then(({ data }) => {
    let result;
    if (data.data.length > 0) {
      result = data.data.map(res => (
        {
          title: res.name,
          image_url: res.image,
          subtitle: `Seed Company name: ${res.seedCompany.name}, Ucpc: ${res.seedCompany.ucpc}. Link: ${res.link}`,
          buttons: [
            {
              url: `https://marys-api.herokuapp.com/detail?url=${res.link}`,
              type: 'json_plugin_url',
              title: 'Get Details'
            }
          ]
        }
      ));
      res.send([
        { attachment: {
          type: 'template',
          payload: {
            template_type: 'generic',
            elements: [
              ...result
            ]
          }
        } }
      ]);
    } else {
      res.send([{ text: 'No strain found' }]);
    }
  }, ({ response }) => {
    res.send({
      status: 400,
      error: response.data
    });
  });
});

app.post('/detail', (req, res) => {
  const { url } = req.query;

  /**
   * Get strain details from the api
   * @method getStrainDetails
   * @param {string} strain
   * @returns {promise} - Promise containing the data to be resolved
   */
  function getStrainDetails(strain) {
    return Promise.all([
      axios.get(`${strain}`),
      axios.get(`${strain}/effectsFlavors`),
      axios.get(`${strain}/seedCompany`)
    ]);
  }

  getStrainDetails(url).then((result) => {
    // console.log(result[0].data, 'uefjsfnjsnfsjnfsjfnsjf', result[1].data);
    let text = `Details for ${result[0].data.data.name}. \n \n `;
    if (result[1].data.data) {
      const data = result[1].data.data;
      text += 'Effects Flavours \n';
      for (const n in data) {
        text += `${n}: ${data[n]}. \n `;
      }
      text += '\n ';
    }

    if (result[2].data.data) {
      const companyDetails = result[2].data.data;
      text += 'Company Detail. \n';
      text += `Name: ${companyDetails.name}. \n `;
      if (companyDetails.lineage) {
        const lineage = companyDetails.lineage;
        text += 'Lineage -: \n ';
        for (const i in lineage) {
          text += `${i}. \n `;
        }
      }
    }
    res.send([{
      text
    }]);
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log('App started here');
});
