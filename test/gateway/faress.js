import http from "node:http";
// import { Router } from "./route.js";

const faress = () => {

    const app = {};
    const middlewares = [];
    const routes = [];

    app.use = (prefixOrMiddleware, maybeRouter) => {
        if (maybeRouter) {
            maybeRouter.routes.forEach(r => {
                routes.push({
                    method: r.method,
                    path: (r.path === null ? prefixOrMiddleware : prefixOrMiddleware + r.path),
                    handlers: r.handlers
                });
            });
        } else {
            middlewares.push(prefixOrMiddleware);
        }
    };

    ["GET", "POST", "PUT", "DELETE", "PATCH"].forEach(method => {
        app[method.toLowerCase()] = (path, ...handlers) => {
            routes.push({ method, path, handlers });
        };
    });

    const runHandlers = (handlers, req, res, err) => {
        let index = 0;

        const next = (error) => {
            const handler = handlers[index++];
            if (!handler) {
                if (error) return runErrorMiddlewares(error, req, res);
                return;
            };

            try {
                if (error) {
                    if (handler.length === 4) return handler(error, req, res, next);
                    else next(error);
                } else {
                    if (handler.length < 4) return handler(req, res, next);
                    else next();
                };
            } catch (err) {
                next(err);
            };
        };
        next(err);
    };

    const runErrorMiddlewares = (err, req, res) => {
        const errorHandlers = middlewares.filter(mw => mw.length === 4);
        if (!errorHandlers.length) {
            return res.status(500).json({ error: err.message });
        }
        runHandlers(errorHandlers, req, res, err);
    };

    const handleRequest = (req, res) => {
        const url = new URL(req.url, `http://${req.headers.host}`);
        req.path = url.pathname;
        req.query = Object.fromEntries(url.searchParams);

        res.send = (body) => {
            if (typeof body === "object") {
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify(body));
            } else {
                res.setHeader("Content-Type", "text/plain");
                res.end(body);
            }
        };

        res.json = (obj) => {
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(obj));
        };

        res.status = (code) => {
            res.statusCode = code;
            return res;
        };

        const parseBody = (callback) => {
            if (["POST", "PUT"].includes(req.method)) {
                let body = "";
                req.on("data", chunk => body += chunk);
                req.on("end", () => {
                    if (req.headers["content-type"]?.includes("application/json")) {
                        try {
                            req.body = JSON.parse(body);
                        } catch (e) {
                            return runErrorMiddlewares(new Error("JSON inválido"), req, res);
                        }
                    }
                    callback();
                });
            } else {
                callback();
            }
        };

        const runPipeline = () => {
            const route = routes.find(r => {
                const paramNames = [];
                const regexPath = r.path.replace(/:([^\/]+)/g, (_, key) => {
                    paramNames.push(key);
                    return "([^\\/]+)";
                });
                const match = req.path.match(new RegExp(`^${regexPath}$`));
                if (match) {
                    req.params = {};
                    paramNames.forEach((name, i) => req.params[name] = match[i + 1]);
                    return true;
                }
                return false;
            });

            let handlers = [...middlewares.filter(mw => mw.length < 4)];
            if (route) handlers.push(...route.handlers);
            else handlers.push((req, res) => res.status(404).send("Not Found"));
            runHandlers(handlers, req, res);
        };
        parseBody(runPipeline);
    };

    app.listen = (port, callback) => {
        const server = http.createServer(handleRequest);
        server.listen(port, callback);
    };

    return app;
};

// faress.Router = Router;

export default faress;