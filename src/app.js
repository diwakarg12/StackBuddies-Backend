const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const cookieParser = require('cookie-parser');
const authRouter = require('./routers/authRouter');
const profileRouter = require('./routers/profileRouter');
const connectionRouter = require('./routers/connectionRouter');
const userRouter = require('./routers/userRouter');
const messageRouter = require('./routers/messageRoute');
const cors = require('cors');
const { createServer } = require('http');
const { initializeSocket } = require('./socket/socket.server');

const app = express();
dotenv.config();
const PORT = process.env.PORT || 3000;
const httpServer = createServer(app);

initializeSocket(httpServer)
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}))

app.use('/auth', authRouter);
app.use('/profile', profileRouter);
app.use('/request', connectionRouter);
app.use('/user', userRouter);
app.use('/message', messageRouter)

connectDB().then(() => {
    console.log('Database Connected Successfully!')
    httpServer.listen(PORT, () => {
        console.log(`Application is running on Port ${PORT}`)
    })
}).catch((err) => {
    console.log('Error While Connecting to Database', err)
})