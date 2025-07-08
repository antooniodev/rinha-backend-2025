"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HandleError = HandleError;
function HandleError(error, request, reply) {
    console.error("(Internal Server Error)", error);
    return reply.status(500).send({
        error: "Internal Server Error",
    });
}
