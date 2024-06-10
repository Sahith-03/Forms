import {getFormSchema, updateFormSchema,updateResponse,getResponse,deleteResponse} from './handler';

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
// const { getFormSchema, updateFormSchema,updateResponse,getResponse,deleteResponse } = require('./handler');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Welcome to Dynamic Form API');
});
app.get('/api/form-schema', getFormSchema);
app.post('/api/form-schema', updateFormSchema);
app.post('/api/form-data', updateResponse);
app.get('/api/form-data', getResponse);
app.delete('/api/form-data', deleteResponse);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
