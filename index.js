import express from 'express';
import cors from 'cors';
import userRouter from './server/routes/userRouter.js';
import reviewRouter from "./server/routes/reviewRouter.js";
import groupRouter from "./server/routes/groupRouter.js";
import movieRouter from './server/routes/movieRouter.js';
import userpage from "./server/routes/userpageRouter.js"
import notificationRouter from'./server/routes/notificationRouter.js'

const port = 3001;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/user', userRouter);
app.use('/movie', movieRouter);
app.use("/reviews", reviewRouter);
app.use("/groups", groupRouter)
app.use("/userpage", userpage)
app.use('/notification',notificationRouter)

app.get('/', (req, res) => {
    res.send('Hello, World!');
  });

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({ error: err.message });
});