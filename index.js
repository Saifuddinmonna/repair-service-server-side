//requires option are from here...
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
var colors = require("colors");
const app = express();
const port = process.env.PORT || 5000;

// middle wares are here
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.wuiqqjn.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	serverApi: ServerApiVersion.v1,
});

//jwt initialized......
function verifyJWT(req, res, next) {
	const authHeader = req.headers.authorization;

	if (!authHeader) {
		return res.status(401).send({ message: "unauthorized access" });
	}
	const token = authHeader.split(" ")[1];

	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
		if (err) {
			return res.status(403).send({ message: "Forbidden access" });
		}
		req.decoded = decoded;
		next();
	});
}

const serviceName = client.db("repairService").collection("servicesName");
const addServiceCollection = client
	.db("repairService")
	.collection("addServiceCollection");
const usersCommentCollection = client
	.db("repairService")
	.collection("usersCommentCollection");

//db connection start from here.......
async function dbconnect() {
	try {
		await client.connect();

		//home data loading from here.....
		console.log("db connected sucessfully".green);
		app.get("/home", async (req, res) => {
			try {
				const query = { runtime: { $lt: 4 } };
				const cursor = serviceName.find();
				const services = await cursor.toArray();
				services.splice(3);
				res.send(services);
			} catch (error) {
				console.log("i got a errrr".bgRed);
			}
		});

		//services route data load from here....

		app.get("/services", async (req, res) => {
			try {
				const query = { runtime: { $lt: 4 } };
				const cursor = serviceName.find();
				const services = await cursor.toArray();
				res.send(services);
			} catch (error) {
				console.log("i got a errrr".bgRed);
			}
		});

		//details by id data loadd here.......

		app.get("/services/:id", async (req, res) => {
			try {
				const { id } = req.params;

				const product = await serviceName.findOne({
					_id: ObjectId(id),
				});

				res.send({
					success: true,
					data: product,
				});
			} catch (error) {
				res.send({
					success: false,
					error: error.message,
				});
			}
		});

		//review delete update remove db start from here.....

		app.post("/services/addservice", async (req, res) => {
			try {
				const result = await addServiceCollection.insertOne(req.body);

				if (result.insertedId) {
					res.send({
						success: true,
						message: `Successfully created the ${req.body.name} with id ${result.insertedId}`,
					});
				} else {
					res.send({
						success: false,
						error: "Couldn't create the product",
					});
				}
			} catch (error) {
				console.log(error.name.bgRed, error.message.bold);
				res.send({
					success: false,
					error: error.message,
				});
			}
		});

		//token are loaded from .....for localstorage
		app.post("/jwt", (req, res) => {
			try {
				const user = req.body;
				const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
					expiresIn: "1d",
				});
				res.send({ token });
			} catch (error) {
				console.log("jwt arror".red);
			}
		});

		// myreview api start here ////.......
		app.get("/myreview", verifyJWT, async (req, res) => {
			try {
				const decoded = req.decoded;

				if (decoded.email !== req.query.email) {
					res.status(403).send({ message: "unauthorized access" });
				}

				let query = {};
				if (req.query.email) {
					query = {
						email: req.query.email,
					};
				}
				const cursor = addServiceCollection.find(query);
				const myreview = await cursor.toArray();
				res.send(myreview);
			} catch (error) {
				console.log("my review arror".red);
			}
		});

		app.post("/myreview", verifyJWT, async (req, res) => {
			try {
				const order = req.body;
				const result = await addServiceCollection.insertOne(order);
				res.send(result);
			} catch (error) {
				console.log("post my review arror".red);
			}
		});

		app.patch("/myreview/:id", verifyJWT, async (req, res) => {
			try {
				const id = req.params.id;
				const status = req.body.status;
				const query = { _id: ObjectId(id) };
				const updatedDoc = {
					$set: {
						status: status,
					},
				};
				const result = await addServiceCollection.updateOne(
					query,
					updatedDoc,
				);
				res.send(result);
			} catch (error) {
				console.log("myreview/:id review arror".red);
			}
		});

		app.delete("/myreview/:id", verifyJWT, async (req, res) => {
			try {
				const id = req.params.id;
				const query = { _id: ObjectId(id) };
				const result = await addServiceCollection.deleteOne(query);
				res.send(result);
			} catch (error) {
				console.log(error.name.bgRed, error.message.bold);
			}
		});

		//users comment added here

		app.get("/userscomments", async (req, res) => {
			try {
				const query = { runtime: { $lt: 4 } };
				const cursor = usersCommentCollection.find();
				const services = await cursor.toArray();
				res.send(comments);
			} catch (error) {
				console.log("i got a errrr on comments".bgRed);
			}
		});

		app.delete("/userscomments/:id", verifyJWT, async (req, res) => {
			try {
				const id = req.params.id;
				const query = { _id: ObjectId(id) };
				const result = await usersCommentCollection.deleteOne(query);
				res.send(result);
			} catch (error) {
				console.log(error.name.bgRed, error.message.bold);
			}
		});
	} catch (error) {
		console.log('error :this is main error'.bgRed)
		res.send({
			success: false,
			error: error.message,
		});
	}
		
	
}

dbconnect().catch((err) => console.error(err,'this is  error form runnin function and last'));

// 		ap

app.get("/", (req, res) => {
	res.send("repair service is running");
});

app.listen(port, () => {
	console.log(`repair service running on ${port}`);
});
//rejpair services end here..........................
