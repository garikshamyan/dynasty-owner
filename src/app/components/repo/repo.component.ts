import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GithubService } from '../../services/github.service';
import { forkJoin } from 'rxjs';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-repo',
  templateUrl: './repo.component.html',
  styleUrls: ['./repo.component.css']
})
export class RepoComponent implements OnInit {
  repo;
  branches;
  commitsColumns: string[] = ['avatar', 'author', 'sha', 'message', 'date'];
  commits = [];
  itemsPerPage = 30;
  totalCommits = 1e6;
  pageCommits = 1;
  branch: string;
  constructor(private route: ActivatedRoute, private github: GithubService, private router: Router, private snackBar: MatSnackBar) { }

  ngOnInit() {
    const owner = this.route.snapshot.params.owner;
    const repo = this.route.snapshot.params.repo;
    forkJoin<any, any, any>([
      this.github.getRepo(owner, repo),
      this.github.getRepoBranches(owner, repo),
      this.github.getBranchCommits(owner, repo)
    ]).subscribe(([repoInfo, branches, commits]) => {
      this.repo = repoInfo;
      this.branches = branches;
      this.commits = commits.map(commit => {
        return {
          avatar: commit.committer.avatar_url,
          author: commit.commit.author.name,
          sha: commit.sha,
          message: commit.commit.message,
          date: commit.commit.committer.date
        };
      });
      if (this.commits.length < this.itemsPerPage) {
        this.totalCommits = this.pageCommits * this.itemsPerPage;
       } else {
        this.totalCommits = 1e6;
      }
    }, err => {
      this.router.navigate(['/']);
      this.snackBar.open('Invalid or private repo', 'Close');
    });
  }

  onBranchChange(selectionchange) {
   if (selectionchange && selectionchange.value) {
     this.branch = selectionchange.value;
     this.getCommits();
   }
  }

  getCommits() {
   this.github.getBranchCommits(this.route.snapshot.params.owner, this.route.snapshot.params.repo, this.pageCommits, this.itemsPerPage,  this.branch).subscribe((res: any[]) => {
     this.commits = res.map(commit => {
       console.log(commit.commit.committer.avatar_url);
       return {
         avatar: commit.committer.avatar_url,
         author: commit.commit.author.name,
         sha: commit.sha,
         message: commit.commit.message,
         date: commit.commit.committer.date
       };
     });
   });
  }

  onPage(event) {
    if (event.pageSize !== this.itemsPerPage) {
      this.itemsPerPage = event.pageSize;
      this.pageCommits = 1;
    } else {
      this.pageCommits = event.pageIndex + 1;
    }
    this.getCommits();
  }

}
