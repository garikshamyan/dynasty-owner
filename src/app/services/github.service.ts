import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GithubService {
  constructor(private httpClient: HttpClient ) {
  }

  getRepo(owner: string, repo: string) {
    return this.httpClient.get(`https://api.github.com/repos/${owner}/${repo}`);
  }

  getRepoBranches(owner: string, repo: string) {
    return this.httpClient.get(`https://api.github.com/repos/${owner}/${repo}/branches`);
  }
  getBranchCommits(owner: string, repo: string, page = 1, itemPerPage = 30, branch = 'master') {
    return this.httpClient.get(`https://api.github.com/repos/${owner}/${repo}/commits?sha=${branch}&page=${page}&per_page=${itemPerPage}`);
  }

}
