import request from "supertest";
import express, { Router } from "express";

import * as shopController from "../controller/shopController.js";



describe("Shop Controller", () => {

    let app: express.Application;

    beforeAll(() => {
        app = express();
        const router = Router();

        router.get("/items", shopController.getItems);

        app.use(router);
    });

    test("GET /items returns item list", async () => {
        const res = await request(app).get("/items");

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.items)).toBe(true); // or res.body depending on your JSON shape
    });
});

test("add", () => {
    expect(1 + 1).toBe(2);
})