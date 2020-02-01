import { Component, OnInit } from '@angular/core';
import { EquipmentService } from '../../shared/equipment/equipment.service'
@Component({
  selector: 'app-cold-list',
  templateUrl: './cold-list.component.html',
  styleUrls: ['./cold-list.component.css']
})
export class ColdListComponent implements OnInit {
  cold;
  constructor(private equipmentService: EquipmentService) { }

  ngOnInit() {
    this.equipmentService.getEquipment().subscribe(response=>{
      this.cold = response
      this.cold.map(x=>{
        this.cold = x
      })
    })
  }

}
