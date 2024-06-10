// import Prisma Client
const { PrismaClient } = require('@prisma/client');

// Instantiate Prisma Client
const prisma = new PrismaClient();

const getFormSchema = async (req, res) => {
  try {
    const currentSchema = await prisma.formSchema.findMany();
    res.json(currentSchema);
  } catch (error) {
    console.error('Error fetching form schema:', error);
    res.status(500).json({ message: 'Error fetching form schema' });
  }
};

const updateFormSchema = async (req, res) => {
  const { schema } = req.body;
  try {
    const result = await prisma.formSchema.createMany({
      data: schema,
      skipDuplicates: true, // Skip duplicate entries
    });
    console.log('Schema updated successfully:', result);
    res.json({ message: 'Schema updated successfully' });
  } catch (error) {
    console.error('Error updating form schema:', error);
    res.status(500).json({ message: 'Error updating form schema' });
  }
};

const getResponse = async (req, res) => {
  try {
    const responses = await prisma.formData.findMany();
    res.json(responses);
  } catch (error) {
    console.error('Error fetching responses:', error);
    res.status(500).json({ message: 'Error fetching responses' });
  }
};

const updateResponse = async (req, res) => {
  const data = req.body;
  try {
    const response = await prisma.formData.create({
      data,
    });
    console.log('Response inserted successfully:', response);
    res.status(200).json({ message: 'Response inserted successfully' });
  } catch (error) {
    console.error('Error inserting response:', error);
    res.status(500).json({ message: 'Error inserting response' });
  }
};

const deleteResponse = async (req, res) => {
  try {
    await prisma.formData.deleteMany();
    console.log('Responses deleted successfully');
    res.send('Responses deleted successfully');
  } catch (error) {
    console.error('Error deleting responses:', error);
    res.status(500).json({ message: 'Error deleting responses' });
  }
};

module.exports = {
  getFormSchema,
  updateFormSchema,
  getResponse,
  updateResponse,
  deleteResponse,
};
