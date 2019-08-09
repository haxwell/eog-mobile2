import { Component, Input } from '@angular/core';

import { SearchService } from '../../../app/_services/search.service';

@Component({
  selector: 'page-offer-edit-rule',
  templateUrl: 'rule.page.html'
  ,styleUrls: ['./rule.page.scss']
})
export class RulePage {

	/**
		A thought I had while working on this page. I think this page should use a service for everything it needs
		to do with its domain object. Reading, setting attributes,  saving itself, getting default models, all that
		should be on the service, and this Page should call teh service to get what it wants, as a Controller calls
		its service to implement a REST call. Then, eventually this page will not be calling a service, but those
		will become methods on the object itself, and the service goes away, and we call teh object itself, to load,
		write, save, etc.

		But at the moment the more important task is getting icons fucking working during a migration to Ionic 4, so
		that we can use routes in Angular, and therefore be able to test with Cypress, which will then need to be automated
		so as to send me a daily report. #RabbitHole
	*/

	@Input() model: any;
	@Input() props: any;
	@Input() callbackFunc: any;

	searchString: string = '';
	searchResultListCountString: string = undefined;
	origSearchResultSize = 0;
	origSearchResultsAlreadyRequiredCount = 0;

	pointsQuantity: number = 0;
	requiredUserRecommendations: Array<Object> = undefined;
	searchResultList: Array<Object> = [];
	userList: Array<Object> = [];

	constructor(private _searchService: SearchService) {

	}

	ngOnInit() {
		let self = this;

		self.pointsQuantity = self.model["requiredPointsQuantity"] || 0;
		self.requiredUserRecommendations = self.model["requiredUserRecommendations"] || []; // .slice() ?
	}

	onSearchUserBtnTap(evt) {
		if (this.isSearchBtnEnabled()) {
			let self = this;
			this._searchService.searchUsers(this.searchString, 50).then((data: Array<Object>) => {
				self.searchResultList = data;
				self.origSearchResultSize = data.length;
				self.origSearchResultsAlreadyRequiredCount = 0;

				let tmp = self.searchResultList.filter((obj) => { 
					return !self.requiredUserRecommendations.some(
						(obj2) => { return obj["id"] === obj2["requiredRecommendUserId"]; }
					) 
				});

				self.origSearchResultsAlreadyRequiredCount = self.origSearchResultSize - tmp.length;
				self.searchResultList = tmp;			

				self.updateSearchResultListCountString();
			});
		}
	}

	updateSearchResultListCountString() {
		this.searchResultListCountString = this.origSearchResultSize + " matches found. ";
		if (this.origSearchResultsAlreadyRequiredCount > 0)
			this.searchResultListCountString += this.origSearchResultsAlreadyRequiredCount + " already required.";
	}

	getSearchResultListCountString() {
		return this.searchResultListCountString;
	}

	handleSearchStringChange(evt) {
		this.searchResultListCountString = undefined;
	}

	isSearchBtnEnabled() {
		return this.searchString.length > 2 && this.props.permitOnlyEditsToPoints !== true;
	}

	isSaveBtnEnabled() {
		return this.pointsQuantity > 0;
	}

	hasRequiredRecommendations() {
		return this.requiredUserRecommendations.length > 0;
	}

	onIndividualSearchResultTap(item) {
		if (this.props.permitOnlyEditsToPoints !== true) {
			this.requiredUserRecommendations.push({id: -1, requiredRecommendUserId: item["id"], userObj: item});
			this.searchResultList = this.searchResultList.filter((obj) => { return obj["id"] !== item["id"]; });

			this.origSearchResultsAlreadyRequiredCount++;
			this.updateSearchResultListCountString();
		}
	}

	onIndividualRequiredUserPress(item) {
		if (this.props.permitOnlyEditsToPoints !== true) {
			this.requiredUserRecommendations = this.requiredUserRecommendations.filter((obj) => { return obj["userObj"]["id"] !== item["userObj"]["id"]; });
			this.searchResultList.push(item["userObj"]);

			this.origSearchResultsAlreadyRequiredCount--;
			this.updateSearchResultListCountString();
		}
	}

	getSearchResultList() {
		if (this.searchResultList === undefined || this.searchResultList.length === 0 || this.props.permitOnlyEditsToPoints)
			return undefined;

		return this.searchResultList;
	}

	onSaveBtnTap(evt) {
		this.model["requiredPointsQuantity"] = this.pointsQuantity;
		this.model["requiredUserRecommendations"] = this.requiredUserRecommendations;

		this.callbackFunc(this.model);
	}

	onCancelBtnTap(evt) {
		this.callbackFunc(undefined);
	}
}
