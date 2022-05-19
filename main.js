const express = require("express");
const cors = require("cors");
const Database = require("@replit/database");
const app = express();
const db = new Database();

app.use(cors());

app.get("/", function(request, response) {
    response.json({
        status: "ok",
        dfws: "0.1.0"
    });
});

app.get("/broadcasting/:channel", function(request, response) {
    var channel = String(request.params.channel || "").toLowerCase();

    if (!channel.match(/^[a-z0-9_]{1,20}$/)) {
        response.status(404);

        response.json({
            status: "error",
            code: "broadcastingInvalidChannelName",
            message: "The specified broadcasting channel name is invalid"
        });

        return;
    }

    db.get(`broadcastingChannels.${channel}`).then(function(value) {
        if (value == null) {
            response.status(404);

            response.json({
                status: "error",
                code: "broadcastingChannelNotFound",
                message: "The specified broadcasting channel was not found"
            });

            return;
        }

        response.json({
            status: "ok",
            id: (value || {}).id
        });
    });
});

app.post("/broadcasting/:channel", function(request, response) {
    var channel = String(request.params.channel || "").toLowerCase();

    if (!channel.match(/^[a-z0-9_]{1,20}$/)) {
        response.status(404);

        response.json({
            status: "error",
            code: "broadcastingInvalidChannelName",
            message: "The specified broadcasting channel name is invalid"
        });

        return;
    }

    db.get(`broadcastingChannels.${channel}`).then(function(value) {
        if (value != null) {
            response.status(409);

            response.json({
                status: "error",
                code: "broadcastingChannelExists",
                message: "The specified broadcasting channel already exists"
            });

            return;
        }

        return db.set(`broadcastingChannels.${channel}`, {
            id: String(request.query.id || ""),
            dateCreated: Date.now()
        }).then(function() {
            response.json({
                status: "ok",
                id: (value || {}).id
            });
        });
    });
});

app.listen(443, function() {
    console.log("Listening on port 443");
});