"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateYamlAction = exports.updateYaml = void 0;
const jsonpath_1 = __importDefault(require("jsonpath"));
const yaml_1 = require("yaml");
const octokit_1 = require("./octokit");
function updateYaml(content, propertyPath, value) {
    const data = (0, yaml_1.parse)(content);
    jsonpath_1.default.value(data, propertyPath, value);
    return (0, yaml_1.stringify)(data);
}
exports.updateYaml = updateYaml;
function updateYamlAction(action) {
    return __awaiter(this, void 0, void 0, function* () {
        const octo = new octokit_1.AxiosOctokit({
            token: action.token,
            repo: action.repo,
        });
        const content = yield octo.loadContents(action.valueFile, action.ref);
        const updated = updateYaml(content, action.propertyPath, action.value);
        const { url, ref } = yield octo.uploadToRepo(action.valueFile, updated, action.msg, action.ref);
        return { url, ref };
    });
}
exports.updateYamlAction = updateYamlAction;
