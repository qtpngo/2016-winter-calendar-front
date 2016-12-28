import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import '../rxjs-operator';

import { Goal, Repetition, EndDate } from '../shared/goal';
import { GoalService } from '../goal/goal.service';

@Component({
    selector: 'app-month-view',
    templateUrl: './month-view.component.html',
    styleUrls: ['./month-view.component.scss']
})
export class MonthViewComponent implements OnInit {
    private goal: Goal;
    constructor(private route: ActivatedRoute,
        private router: Router,
        private goalService: GoalService) { }

    ngOnInit() {
        this.route.params.switchMap((params: Params) => this.goalService.getGoalsById(params['id']))
            .subscribe((res) => {
                this.goal = res.json();
            }, error => console.log(error));
        this.displayCalendar(new Date().getMonth(), new Date().getFullYear());
    }

    displayGoalOnCalendar(){
      // let date = this.goal
    }

    getMonthName(month: number) {
        let monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        for (let i in monthNames) {
            if (i == month + "") {
                return monthNames[i];
            }
        }
    }
    getMonth(monthName: string) {
        let monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        return monthNames.indexOf(monthName);
    }

    displayCalendar(month, fullYear) {
        let monthName = <HTMLElement>document.getElementById('monthName');
        let year = <HTMLElement>document.getElementById('year');
        monthName.innerHTML = this.getMonthName(month);
        year.innerHTML = fullYear;
        let today = new Date();
        let firstDay = new Date(fullYear, month, 1);
        let lastDay = month < 11 ? new Date(fullYear, month + 1, 0) : new Date(fullYear + 1, 0, 0);
        let spaceBefore = firstDay.getDay() == 0 ? 6 : (firstDay.getDay() - 1);
        for (let i = 1; i <= spaceBefore; i++) {
            let li = <HTMLElement>document.getElementById(i + "");
            li.innerHTML = "&nbsp;";
            li.classList.add('hide-background');
        }
        for (let i = spaceBefore + 1; i <= spaceBefore + lastDay.getDate(); i++) {
            let li = <HTMLElement>document.getElementById(i + "");
            li.classList.remove('hide');
            li.classList.remove('hide-background');
            li.style.cursor = "pointer";
            li.innerHTML = i - spaceBefore + "";
            if (i == (today.getDate() + spaceBefore) && today.getMonth() == month && today.getFullYear() == fullYear) {
                li.classList.add('active');
            } else {
                li.classList.remove('active');
            }
        }
        for (let i = spaceBefore + lastDay.getDate() + 1; i <= 42; i++) {
            let li = <HTMLElement>document.getElementById(i + "");
            li.classList.add('hide');
        }
    }
    previousMonth() {
        let monthName = <HTMLElement>document.getElementById('monthName');
        let month = this.getMonth(monthName.innerHTML);
        let year = <HTMLElement>document.getElementById('year');
        let previousMonth = month > 0 ? month - 1 : 11;
        let y = month == 0 ? parseInt(year.innerHTML) - 1 : parseInt(year.innerHTML);
        this.displayCalendar(previousMonth, y);
    }
    nextMonth() {
        let monthName = <HTMLElement>document.getElementById('monthName');
        let month = this.getMonth(monthName.innerHTML);
        let year = <HTMLElement>document.getElementById('year');
        let nextMonth = month < 11 ? month + 1 : 0;
        let y = month == 11 ? parseInt(year.innerHTML) + 1 : parseInt(year.innerHTML);
        this.displayCalendar(nextMonth, y);
    }
    displayDate(id: number) {
      // console.log(this.goal);
        let date = <HTMLElement>document.getElementById(id + "");
        let monthName = <HTMLElement>document.getElementById('monthName');
        let month = this.getMonth(monthName.innerHTML);
        let year = <HTMLElement>document.getElementById('year');
        let fullDate = year.innerHTML + "-" + month + "-" + date.innerHTML;
        // console.log(fullDate);
        if (date.classList.item(0) == null || date.classList.item(0) == 'active') {
            if (date.classList.item(1) == 'pass') {
                date.classList.remove('pass');
                date.classList.add('fail');
                this.goalService.markGoal(this.goal.id, fullDate, "2").subscribe(res => {console.log(res); this.router.navigate(["/monthview/" + this.goal.id]);}, error => console.log(error));
            } else if (date.classList.item(1) == 'fail') {
                date.classList.remove('fail');
                this.goalService.markGoal(this.goal.id, fullDate, "0").subscribe(res => {console.log(res); this.router.navigate(["/monthview/" + this.goal.id]);}, error => console.log(error));
            } else {
                date.classList.add('pass');
                this.goalService.markGoal(this.goal.id, fullDate, "1").subscribe(res => {console.log(res); this.router.navigate(["/monthview/" + this.goal.id]);}, error => console.log(error));
            }
        } else if (date.classList.item(0) == 'pass') {
            console.log(date.classList.item(0));
            console.log(date.classList.item(1));
            date.classList.remove('pass');
            date.classList.add('fail');
            this.goalService.markGoal(this.goal.id, fullDate, "2").subscribe(res => {console.log(res); this.router.navigate(["/monthview/" + this.goal.id]);}, error => console.log(error));
        } else {
            console.log(date.classList);
            date.classList.remove('fail');
            this.goalService.markGoal(this.goal.id, fullDate, "0").subscribe(res => {console.log(res); this.router.navigate(["/monthview/" + this.goal.id]);}, error => console.log(error));
        }
    }
}
