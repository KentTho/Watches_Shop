import { Router } from 'express';
import { sample_foods, sample_tags } from '../data';
import asyncHandler from 'express-async-handler';
import { FoodModel } from '../models/food.model';
import { HTTP_BAD_REQUEST, HTTP_NOT_FOUND} from '../constants/http_status';
const router = Router();

router.get(
    '/seed',
    asyncHandler(async (req, res) => {
        const foodsCount = await FoodModel.countDocuments();
        if (foodsCount > 0) {
            res.send('Seed is already done!');
            return;
        }

        await FoodModel.create(sample_foods);
        res.send('Seed Is Done!');
    })
);

router.get(
    '/',
    asyncHandler(async (req, res) => {
        const foods = await FoodModel.find();
        res.send(foods);
    })
);

router.get(
    '/search/:searchTerm',
    asyncHandler(async (req, res) => {
        const searchRegex = new RegExp(req.params.searchTerm, 'i');
        const foods = await FoodModel.find({ name: { $regex: searchRegex } });
        res.send(foods);
    })
);

router.get(
    '/tags',
    asyncHandler(async (req, res) => {
        const tags = await FoodModel.aggregate([
            {
                $unwind: '$tags',
            },
            {
                $group: {
                    _id: '$tags',
                    count: { $sum: 1 },
                },
            },
            {
                $project: {
                    _id: 0,
                    name: '$_id',
                    count: '$count',
                },
            },
        ]).sort({ count: -1 });

        const all = {
            name: 'All',
            count: await FoodModel.countDocuments(),
        };

        tags.unshift(all);
        res.send(tags);
    })
);

router.get(
    '/tag/:tagName',
    asyncHandler(async (req, res) => {
        const foods = await FoodModel.find({ tags: req.params.tagName });
        res.send(foods);
    })
);

router.get(
    '/:foodId',
    asyncHandler(async (req, res) => {
        const food = await FoodModel.findById(req.params.foodId);
        res.send(food);
    })
);

router.post(
    '/',
    asyncHandler(async (req, res) => {
        const { name, price, tags, favorite, stars, imageUrl, origins, cookTime } = req.body;
        const newWatches = new FoodModel({
            name,
            price,
            tags,
            favorite,
            stars,
            imageUrl,
            origins,
            cookTime,
        });

        const created = await newWatches.save();
        res.status(201).send(created);
    })
);

router.put(
    '/:foodId',
    asyncHandler(async (req, res) => {
        const { name, price, tags, favorite, stars, imageUrl, origins, cookTime } = req.body;
        const updatedFood = await FoodModel.findByIdAndUpdate(
            req.params.foodId,
            {
                name,
                price,
                tags,
                favorite,
                stars,
                imageUrl,
                origins,
                cookTime,
            },
            { new: true }
        );

        if (!updatedFood) {
            res.status(HTTP_BAD_REQUEST).send('Fail');
        }

        res.status(201).send(updatedFood);
    })
);


router.delete(
    '/:foodId',
    asyncHandler(async (req, res) => {
        const deletedFood = await FoodModel.findByIdAndDelete(req.params.foodId);

        if (!deletedFood) {
            res.status(HTTP_BAD_REQUEST).send('Fail');
        }

        res.send({ message: 'Food deleted successfully' });
    })
);


export default router;