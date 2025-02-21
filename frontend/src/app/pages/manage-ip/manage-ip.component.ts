import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-manage-ip',
  imports: [MatTableModule, MatIconModule],
  templateUrl: './manage-ip.component.html',
  styleUrl: './manage-ip.component.scss'
})
export class ManageIpComponent {
  displayedColumns: string[] = ['id', 'ipAddress', 'actions'];
  ipAddresses = [
    { id: 1, ipAddress: '192.168.1.1' },
    { id: 2, ipAddress: '192.168.1.2' },
    { id: 3, ipAddress: '192.168.1.3' }
  ];

  editIp(ip: any) {
    console.log('Edit IP:', ip);
  }

  deleteIp(id: number) {
    this.ipAddresses = this.ipAddresses.filter(ip => ip.id !== id);
  }
}
