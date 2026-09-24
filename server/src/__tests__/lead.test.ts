import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import app from "../app.js";
import { prisma } from "../lib/prisma.js";

describe("Leads API Endpoints", () => {
  let createdLeadId: number;

  beforeAll(async () => {
    process.env.BASIC_AUTH_ENABLED = "false";
    // Clean up existing test data
    await prisma.note.deleteMany();
    await prisma.lead.deleteMany();
  });

  afterAll(async () => {
    await prisma.note.deleteMany();
    await prisma.lead.deleteMany();
    await prisma.$disconnect();
  });

  it("POST /api/leads - should create a new lead successfully (201)", async () => {
    const response = await request(app)
      .post("/api/leads")
      .send({
        name: "Test Lead",
        email: "test.lead@example.com",
        phone: "+1-555-9999",
        status: "new",
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty("id");
    expect(response.body.data.name).toBe("Test Lead");
    expect(response.body.data.email).toBe("test.lead@example.com");

    createdLeadId = response.body.data.id;
  });

  it("POST /api/leads - should fail validation for invalid email (400)", async () => {
    const response = await request(app)
      .post("/api/leads")
      .send({
        name: "Invalid Lead",
        email: "invalid-email-format",
        phone: "+1-555-9999",
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.errors).toHaveProperty("email");
  });

  it("GET /api/leads - should retrieve list of leads (200)", async () => {
    const response = await request(app).get("/api/leads");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBeGreaterThan(0);
  });

  it("GET /api/leads?search=Test - should filter leads by search term (200)", async () => {
    const response = await request(app).get("/api/leads?search=Test");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.length).toBe(1);
    expect(response.body.data[0].name).toBe("Test Lead");
  });

  it("GET /api/leads/:id - should return a single lead by ID (200)", async () => {
    const response = await request(app).get(`/api/leads/${createdLeadId}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.id).toBe(createdLeadId);
  });

  it("GET /api/leads/:id - should return 404 for non-existent lead", async () => {
    const response = await request(app).get("/api/leads/999999");

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
  });

  it("PATCH /api/leads/:id - should update lead status (200)", async () => {
    const response = await request(app)
      .patch(`/api/leads/${createdLeadId}`)
      .send({ status: "contacted" });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.status).toBe("contacted");
  });

  it("PATCH /api/leads/:id - should return 404 when updating non-existent lead", async () => {
    const response = await request(app)
      .patch("/api/leads/999999")
      .send({ status: "qualified" });

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
  });

  it("POST /api/leads/:id/notes - should add a note to lead (201)", async () => {
    const response = await request(app)
      .post(`/api/leads/${createdLeadId}/notes`)
      .send({ content: "Initial discussion completed." });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.content).toBe("Initial discussion completed.");
    expect(response.body.data.leadId).toBe(createdLeadId);
  });

  it("GET /api/leads/:id/notes - should fetch notes for a lead (200)", async () => {
    const response = await request(app).get(`/api/leads/${createdLeadId}/notes`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBe(1);
  });

  it("DELETE /api/leads/:id - should delete a lead (204)", async () => {
    const response = await request(app).delete(`/api/leads/${createdLeadId}`);

    expect(response.status).toBe(204);
  });

  it("DELETE /api/leads/:id - should return 404 when deleting non-existent lead", async () => {
    const response = await request(app).delete("/api/leads/999999");

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
  });
});
