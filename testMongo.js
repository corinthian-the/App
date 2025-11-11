const mongoose = require('mongoose');

const uri = 'mongodb+srv://Brenda:18atlast@cluster0.l4i1nyh.mongodb.net/brendaAppDB?retryWrites=true&w=majority';

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('✅ MongoDB connected successfully!');

    // Define a test schema & model
    const testSchema = new mongoose.Schema({
      message: String,
      createdAt: { type: Date, default: Date.now }
    });

    const Test = mongoose.model('Test', testSchema);

    // Create & save a sample document
    const testDoc = new Test({ message: 'MongoDB connection is working!' });

    return testDoc.save();
  })
  .then(doc => {
    console.log('📄 Document saved:', doc);
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('❌ Error:', err);
  });
