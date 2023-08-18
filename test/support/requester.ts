import request from "supertest";
import app from "src/app";

const requester = request(app);

export default requester;
