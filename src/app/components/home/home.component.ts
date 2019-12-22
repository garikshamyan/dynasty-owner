import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  repoForm: FormGroup;
  constructor(private router: Router, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.repoForm = new FormGroup({
      search: new FormControl(null, Validators.required)
    });
  }

  onFormSubmit() {
    const githubUrl = this.repoForm.value.search;
    const splitParts = githubUrl.split('/');
    if (splitParts.length > 1) {
      const repo = splitParts[splitParts.length - 1];
      const owner = splitParts[splitParts.length - 2];
      this.router.navigate([owner, repo]);
    } else {
      this.snackBar.open('Invalid or private repo', 'Close');
    }


  }

}
