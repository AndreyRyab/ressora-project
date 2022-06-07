const mongoose = require('mongoose');

mongoose.connect(
  process.env.MONGO_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }, 
  (error) => {
    if (error) {
      console.log("Error!" + error);
    } else {
      console.log("Mongo connected");
    };
  }
);

module.exports = mongoose;
