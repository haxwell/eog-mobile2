
export class AbstractTutorialPage {
	showSkip = true;

	onSlideChangeStart(slider) {
    	let self = this;
    	slider.target.isEnd().then((bool) => {
    		self.showSkip = !bool;
    	})
  	}
}
