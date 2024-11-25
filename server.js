require('dotenv').config(); // Import dotenv to manage environment variables
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const TodoModel = require('./models/Todo');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));

// Routes
// Add a task
app.post('/add', async (req, res) => {
  const { task } = req.body;
  try {
    const newTask = await TodoModel.create({ task });
    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to add task' });
  }
});

// Get all tasks
app.get('/get', async (req, res) => {
  try {
    const tasks = await TodoModel.find();
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// Mark a task as done
app.put('/edit/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const updatedTask = await TodoModel.findByIdAndUpdate(
      id,
      { done: true },
      { new: true }
    );
    res.status(200).json(updatedTask);
  } catch (error) {
    console.error('Error marking task as done:', error);
    res.status(500).json({ error: 'Failed to mark task as done' });
  }
});

// Update a task
app.put('/update/:id', async (req, res) => {
  const { id } = req.params;
  const { task } = req.body;
  try {
    const updatedTask = await TodoModel.findByIdAndUpdate(
      id,
      { task },
      { new: true }
    );
    res.status(200).json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// Delete a task
app.delete('/delete/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedTask = await TodoModel.findByIdAndDelete(id);
    res.status(200).json(deletedTask);
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

// Test Route
app.get('/test', (req, res) => {
  res.send('<h1>Test Successful</h1>');
});

// Export the app for Vercel
module.exports = app;
