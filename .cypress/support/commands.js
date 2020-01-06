/// <reference types="Cypress" />
Cypress.Commands.add('storybook', (...segments) => {
    let queryKnobs = '';
    const [category, ...storySegments] = segments
        .filter(s => typeof s === 'string')
        .map(s =>
            s
                .toLowerCase()
                .replace(/\|/g, '-')
                .replace(/\//g, '-')
                .replace(/\s/g, '-')
                .replace(/-{1,}/g, '-')
        );
    const knobs = segments.find(s => typeof s === 'object');
    if (knobs) {
        queryKnobs = Object.keys(knobs).reduce((q, key) => {
            const data = knobs[key];
            return (q += `&knob-${key}=${data}`);
        }, '');
    }
    const storyId = storySegments.reduce((str, segment) => `${str}${!!str ? '--' : ''}${segment}`, '');
    cy.visit(`iframe.html?id=${category.toLowerCase()}-${storyId}${queryKnobs}`).then(window => {
        console.log('[Cypress', window['GLOBAL'].events);
        Object.keys(window['GLOBAL'].events).forEach(key => {
            window['GLOBAL'].events = {
                ...(window['GLOBAL'].events || {}),
                [key]: cy.spy()
            };
        });
        window['GLOBAL'].addEvent = function(event) {
            console.log('[cypress!] Events: adding event to events', event);
            window['GLOBAL'].events = {
                ...(window['GLOBAL'].events || {}),
                [event]: cy.spy()
            };
        };
    });
});


Cypress.Commands.add('getEvent', name => {
    return cy.window().then(window => {
        const ev = window['GLOBAL'].events[name];
        if (!ev) {
            throw new Error(`Event ${name} not found!`);
        }
        return ev;
    });
});