import { initializeTestDb, insertTestUser, getToken } from "./helpers/test.js";
import { expect } from "chai";
import { response } from "express";

const base_url = "http://localhost:3001"

describe("POST login" , () => {
    before(() => {
        initializeTestDb()
    })
    it ("should login user")
})