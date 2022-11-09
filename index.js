const express = require("express");
const cors = require("cors");
// const jwt = require("jsonwebtoken");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
var colors = require("colors");
const app = express();
const port = process.env.PORT || 5000;

// middle wares
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.wuiqqjn.mongodb.net/?retryWrites=true&w=majority`;
// const uri =
// 	"mongodb+srv://<username>:<password>@cluster0.wuiqqjn.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	serverApi: ServerApiVersion.v1,
});

// function verifyJWT(req, res, next) {
// 	const authHeader = req.headers.authorization;

// 	if (!authHeader) {
// 		return res.status(401).send({ message: "unauthorized access" });
// 	}
// 	const token = authHeader.split(" ")[1];

// 	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
// 		if (err) {
// 			return res.status(403).send({ message: "Forbidden access" });
// 		}
// 		req.decoded = decoded;
// 		next();
// 	});
// }

const serviceName = client.db("repairService").collection("servicesName");
async function dbconnect() {
	try {
		await client.connect();

		
		console.log("db connected sucessfully".green);
	}
	catch (error) {
		console.log(error.name.bgRed,error.message.bold)
	}
}
 
dbconnect();

	
		
		

		app.get("/servicename", async (req, res) => {
			try {
				const query = { runtime: { $lt: 15 } };
				const cursor = serviceName.find();
				const services = await cursor.toArray();
				res.send(services);

				
			}
		 catch (error) {
		console.log( "i got a errrr".bgRed);
	        }
		});
		



// 		app.post("/jwt", (req, res) => {
// 			const user = req.body;
// 			const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
// 				expiresIn: "1d",
// 			});
// 			res.send({ token });
// 		});
// 		app.get("/services", async (req, res) => {
// 			const query = {};
// 			const cursor = serviceCollection.find(query);
// 			const services = await cursor.toArray();
// 			res.send(services);
// 		});
// 		app.get("/services/:id", async (req, res) => {
// 			const id = req.params.id;
// 			const query = { _id: ObjectId(id) };
// 			const service = await serviceCollection.findOne(query);
// 			res.send(service);
// 		});
// 		// orders api
// 		app.get("/orders", verifyJWT, async (req, res) => {
// 			const decoded = req.decoded;
// 			if (decoded.email !== req.query.email) {
// 				res.status(403).send({ message: "unauthorized access" });
// 			}
// 			let query = {};
// 			if (req.query.email) {
// 				query = {
// 					email: req.query.email,
// 				};
// 			}
// 			const cursor = orderCollection.find(query);
// 			const orders = await cursor.toArray();
// 			res.send(orders);
// 		});
// 		app.post("/orders", verifyJWT, async (req, res) => {
// 			const order = req.body;
// 			const result = await orderCollection.insertOne(order);
// 			res.send(result);
// 		});
// 		app.patch("/orders/:id", verifyJWT, async (req, res) => {
// 			const id = req.params.id;
// 			const status = req.body.status;
// 			const query = { _id: ObjectId(id) };
// 			const updatedDoc = {
// 				$set: {
// 					status: status,
// 				},
// 			};
// 			const result = await orderCollection.updateOne(query, updatedDoc);
// 			res.send(result);
// 		});
// 		app.delete("/orders/:id", verifyJWT, async (req, res) => {
// 			const id = req.params.id;
// 			const query = { _id: ObjectId(id) };
// 			const result = await orderCollection.deleteOne(query);
// 			res.send(result);
// 		});
// }

// run().catch((err) => console.error(err));

app.get("/", (req, res) => {
	res.send("repair service is running");
});

app.listen(port, () => {
	console.log(`repair service running on ${port}`);
});
