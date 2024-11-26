import { initializeTestDb, insertTestUser, getToken } from "./helpers/test.js";
import { expect } from "chai";
import { response } from "express";

const base_url = "http://localhost:3001"

describe("POST login" , () => {
    before(() => {
        initializeTestDb()
    })

    const email = "cremelog@gmail.com"
    const password = "A1234567"
    const wrongPassword = "notthepassword"
    insertTestUser(email, password)

    it ("should login with valid credentials", async() => {
        const response = await fetch (base_url + "/user/login", {
            method: "post",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({"users_email": email, "users_password": password})
        })
        const data = await response.json()
        expect(response.status).to.equal(200, data.error)
        expect(data).to.be.an("object")
        expect(data).to.include.all.keys("users_id", "users_email", "accessToken", "refreshToken")
    })

    

    it ("should not login with invalid credentials", async () => {
        const response = await fetch (base_url + "/user/login", {
            method: "post",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({"users_email": email, "users_password": wrongPassword})
        })
        const data = await response.json()
        
        expect(response.status).to.equal(401, data.error)
        expect(data).to.be.an("object")
        expect(data).to.include.all.keys("error")
    })
})

describe("POST register", () => {

    it ("should register with valid email and password", async() => {
        const email = "caramelreg@gmail.com"
        const password = "A1234567"
        const response = await fetch(base_url + "/user/register", {
            method: "post",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({"users_email":email, "users_password": password})
        })
        const data = await response.json()
        expect(response.status).to.equal(201, data.error)
        expect(data).to.be.an("object")
        expect(data).to.include.all.keys("users_id", "users_email")
    })

    it ("should not register with less than 8 character password", async () => {
        const email = "vanillareg@gmail.com"
        const password = "short"
        const response = await fetch(base_url + "/user/register", {
            method: "post",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({"users_email":email, "users_password": password})
        })
        const data = await response.json()
        expect(response.status).to.equal(400, data.error)
        expect(data).to.be.an("object")
        expect(data).to.include.all.keys("error")
    })

    it ("should not register with a otherwise valid password that does not contain a capitalized letter", async () => {
        const email = "cinnamonreg@gmail.com"
        const password ="a1234567"
        const response = await fetch(base_url + "/user/register", {
            method: "post",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({"users_email":email, "users_password": password})
        })
        const data = await response.json()
        expect(response.status).to.equal(400, data.error)
        expect(data).to.be.an("object")
        expect(data).to.include.all.keys("error")
    })
})