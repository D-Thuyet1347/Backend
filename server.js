import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js";
import 'dotenv/config'
import productRouter from "./routes/productRoutes.js";
import userRouter from "./routes/userRoutes.js";
import cartRouter from "./routes/cartRoutes.js";
import orderRoute from "./routes/ordersRoutes.js";
import reviewspRouter from "./routes/reviewspRoutes.js";
import reviewdvRouter from "./routes/reviewdvRoutes.js";
import voucherRoutes from './routes/voucherRoutes.js';
import branchRoutes from './routes/branchRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';
import blog from './routes/blogRoutes.js';
import bookingRouter from "./routes/bookingRoutes.js";
import serviceRouter from "./routes/serviceRoutes.js"
const app = express();
const port = 4000;

app.use(cors());
app.use(express.raw({ limit: "50mb", type: "application/octet-stream" }));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));



connectDB();

app.use('/images',express.static('uploads'))
app.use('/api/vouchers',voucherRoutes)
app.use('/api/product',productRouter)
app.use('/api/user',userRouter)
app.use('/api/cart',cartRouter)
app.use('/api/order',orderRoute)
app.use('/api/reviewsp', reviewspRouter);
app.use('/api/reviewdv', reviewdvRouter);
app.use('/api/branch', branchRoutes);
app.use('/api/employee', employeeRoutes);
app.use('/', voucherRoutes);
app.use('/api/blog',blog);
app.use('/api/booking', bookingRouter);
app.use('/api/service', serviceRouter)

app.get("/",(req,res)=>{
    res.send("api")
});
app.listen(port,()=>{
    console.log(`server started on http://localhost:${port}`)
})