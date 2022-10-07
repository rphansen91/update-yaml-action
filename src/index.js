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
const update_1 = require("./update");
const core_1 = __importDefault(require("@actions/core"));
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const action = {
            repo: core_1.default.getInput("repo"),
            ref: core_1.default.getInput("ref"),
            msg: core_1.default.getInput("msg"),
            valueFile: core_1.default.getInput("valueFile"),
            propertyPath: core_1.default.getInput("propertyPath"),
            value: core_1.default.getInput("value"),
            token: core_1.default.getInput("token"),
        };
        const { ref } = yield (0, update_1.updateYamlAction)(action);
        core_1.default.setOutput('ref', ref);
    });
}
main()
    .then(() => { })
    .catch((err) => {
    const error = err;
    core_1.default.setFailed(error.message);
});
