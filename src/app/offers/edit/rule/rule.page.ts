import { Component, Input } from '@angular/core';
import { Location } from '@angular/common';

import { SearchService } from '../../../../app/_services/search.service';

@Component({
  selector: 'page-offer-edit-rule',
  templateUrl: 'rule.page.html'
  ,styleUrls: ['./rule.page.scss']
})
export class RulePage {

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

	constructor(private _location: Location,
				private _searchService: SearchService) {

	}

	ngOnInit() {
		let self = this;

		self.pointsQuantity = (self.model && self.model["requiredPointsQuantity"]) || 0;
		self.requiredUserRecommendations = (self.model && self.model["requiredUserRecommendations"]) || [];
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
		return this.requiredUserRecommendations && this.requiredUserRecommendations.length > 0;
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
