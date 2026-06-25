import request from "supertest";
import * as questController from '../controller/questController.js';


test("add", () => {
    expect(1 + 1).toBe(2);
})

test("getRandomQuest", () => {
    const req = {body: {}} as any;
    const res = {json: jest.fn()} as any;
    questController.getRandomQuest(req, res);
    expect(res.json).toHaveBeenCalled();
})