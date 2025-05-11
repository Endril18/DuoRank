"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const PoliglotasController_1 = __importDefault(require("../controllers/PoliglotasController"));
// Middleware para tratar funções assíncronas corretamente
const asyncHandler = (fn) => (req, res, next) => {
    return Promise.resolve(fn(req, res, next)).catch(next);
};
const routes = (0, express_1.Router)();
// 🔹 Agora a rota recebe `username` como parâmetro corretamente
routes.get("/:username", asyncHandler((req, res) => PoliglotasController_1.default.buscar(req, res)));
routes.put("/:id", asyncHandler((req, res) => PoliglotasController_1.default.editar(req, res)));
routes.delete("/:id", asyncHandler((req, res) => PoliglotasController_1.default.remover(req, res)));
routes.get("/", asyncHandler((req, res) => PoliglotasController_1.default.listar(req, res)));
routes.put("/atualizar-todos", asyncHandler((req, res) => PoliglotasController_1.default.atualizarTodos(req, res)));
exports.default = routes;
