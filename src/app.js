const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const cookieParser = require('cookie-parser');
const authRouter = require('./routers/authRouter');
const profileRouter = require('./routers/profileRouter');
const connectionRouter = require('./routers/connectionRouter');
const userRouter = require('./routers/userRouter');
const cors = require('cors');

const app = express();
dotenv.config();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(cors(
    origin = 'http://localhost:5173/',
    Credential = true
))

app.use('/auth', authRouter);
app.use('/profile', profileRouter);
app.use('/request', connectionRouter);
app.use('/user', userRouter);

connectDB().then(() => {
    console.log('Database Connected Successfully!')
    app.listen(PORT, () => {
        console.log(`Application is running on Port ${PORT}`)
    })
}).catch((err) => {
    console.log('Error While Connecting to Database', err)
})