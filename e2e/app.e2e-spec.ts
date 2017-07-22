import { MyCrmPage } from './app.po';

describe('my-crm App', () => {
  let page: MyCrmPage;

  beforeEach(() => {
    page = new MyCrmPage();
  });

  it('should display title \'Pick Your Trip\'', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Pick Your Trip');
  });
});
