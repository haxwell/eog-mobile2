
export class AbstractTutorialPage {
	showSkip = true;

	onSlideChangeStart(slider: Slides) {
    	let self = this;
    	slider.target.isEnd().then((bool) => {
    		self.showSkip = !bool;
    	})
  	}
}
