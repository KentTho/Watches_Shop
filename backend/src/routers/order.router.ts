import {Router} from 'express';
import asyncHandler from 'express-async-handler';
import { HTTP_BAD_REQUEST } from '../constants/http_status';
import { OrderStatus } from '../constants/order_status';
import { OrderModel } from '../models/order.model';
import auth from '../middlewares/auth.mid';

const router = Router();
router.use(auth);

router.post('/create',
    asyncHandler(async (req:any, res:any) => {
        const requestOrder = req.body;

        if(requestOrder.items.length <= 0){
            res.status(HTTP_BAD_REQUEST).send('Cart Is Empty!');
            return;
        }

        await OrderModel.deleteOne({
            user: req.user.id,
            status: OrderStatus.NEW
        });

        const newOrder = new OrderModel({...requestOrder,user: req.user.id});
        await newOrder.save();
        res.send(newOrder);
    })
)


router.get('/newOrderForCurrentUser', asyncHandler( async (req:any,res ) => {
    const order= await getNewOrderForCurrentUser(req);
    if(order) res.send(order);
    else res.status(HTTP_BAD_REQUEST).send();
}))

router.post('/pay', asyncHandler( async (req:any, res) => {
    const {paymentId} = req.body;
    const order = await getNewOrderForCurrentUser(req);
    if(!order){
        res.status(HTTP_BAD_REQUEST).send('Order Not Found!');
        return;
    }

    order.paymentId = paymentId;
    order.status = OrderStatus.PAYED;
    await order.save();

    res.send(order._id);
}))

router.get('/track/:id', asyncHandler( async (req, res) => {
    const order = await OrderModel.findById(req.params.id);
    console.log(order);
    res.send(order);
}))

router.get('/ordersForCurrentUser', asyncHandler(async (req: any, res: any) => {
    const orders = await OrderModel.find({ user: req.user.id });
    if (orders.length > 0) {
        res.send(orders);
    } else {
        res.status(HTTP_BAD_REQUEST).send('No orders found for current user');
    }
}));

router.get('/order/:id', asyncHandler(async (req: any, res: any) => {
    const order = await OrderModel.findOne({ _id: req.params.id, user: req.user.id });
    console.log("Run man")
    if (order) {
        res.send(order);
    } else {
        res.status(HTTP_BAD_REQUEST).send('Order not found or does not belong to current user');
    }
}));

router.put('/updateStatus/:id', asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
        res.status(HTTP_BAD_REQUEST).send('Fail');
    }

    const order = await OrderModel.findOne({ _id: id});

    if (!order) {
        res.status(HTTP_BAD_REQUEST).send('Fail');
    }

    order!.status = status;
    await order!.save();

    res.status(201).send(order);
}));

router.get('/all', asyncHandler(async (req, res) => {
    try {
        const orders = await OrderModel.find();

        if (orders.length === 0) {
            res.status(HTTP_BAD_REQUEST).send('No orders found!');
        }
        res.status(201).send(orders);
    } catch (error) {
        res.status(HTTP_BAD_REQUEST).send('Error fetching orders');
    }
}));

export default router;

async function getNewOrderForCurrentUser(req: any) {
    return await OrderModel.findOne({ user: req.user.id, status: OrderStatus.NEW });
}