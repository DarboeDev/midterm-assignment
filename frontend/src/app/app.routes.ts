import { Routes } from '@angular/router';
import { AuthComponent } from './components/auth/auth.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { EditorPanelComponent } from './components/editor-panel/editor-panel.component';
import { ViewerPanelComponent } from './components/viewer-panel/viewer-panel.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

export const routes: Routes = [
  { path: 'auth', component: AuthComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard], // Only authenticated users can access dashboard
    children: [
      { path: '', redirectTo: 'viewer-content', pathMatch: 'full' }, // Default sub-route
      {
        path: 'admin',
        component: AdminPanelComponent,
        canActivate: [RoleGuard],
        data: { roles: ['admin'] }, // Only Admin can access
      },
      {
        path: 'editor',
        component: EditorPanelComponent,
        canActivate: [RoleGuard],
        data: { roles: ['admin', 'editor'] }, // Admin or Editor
      },
      {
        path: 'viewer-content',
        component: ViewerPanelComponent,
        canActivate: [RoleGuard],
        data: { roles: ['admin', 'editor', 'viewer'] }, // All logged-in users
      },
    ],
  },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/dashboard' }, // Wildcard route for unknown paths
];
