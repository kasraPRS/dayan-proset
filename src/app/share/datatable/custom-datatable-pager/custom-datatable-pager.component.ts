import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import {
  faAnglesLeft,
  faAnglesRight,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: "app-custom-datatable-pager",
  templateUrl: "./custom-datatable-pager.component.html",
  styleUrls: ["./custom-datatable-pager.component.less"],
})
export class CustomDatatablePagerComponent implements OnInit {
  faAnglesLeft = faAnglesLeft;
  faAnglesRight = faAnglesRight;
  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;
  maxSize = 5;
  @Input() pagerLeftArrowIcon: string;
  @Input() pagerRightArrowIcon: string;
  @Input() pagerPreviousIcon: string;
  @Input() pagerNextIcon: string;

  @Input()
  set size(val: number) {
    this._size = val;
    this.pages = this.calcPages();
  }

  get size(): number {
    return this._size;
  }

  @Input()
  set count(val: number) {
    this._count = val;
    this.pages = this.calcPages();
  }

  get count(): number {
    return this._count;
  }

  @Input() set page(val: number) {
    this._page = val;
    this.pages = this.calcPages();
  }

  get page(): number {
    return this._page;
  }

  @Input()
  set totalPages(numTotalPages: number) {
    this._numTotalPages = numTotalPages;
    this.pages = this.calcPages();
  }

  get totalPages(): number {
    let count;
    if (this._numTotalPages) {
      count = this._numTotalPages;
    } else {
      count = this.size < 1 ? 1 : Math.ceil(this.count / this.size);
    }
    return Math.max(count || 0, 1);
  }

  @Output() change: EventEmitter<any> = new EventEmitter();

  private _numTotalPages: number;
  _count = 0;
  _page = 0;
  _size = 0;
  pages: any;

  constructor() {}

  ngOnInit(): void {}

  canPrevious(): boolean {
    return this.page > 1;
  }

  canNext(): boolean {
    return this.page < this.totalPages;
  }

  selectPage(page: number): void {
    if (page > 0 && page <= this.totalPages && page !== this.page) {
      this.page = page;

      this.change.emit({
        page,
      });
    }
  }

  prevPage(): void {
    this.selectPage(this.page - 1);
  }

  nextPage(): void {
    this.selectPage(this.page + 1);
  }

  calcPages(page?: number) {
    const pages = [];
    let startPage = 1;
    let endPage = this.totalPages;
    const isMaxSized = this.maxSize < this.totalPages;

    page = page || this.page;

    if (isMaxSized) {
      startPage = page - Math.floor(this.maxSize / 2);
      endPage = Math.min(page + Math.floor(this.maxSize / 2), this.totalPages);

      if (startPage < 1) {
        startPage = 1;
        endPage = Math.min(startPage + this.maxSize - 1, this.totalPages);
      } else if (endPage >= this.totalPages) {
        startPage = Math.max(this.totalPages - this.maxSize + 1, 1);
        endPage = this.totalPages;
      }
    }

    for (let num = startPage; num < endPage; num++) {
      pages.push({
        number: num,
        text: num as any as string,
      });
    }
  }
}
