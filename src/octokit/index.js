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
exports.AxiosOctokit = void 0;
const axios_1 = __importDefault(require("axios"));
const uri = 'https://api.github.com';
class AxiosOctokit {
    constructor(opts) {
        this.opts = opts;
    }
    baseUri(path) {
        return `${uri}/repos/${this.opts.repo}${path}`;
    }
    get(path) {
        return axios_1.default.get(this.baseUri(path), {
            headers: {
                Authorization: `token ${this.opts.token}`
            }
        });
    }
    post(path, body) {
        return axios_1.default.post(this.baseUri(path), body, {
            headers: {
                Authorization: `token ${this.opts.token}`,
                'Content-Type': 'application/json'
            }
        });
    }
    patch(path, body) {
        return axios_1.default.patch(this.baseUri(path), body, {
            headers: {
                Authorization: `token ${this.opts.token}`,
                'Content-Type': 'application/json'
            }
        });
    }
    loadContents(path, branch = 'main') {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.get(`/contents/${encodeURIComponent(path)}?ref=${branch}`);
            const content = atob(res.data['content']);
            return content;
        });
    }
    getCurrentRefData(branch = 'main') {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.get(`/git/ref/${encodeURIComponent(`heads/${branch}`)}`);
            return res.data;
        });
    }
    getCurrentCommitData(sha) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.get(`/git/commits/${sha}`);
            return res.data;
        });
    }
    createBlobForContent(content) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.post(`/git/blobs`, {
                encoding: 'utf-8',
                content,
            });
            return res.data;
        });
    }
    createNewTree(shas, paths, parentTreeSha) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.post(`/git/trees`, {
                tree: shas.map((sha, index) => ({
                    path: paths[index],
                    mode: `100644`,
                    type: `blob`,
                    sha,
                })),
                base_tree: parentTreeSha,
            });
            return res.data;
        });
    }
    createNewCommit(message, currentTreeSha, currentCommitSha) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.post(`/git/commits`, {
                message,
                tree: currentTreeSha,
                parents: [currentCommitSha]
            });
            return res.data;
        });
    }
    setBranchToCommit(sha, branch = 'main') {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.patch(`/git/refs/${encodeURIComponent(`heads/${branch}`)}`, {
                sha
            });
            return res.data;
        });
    }
    uploadToRepo(path, content, commitMessage, branch = 'main') {
        return __awaiter(this, void 0, void 0, function* () {
            const ref = yield this.getCurrentRefData(branch);
            const commit = yield this.getCurrentCommitData(ref.object.sha);
            const fileBlob = yield this.createBlobForContent(content);
            const newTree = yield this.createNewTree([fileBlob.sha], [path], commit.tree.sha);
            const newCommit = yield this.createNewCommit(commitMessage, newTree.sha, ref.object.sha);
            return this.setBranchToCommit(newCommit.sha, branch);
        });
    }
}
exports.AxiosOctokit = AxiosOctokit;
function atob(data) {
    return Buffer.from(data, 'base64').toString('utf8');
}
