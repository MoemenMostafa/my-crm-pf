import { browser, by, element } from 'protractor';

export class MyCrmPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('.trip-form h2')).getText();
  }
}
