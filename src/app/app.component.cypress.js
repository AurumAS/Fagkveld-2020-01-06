/// <reference types="Cypress" />

describe('app.component', () => {
    beforeEach(() => {
        cy.storybook('Features', 'App', 'Default', {
            title: 'Hello Cypress'
        });
    });
    it('should load', () => {
        cy.get('h1').should('contain.text', 'Hello Cypress')
    });

    it('should trigger on click', () => {
        cy.get('button').click();

        cy.getEvent('buttonClick').then(event => {
            expect(event).to.be.calledWith('Foo');
        })
    })
});
