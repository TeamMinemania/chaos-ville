import 'reflect-metadata';
import app from "@functions/discord/app";
(async () => {
    app.listen(8080)
})();