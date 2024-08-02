import { Hono } from "hono";
import DocumentStore from "ravendb";
const app = new Hono();

app.get("/users/:name", async (c) => {

	const name = c.req.param("name");

	const store = new DocumentStore("http://live-test.ravendb.net", "db1");
	store.initialize();

	const session = store.openSession();
	await session.store({ name: "TEST"}, name);
	await session.saveChanges();

	const query = session.query("@empty");
	const s = await session.advanced.stream(query);

	s.on("data", d => {
		console.log(d);
	});

	await new Promise(resolve => {
		s.on("end", resolve);
	});

	return c.json({
		name
	});
});

export default app;

