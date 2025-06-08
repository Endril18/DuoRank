import { Request, Response, NextFunction } from "express";

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);

  // Tratamento para diferentes tipos de erro
  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: "Erro de validação",
      details: err.message
    });
  }

  res.status(500).json({
    success: false,
    message: "Erro interno no servidor"
  });
};

export default errorHandler;