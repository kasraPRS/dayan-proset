import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { CalendarEvent } from "../model/calendar-event";
import { CalendarAction } from "../model/task";
import * as moment from "jalali-moment";

declare const FullCalendar: any;

@Component({
  selector: "proset-event-calendar",
  standalone: true,
  templateUrl: "./event-calendar.component.html",
  styleUrl: "./event-calendar.component.less",
})
export class EventCalendarComponent implements OnChanges {
  @ViewChild("calendarEl") calendarEl: ElementRef;

  @Input() calendarEventsData: CalendarEvent[] = [];
  @Output() onEventClick: EventEmitter<any> = new EventEmitter();

  shiftCal: any;

  constructor(private translateService: TranslateService) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.initCalendar();
  }

  ngAfterViewInit() {
    this.initCalendar();
  }

  initCalendar() {
    if (this.calendarEl) {
      const calendarEl = this.calendarEl.nativeElement;
      calendarEl?.fullCalendar && calendarEl?.fullCalendar("destroy");

      this.shiftCal = new FullCalendar.Calendar(calendarEl, {
        locale: "fa",
        isRtl: true,
        firstDay: 6,
        direction: "rtl",
        eventMinHeight: 32,
        allDaySlot: false,
        nowIndicator: true,
        eventOverlap: false,
        slotEventOverlap: false,
        fixedWeekCount: false,
        dayMaxEventRows: true,
        dayMaxEvents: true,
        eventOrder: "-duration",
        buttonIcons: false, // show the prev/next text
        initialView: "dayGridMonth",
        headerToolbar: {
          left: "prev,title,next",
          right: "dayGridMonth,timeGridWeek,today",
        },
        moreLinkContent: (args: any) => {
          return {
            html: `<span> ${this.translateService.instant("CALENDAR.MORE")} ${
              args.num
            }+</span>`,
          };
        },
        buttonText: {
          today: this.translateService.instant("CALENDAR.TODAY"),
          month: this.translateService.instant("CALENDAR.MONTH"),
          week: this.translateService.instant("CALENDAR.WEEK"),
          day: this.translateService.instant("CALENDAR.DAY"),
          list: this.translateService.instant("CALENDAR.LIST"),
        },
        views: {
          dayGridMonth: {
            dayHeaderFormat: {
              weekday: "long",
            },
          },
        },
        events: this.calendarEventsData || [],
        eventDidMount: this.eventDidMount.bind(this),
        eventClick: (info: any) => {
          this.onEventClick.emit(info);
        },
        eventContent: (arg: any) => {
          return {
            html: `<div class="event-content" title="${arg.event.title}">
          <span class="event-title">${arg.event.title}</span><span>${
            arg.event.id
          }</span><span>${arg.event.start.toTimeString().split(" ")[0]}</span>
          </div>`,
          };
        },
      });

      this.shiftCal.render();
    }
  }

  eventDidMount(info: any) {
    if (info.view.type == "timeGridWeek" && !info.isStart) {
      info.el.style.display = "none";
      return;
    }

    const actionWrapper = document.createElement("div");
    actionWrapper.className = "action-wrapper";

    let color = "#000";
    if (info.event.extendedProps.background) {
      color = info.event.extendedProps.background;
      info.el.style.border = `1px solid ${color}`;
      info.el.style.background = "#D9D9D933";
    }
    if (
      info.event.extendedProps.end < moment(new Date()).format("YYYY-MM-DD")
    ) {
      const icon = document.createElement("i");
      icon.className = "isax isax-danger";
      icon.style.color = "#FFCB00";
      actionWrapper.appendChild(icon);
    }

    const eventObj = info.event;
    const actions: CalendarAction[] = eventObj.extendedProps?.actions;

    actions?.forEach((action) => {
      const icon = document.createElement("i");
      icon.className = action.icon;
      icon.addEventListener("click", (e: any) => {
        if (action.action) {
          e.preventDefault();
          e.stopPropagation();
          action.action(info);
        }
      });
      actionWrapper.appendChild(icon);
    });

    info.el.appendChild(actionWrapper);
  }
}
