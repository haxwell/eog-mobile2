
export class AbstractTutorialPage {
	showSkip = undefined;

	onSlideChangeStart(slider) {
		let self = this;

		if (this.showSkip === undefined) {
			
			this.showSkip = null;

			slider.currentTarget.isEnd().then((b) => {
				self.showSkip = b;
			})
		} else {
			return true;
		}
	}
}
