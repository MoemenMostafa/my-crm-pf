import { MyCrm2Page } from './app.po';

describe('my-crm2 App', () => {
  let page: MyCrm2Page;

  beforeEach(() => {
    page = new MyCrm2Page();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
