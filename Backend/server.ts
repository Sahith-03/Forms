import express, { Request, Response } from 'express';
import prisma from './prisma';
import bodyParser from 'body-parser';
import authRoutes from './routes/auth';
// import { InputJsonValue } from '@prisma/client';

const cors = require('cors');


const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/auth', authRoutes);


app.get('/api/form-schema/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const formSchema = await prisma.form.findMany({
      where: { userId: parseInt(userId,10)},
      select:{id:true,formSchema:true,formName:true}
    });
    console.log('Form schema fetched successfully:', formSchema);
    res.json(formSchema);
  } catch (error) {
    console.error('Error fetching form schema:', error);
    res.status(500).json({ message: 'Error fetching form schema' });
  }
});


// Endpoint to get form schema
app.get('/api/form-schema/:email/:formName', async (req: Request, res: Response) => {
  try {
    const { email,formName } = req.params;
    console.log('Email:', email, 'Form Name:', formName);
    const userId = await prisma.user.findUnique({
      where: { email: email },
      select:{id:true}
    })
    console.log('User:', userId)
    if(userId === null){
      return res.status(401).json({ message: 'User not found' });
    }
    const formSchema = await prisma.form.findMany({
      where: { userId: userId.id, formName: formName},
      select:{id:true,formSchema:true}
    });
    if(formSchema.length === 0){
      return res.status(404).json({ message: 'Form not found' });
    }
    console.log('Form schema fetched successfully:', formSchema);
    res.json(formSchema);
  } catch (error) {
    console.error('Error fetching form schema:', error);
    res.status(500).json({ message: 'Error fetching form schema' });
  }
});

// Endpoint to update form schema
app.post('/api/form-schema', async (req: Request, res: Response) => {
  const { formName,schema,userId } = req.body;
  try {
    const currentSchema = await prisma.form.findMany({
      select:{id:false,formName:true,formSchema:true,userId:true}
    });
    // currentSchema.forEach((field) => {field.options = field.options ? JSON.parse(field.options.toString()) as InputJsonValue : ''});
    // const deleteSchema = await prisma.form.deleteMany({
    //   where: { userId: userId,formName: formName},
    // });
    // console.log('Schema deleted successfully:', deleteSchema)
    try {
      console.log('Schema:', schema);
      const result = await prisma.form.upsert({
        where:{
          userId: userId,
          formName: formName
        },
        update: {
          formSchema: schema,
        },
        data: {
        formName: formName,
        formSchema: schema,
        userId: userId
        }
      });
      console.log('Schema updated successfully:', result);
      res.json({ message: 'Schema updated successfully' });
    } catch (error) {
      // const revertSchema = await prisma.form.createMany({
      //   data: currentSchema,
      // });
      console.error('Error updating form schema:', error);
      res.status(500).json({ message: 'Error updating form schema' });
    }
  }
  catch (error) {
    console.error('Error deleting form schema:', error);
    res.status(500).json({ message: 'Error deleting form schema' });
  }
});

// Endpoint to get responses
app.get('/api/form-data', async (req: Request, res: Response) => {
  try {
    const responses = await prisma.formData.findMany();
    res.json(responses);
  } catch (error) {
    console.error('Error fetching responses:', error);
    res.status(500).json({ message: 'Error fetching responses' });
  }
});

// Endpoint to update response
app.post('/api/form-data', async (req: Request, res: Response) => {
  const { formData , formId } = req.body;
  // console.log("FormData:",formData,"\nFormId:",formId);
  try {
    const schema = await prisma.form.findMany();
    const response = await prisma.formData.create({
      data: {
        responses: formData,
        formId: formId,
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
    await prisma.formData.deleteMany();
    console.log('Responses deleted successfully');
    res.send('Responses deleted successfully');
  } catch (error) {
    console.error('Error deleting responses:', error);
    res.status(500).json({ message: 'Error deleting responses' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
