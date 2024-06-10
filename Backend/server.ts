// import {getFormSchema} from './prisma_handler.ts';

// const express = require('express');
// const cors = require('cors');
// const bodyParser = require('body-parser');


// const app = express();
// const PORT = 3000;

// app.use(cors());
// app.use(bodyParser.json());

// app.get('/', (req, res) => {
//     res.send('Welcome to Dynamic Form API');
// });

// app.get('api/form-schema', getFormSchema);


import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bodyParser from 'body-parser';

const cors = require('cors');
// Initialize Prisma Client
const prisma = new PrismaClient();

// Initialize Express App
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Endpoint to get form schema
app.get('/api/form-schema', async (req: Request, res: Response) => {
  try {
    const formSchema = await prisma.form_schema.findMany();
    res.json(formSchema);
  } catch (error) {
    console.error('Error fetching form schema:', error);
    res.status(500).json({ message: 'Error fetching form schema' });
  }
});

// Endpoint to update form schema
app.post('/api/form-schema', async (req: Request, res: Response) => {
  const { schema } = req.body;
  try {
    console.log('Schema:', schema);
    const result = await prisma.form_schema.createMany({
      data: schema
      // skipDuplicates: true, // Skip duplicate entries
    });
    console.log('Schema updated successfully:', result);
    res.json({ message: 'Schema updated successfully' });
  } catch (error) {
    console.error('Error updating form schema:', error);
    res.status(500).json({ message: 'Error updating form schema' });
  }
});

// Endpoint to get responses
app.get('/api/form-data', async (req: Request, res: Response) => {
  try {
    const responses = await prisma.form_data.findMany();
    res.json(responses);
  } catch (error) {
    console.error('Error fetching responses:', error);
    res.status(500).json({ message: 'Error fetching responses' });
  }
});

// Endpoint to update response
app.post('/api/form-data', async (req: Request, res: Response) => {
  const formdata = req.body;

  try {
    const schema = await prisma.form_schema.findMany();
    const response = await prisma.form_data.create({
      data: {
        responses: formdata,
      },
    });
    console.log('Response inserted successfully:', response);
    res.status(200).json({ message: 'Response inserted successfully' });
  } catch (error) {
    console.error('Error inserting response:', error);
    res.status(500).json({ message: 'Error inserting response' });
  }
});

// Endpoint to delete responses
app.delete('/api/form-data', async (req: Request, res: Response) => {
  try {
    await prisma.form_data.deleteMany();
    console.log('Responses deleted successfully');
    res.send('Responses deleted successfully');
  } catch (error) {
    console.error('Error deleting responses:', error);
    res.status(500).json({ message: 'Error deleting responses' });
  }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
