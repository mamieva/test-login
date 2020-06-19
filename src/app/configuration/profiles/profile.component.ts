import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar, MatSnackBarConfig, MatTable, MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatPaginator } from '@angular/material';
import { ProfileService } from '../../services/profile.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements OnInit {
  displayColumns: any;
  attribute: any;
  model: any;
  type: any;
  certificates: any;
  sex: any;
  docNumber: any;
  officeId: any;
  certificateTypes: any[] = [];
  offices: any[] = [];
  office: any;
  operatorOffice: any = JSON.parse(localStorage.getItem('currentUser')).authToken.claims.scopes.offices;
  profileId: any;
  profile: any = {};
  actions: any;
  assignedActions: any[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private profileService: ProfileService,
    private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.profileId = params.id;
    });
    if (this.profileId) {
      this.profileService.getProfile(this.profileId).subscribe((response: any) => {
        this.profile = response;
      }, error => {
        this.snackBarMessage(error.error.message, 4000);
      });
    }
  }

  deleteProfile() {
    this.profileService.deleteProfile(this.profile.id).subscribe((response: any) => {
      this.snackBarMessage('El perfil se eliminó correctamente', 5000);
      this.router.navigateByUrl('/configuration/profileConfig');
    }, error => {
      this.snackBarMessage(error.error.message, 5000);
    });
  }

  backPage() {
    window.history.back();
  }
  assignRol(row: any) {
    this.profileService.postRol(this.profile, row.id).subscribe((response: any) => {
      this.profile.roles = response.roles;
    }, error => {
      this.snackBarMessage(error.error.message, 5000);
    });
  }

  unassignRol(row: any) {
    this.profileService.deleteRol(this.profile, row.id).subscribe((response: any) => {
      this.profile.roles = response.roles;
    }, error => {
      this.snackBarMessage(error.error.message, 5000);
    });
  }

  updateProfile() {
    if (!this.profile.name) {
      this.snackBarMessage('Rellene el nombre nombre', 5000);
      return;
    }
    if (!this.profile.description) {
      this.snackBarMessage('Rellene el campo descripción', 5000);
      return;
    }

    this.profileService.updateProfile(this.profile).subscribe((response: any) => {
      this.profile = response;
      this.activeProfile(this.profile);
      this.snackBarMessage('Perfil actualizado con éxito', 5000);
    }, error => {
      this.snackBarMessage(error.error.message, 5000);
    });
  }

  activeProfile(profile: any) {
    this.profileService.activeProfile(profile).subscribe((response: any) => {
      this.profile = response;
    }, error => {
      this.snackBarMessage(error.error.message, 5000);
    });
  }

  createProfile() {
    if (!this.profile.name) {
      this.snackBarMessage('Rellene el nombre nombre', 5000);
      return;
    }
    if (!this.profile.description) {
      this.snackBarMessage('Rellene el campo descripción', 5000);
      return;
    }

    this.profileService.createProfile(this.profile).subscribe((response: any) => {
      this.profile = response;
      this.snackBarMessage('Perfil creado con éxito', 5000);
    }, error => {
      this.snackBarMessage(error.error.message, 5000);
    });
  }

  snackBarMessage(msg: any, duration: any) {
    this.snackBar.open(msg, '', {
      duration: duration,    panelClass: ['blue-snackbar']
    });
  }
}
