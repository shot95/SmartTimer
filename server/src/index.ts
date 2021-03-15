import { app, port, submitHandler } from "./routes";


submitHandler.start().then(() => {
    app.listen(port, () => {
        console.log(`Server startet at http://localhost:${port}`);
    })
}).catch((error) => {
    console.log(error);
});