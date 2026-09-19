const http = require("http");
const fs = require("fs");
const OpenAI = require("openai");

const client = new OpenAI();

const server = http.createServer(async (req, res) => {

    // Unsere Webseite anzeigen
    if (req.method === "GET" && req.url === "/") {

        fs.readFile("index.html", "utf8", (err, data) => {

            if (err) {
                res.writeHead(500, {
                    "Content-Type": "text/plain; charset=utf-8"
                });

                res.end("Fehler beim Laden der Webseite.");
                return;
            }

            res.writeHead(200, {
                "Content-Type": "text/html; charset=utf-8"
            });

            res.end(data);
        });

        return;
    }


    // Nachricht an die KI
    if (req.method === "POST" && req.url === "/api/chat") {

        let body = "";

        req.on("data", chunk => {
            body += chunk;
        });

        req.on("end", async () => {

            try {

                const data = JSON.parse(body);
                const message = data.message;

                const response = await client.responses.create({

                    model: "gpt-5.6-luna",

                    instructions:
                        "Du bist SmileyFaceAI. Antworte freundlich, hilfreich und verständlich auf Deutsch.",

                    input: message
                });

                res.writeHead(200, {
                    "Content-Type": "application/json; charset=utf-8"
                });

                res.end(JSON.stringify({
                    reply: response.output_text
                }));

            } catch (error) {

                console.error(error);

                res.writeHead(500, {
                    "Content-Type": "application/json; charset=utf-8"
                });

                res.end(JSON.stringify({
                    reply: "Entschuldigung, es ist ein Fehler aufgetreten."
                }));
            }
        });

        return;
    }


    // Alles andere
    res.writeHead(404, {
        "Content-Type": "text/plain; charset=utf-8"
    });

    res.end("Nicht gefunden.");
});


server.listen(3000, "127.0.0.1", () => {

    console.log("SmileyFaceAI läuft auf http://127.0.0.1:3000");

});