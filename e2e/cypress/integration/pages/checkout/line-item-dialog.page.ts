export class LineItemDialogPage {
  readonly tag = 'ish-line-item-edit-dialog-container';

  changeVariationSelection(values: { attr: string; value: string }[]) {
    for (const x of values) {
      // tslint:disable-next-line:ban
      cy.get('ngb-modal-window')
        .find(x.attr)
        .select(x.value);
    }
  }

  save() {
    cy.get('[data-testing-id="confirm"]').click();
  }
}
