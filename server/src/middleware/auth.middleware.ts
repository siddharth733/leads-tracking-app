import type { Request, Response, NextFunction } from "express";

export const basicAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authEnabled = process.env.BASIC_AUTH_ENABLED === "true";

  if (!authEnabled) {
    return next();
  }

  res.setHeader("WWW-Authenticate", 'Basic realm="Leads API"');

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Basic ")) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  const encodedCredentials = authHeader.slice(6);

  const decodedCredentials = Buffer.from(
    encodedCredentials,
    "base64",
  ).toString("utf8");

  const separatorIndex = decodedCredentials.indexOf(":");

  if (separatorIndex === -1) {
    return res.status(401).json({
      success: false,
      message: "Invalid authorization header",
    });
  }

  const username = decodedCredentials.slice(0, separatorIndex);
  const password = decodedCredentials.slice(separatorIndex + 1);

  const expectedUser = process.env.BASIC_AUTH_USER;
  const expectedPass = process.env.BASIC_AUTH_PASS;

  if (!expectedUser || !expectedPass) {
    return res.status(500).json({
      success: false,
      message: "Basic authentication is not configured",
    });
  }

  if (username === expectedUser && password === expectedPass) {
    return next();
  }

  return res.status(401).json({
    success: false,
    message: "Invalid credentials",
  });
};