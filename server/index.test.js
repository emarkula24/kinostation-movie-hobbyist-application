import { initializeTestDb, insertTestUser, getToken } from "./helpers/test.js";
import { expect } from "chai";
import { response } from "express";

const base_url = "http://localhost:3001"

describe("POST login" , () => {
    before(async() => {
        initializeTestDb()
    })
     it ("should login with valid credentials", async() => {
        const email = "validlog@gmail.com"
        const password = "A1234567"

        await insertTestUser(email, password);
        
        const response = await fetch (base_url + "/user/login", {
            method: "post",
            headers: {
                "Content-Type":"application/json",
                
            },
            body: JSON.stringify({"users_email": email, "users_password": password})
        })
        const data = await response.json()
        expect(response.status).to.equal(200, data.error)
        expect(data).to.be.an("object")
        expect(data).to.include.all.keys("users_id", "users_email", "accessToken", "refreshToken")
    })

    

    it ("should not login with invalid credentials", async () => {
        const email = "wrongpasslog@gmail.com"
        const password = "A1234567"
        const wrongPassword = "notthepassword"
        await insertTestUser(email, password)
        
        const response = await fetch (base_url + "/user/login", {
            method: "post",
            headers: {
                "Content-Type":"application/json",
                
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
        const email = "validreg@gmail.com"
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
        const email = "lengthreg@gmail.com"
        const password = "Short"
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
        expect(data.error).to.equal("Invalid email or password.");
    })

    it ("should not register with a otherwise valid password that does not contain a capitalized letter", async () => {
        const email = "capitalletterreg@gmail.com"
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

describe ("POST logout", () => {

    it("should succesfully logout user", async () => {
        const email = "logout@gmail.com"
        const password = "A1234567"
        await insertTestUser(email, password)

        const loginResponse = await fetch (base_url + "/user/login", {
            method: "post",
            headers: {
                "Content-Type":"application/json",
                
            },
            body: JSON.stringify({"users_email": email, "users_password": password})
        })

        expect(loginResponse.status).to.equal(200)

        const loginData = await loginResponse.json()
        const { refreshToken, accessToken } = loginData

        expect(refreshToken).to.exist
        expect(accessToken).to.exist

        const logoutResponse = await fetch (base_url + "/user/logout", {
            method: "post",
            headers: {
                "Content-Type":"application/json",
                Authorization: `Bearer ${accessToken}`
            },
            body: JSON.stringify({ token: refreshToken })
        })
        const data = await logoutResponse.json();
        expect(logoutResponse.status).to.equal(200, data.error)
    })

    it("should not logout user", async () => {
        const email = "wronglogout@gmail.com"
        const password = "A1234567"
        const wrongRefreshToken = ""
        await insertTestUser(email, password)

        const loginResponse = await fetch (base_url + "/user/login", {
            method: "post",
            headers: {
                "Content-Type":"application/json",
                
            },
            body: JSON.stringify({"users_email": email, "users_password": password})
        })

        expect(loginResponse.status).to.equal(200)

        const loginData = await loginResponse.json()
        const { accessToken } = loginData

        expect(accessToken).to.exist

        const logoutResponse = await fetch (base_url + "/user/logout", {
            method: "post",
            headers: {
                "Content-Type":"application/json",
                Authorization: `Bearer ${accessToken}`
            },
            body: JSON.stringify({ token: wrongRefreshToken })
        })
        const data = await logoutResponse.json();
        expect(logoutResponse.status).to.equal(403, data.error)
    })
})