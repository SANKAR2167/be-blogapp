import express from "express";
import { client } from "../index.js";
import { auth } from "../middleware/auth.js";
import { ObjectId } from "mongodb";

const router = express.Router()

router.get("/", async function (request, response) {

    if (request.query.rating) {
        request.query.rating = +request.query.rating;
    }

    const blog = await client
        .db("blogapp")
        .collection("blogs")
        .find(request.query)
        .toArray();
    response.send(blog);
});

router.get("/:id", async function (request, response) {
    // const { id } = request.params;
    const id = new ObjectId(request.params.id);
    const blog = await client.db("blogapp").collection("blogs").findOne({ _id: id })
    //const blog = blogs.find((mv) => mv.id === id);
    console.log(blog);
    blog ? response.send(blog) : response.status(404).send({ message: "blog not found" })
});

router.post("/", async function (request, response) {
    try {
        const data = request.body;
        console.log("data", data);
        const result = await client
            .db("blogapp")
            .collection("blogs")
            .insertOne(data);
        response.json(result);
    } catch (error) {
        console.log(error);
        return response.json(error.message)
    }

});

router.delete("/:id", async function (request, response) {
    // const { id } = request.params;
    const id = new ObjectId(request.params.id);
    const result = await client
        .db("blogapp")
        .collection("blogs")
        .deleteOne({ _id: id });

    result.deletedCount > 0
        ? response.send({ message: "blog deleted successfully" })
        : response.status(404).send({ message: "blog not found" });
})

router.put("/:id", async function (request, response) {
    try {
        // const { id } = request.params;
        const id = new ObjectId(request.params.id);
        const data = request.body;
        const result = await client
            .db("blogapp")
            .collection("blogs")
            .updateOne({ _id: id }, { $set: data });
        response.json(result);
    } catch (error){
        console.log(error);
        return response.json(error.message)
    }
    
});

export default router;