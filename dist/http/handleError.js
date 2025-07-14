"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HandleError = HandleError;
const axios_1 = require("axios");
function HandleError(error, request, reply) {
    if (error instanceof axios_1.AxiosError) {
        const status = error.response?.status || 500;
        const message = error.response?.data?.error || error.message || "Axios Error";
        return reply.status(status).send({
            error: message,
        });
    }
    console.error("(Internal Server Error)", error);
    return reply.status(500).send({
        error: "Internal Server Error",
    });
}
