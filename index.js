const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.swu9d.mongodb.net/?retryWrites=true&w=majority`;

const uri =
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@myprojectscluster.drcktji.mongodb.net/?retryWrites=true&w=majority`;
// const uri = "mongodb+srv://tnmy_srkr:877smORJET4ct5n4@myprojectscluster.drcktji.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
  // client.connect();

    const productCollection = client.db("emaJohnDB").collection("products");

    //pagination start =================================================================
    app.get("/products", async (req, res) => {
      const page = parseInt(req.query.page);
      const size = parseInt(req.query.size);
      // console.log("pagination query" ,req.query);
      // console.log(page, size);
      const result = await productCollection
        .find()
        .skip(page * size)
        .limit(size)
        .toArray();
      res.send(result);
      //now orders page e all data load hocche eta fixed korte hobe
    });

    //order page e jate sob data na load hoi
    app.post("/productByIds", async (req, res) => {
      const ids = req.body;
      const idsWithObjectId = ids.map((id) => new ObjectId(id));
      const query = {
        _id: {
          $in: idsWithObjectId,
        },
      };
      // console.log(idsWithObjectId);
      const result = await productCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/productsCount", async (req, res) => {
      const count = await productCollection.estimatedDocumentCount();
      res.send({ count });
    });

    // Send a ping to confirm a successful connection
  client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("john is busy to do shopping");
});

app.listen(port, () => {
  console.log(`ema john server is running on port: ${port}`);
});
