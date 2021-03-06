import { Component, OnInit, Input, Output, EventEmitter, TemplateRef, AfterViewInit } from '@angular/core';
import { IContent, LibraryCardTypes, ICardClick } from "./../event-card-models"

@Component({
  selector: 'sb-event-card-v2',
  templateUrl: './event-card-v2.component.html',
  styleUrls: ['./event-card-v2.component.scss', '../event-card/event-card.component.scss']
})
export class EventCardV2Component implements OnInit, AfterViewInit {

  @Input() content: IContent|any;
    @Input() isMobile = false;
    @Input() isOffline = false;
    @Input() cardImg = '';
    @Input() type: LibraryCardTypes = LibraryCardTypes.DESKTOP_TEXTBOOK;
    @Input() moreInfoLabel = 'Medium';
    @Input() section = '';
    @Input() isLoading:boolean;
    @Input('hover-template') gridTemplate: TemplateRef<any>;
    @Input() btnlabel = '';
    @Input() btnicon = '';
    @Input() isMenu: boolean = false;
    @Input() layoutConfig: any;
    @Input() indexToDisplay: number;
    @Input() svgToDisplay;
    @Input() isSelected = false;

    @Output() cardClick: EventEmitter<ICardClick> = new EventEmitter();
    @Output() menuClick: EventEmitter<ICardClick> = new EventEmitter();

    get LibraryCardTypes() { return LibraryCardTypes; }

    ngOnInit() {
        this.fetchSvg();
        this.splitGradeMedium();
    }

    ngAfterViewInit(): void {
    }

    onClick(event: MouseEvent) {
        this.cardClick.emit({ event: event, data: this.content });
    }
    splitGradeMedium() {
        if(this.content && this.content.gradeLevel) {
            this.content.gradeLevel = typeof this.content.gradeLevel === "string"?this.content.gradeLevel.split(","):this.content.gradeLevel;
        }
    }

    onMenuClick(event: MouseEvent) {
        this.menuClick.emit({ event: event, data: this.content });
    }

    getClassForImage() {
        if(this.layoutConfig!=null && this.layoutConfig.cardImgStyle != null) {
            return "sb--card__img sb--card__image-pos-"+this.layoutConfig.cardImgStyle;
        } else {
            return "sb--card__img sb--card__image-pos";
        }

    }
    fetchSvg() {
        var indexToDisplay = this.indexToDisplay!=null ? (this.indexToDisplay % 9)+1:2;
        // this.svgToDisplay1 = "as"
        this.svgToDisplay =  "assets/common-consumption/images/abstract_0"+indexToDisplay+".svg";
    }

}
