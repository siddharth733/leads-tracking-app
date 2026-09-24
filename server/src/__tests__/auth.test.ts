import { describe, it, expect, beforeEach, afterEach } from "vitest";
import request from "supertest";
import app from "../app.js";

describe("Basic Auth Middleware", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("should allow request when BASIC_AUTH_ENABLED is false", async () => {
    process.env.BASIC_AUTH_ENABLED = "false";
    const response = await request(app).get("/api/leads");
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it("should return 401 when BASIC_AUTH_ENABLED is true and no Authorization header is provided", async () => {
    process.env.BASIC_AUTH_ENABLED = "true";
    process.env.BASIC_AUTH_USER = "admin";
    process.env.BASIC_AUTH_PASS = "password";

    const response = await request(app).get("/api/leads");
    expect(response.status).toBe(401);
    expect(response.headers["www-authenticate"]).toBe('Basic realm="Leads API"');
    expect(response.body.message).toBe("Authentication required");
  });

  it("should return 401 when invalid credentials are provided", async () => {
    process.env.BASIC_AUTH_ENABLED = "true";
    process.env.BASIC_AUTH_USER = "admin";
    process.env.BASIC_AUTH_PASS = "password";

    const invalidCredentials = Buffer.from("wrong:credentials").toString("base64");
    const response = await request(app)
      .get("/api/leads")
      .set("Authorization", `Basic ${invalidCredentials}`);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid credentials");
  });

  it("should allow request when correct credentials are provided", async () => {
    process.env.BASIC_AUTH_ENABLED = "true";
    process.env.BASIC_AUTH_USER = "admin";
    process.env.BASIC_AUTH_PASS = "secret123";

    const validCredentials = Buffer.from("admin:secret123").toString("base64");
    const response = await request(app)
      .get("/api/leads")
      .set("Authorization", `Basic ${validCredentials}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it("should return 500 if basic auth is enabled but credentials env variables are missing", async () => {
    process.env.BASIC_AUTH_ENABLED = "true";
    delete process.env.BASIC_AUTH_USER;
    delete process.env.BASIC_AUTH_PASS;

    const credentials = Buffer.from("admin:password").toString("base64");
    const response = await request(app)
      .get("/api/leads")
      .set("Authorization", `Basic ${credentials}`);

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Basic authentication is not configured");
  });
});
