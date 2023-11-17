const express = require('express');
const app = express();
require('dotenv').config();
const mongoose = require('mongoose');
const userRoute = require('./routes/users.js');
const organizationRoute = require('./routes/organization.js');
const cors = require('cors');


app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(console.log("Connect to MongoDB")).catch(err => console.log(err));

app.use("/user", userRoute);
app.use("/organization", organizationRoute);

app.listen(process.env.PORT, () => {
    console.log(`App is running on ${process.env.PORT}`);
});