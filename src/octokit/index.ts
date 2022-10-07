import axios from 'axios'
const uri = 'https://api.github.com'

export type AxiosOctokitOpts = {
  token: string
  repo: string
}

export class AxiosOctokit {
  constructor (public opts: AxiosOctokitOpts) {}

  baseUri (path: string) {
    return `${uri}/repos/${this.opts.repo}${path}`
  }

  private get (path: string) {
    return axios.get(this.baseUri(path), {  
      headers: {
        Authorization: `token ${this.opts.token}`
      }
    })
  }

  private post<B>(path: string, body: B) {
    return axios.post(this.baseUri(path), body, {  
      headers: {
        Authorization: `token ${this.opts.token}`,
        'Content-Type': 'application/json'
      }
    })
  }
  
  private patch<B>(path: string, body: B) {
    return axios.patch(this.baseUri(path), body, {  
      headers: {
        Authorization: `token ${this.opts.token}`,
        'Content-Type': 'application/json'
      }
    })
  }

  async loadContents (path: string, branch = 'main') {
    const res = await this.get(`/contents/${encodeURIComponent(path)}?ref=${branch}`)
    const content = atob((res.data as any)['content'])
    return content
  }

  async getCurrentRefData (branch = 'main') {
    const res = await this.get(`/git/ref/${encodeURIComponent(`heads/${branch}`)}`)
    return res.data
  }
  
  async getCurrentCommitData (sha: string) {
    const res = await this.get(`/git/commits/${sha}`)
    return res.data
  }

  async createBlobForContent (content: string) {
    const res = await this.post(`/git/blobs`, {
      encoding: 'utf-8',
      content,
    })
    return res.data
  }
  
  async createNewTree (shas: string[], paths: string[], parentTreeSha: string) {
    const res = await this.post(`/git/trees`, {
      tree: shas.map((sha, index) => ({
        path: paths[index],
        mode: `100644`,
        type: `blob`,
        sha,
      })),
      base_tree: parentTreeSha,
    })
    return res.data
  }
  
  async createNewCommit (message: string, currentTreeSha: string, currentCommitSha: string) {
    const res = await this.post(`/git/commits`, {
      message,
      tree: currentTreeSha,
      parents: [currentCommitSha]
    })
    return res.data
  }
  
  async setBranchToCommit (sha: string, branch = 'main') {
    const res = await this.patch(`/git/refs/${encodeURIComponent(`heads/${branch}`)}`, {
      sha
    })
    return res.data
  }

  async uploadToRepo (path: string, content: string, commitMessage: string, branch = 'main') {
    const ref = await this.getCurrentRefData(branch)
    const commit = await this.getCurrentCommitData(ref.object.sha)
    const fileBlob = await this.createBlobForContent(content)
    const newTree = await this.createNewTree([fileBlob.sha], [path], commit.tree.sha)
    const newCommit = await this.createNewCommit(commitMessage, newTree.sha, ref.object.sha)

    return this.setBranchToCommit(newCommit.sha, branch)
  }
}

function atob(data: string) {
  return Buffer.from(data, 'base64').toString('utf8')
}

