import { Type } from '@angular/core';
import { decorate } from '@storybook/addon-actions';
import { withKnobs } from '@storybook/addon-knobs';
import { StoryApi } from '@storybook/addons';
import { moduleMetadata, storiesOf } from '@storybook/angular';
import { NgModuleMetadata } from '@storybook/angular/dist/client/preview/types';

export function componentForCypress<T>(
    {
        component,
        category,
        di
    }: {
        component?: Type<T>;
        category?: string;
        di?: Partial<NgModuleMetadata>;
    },
    nodeModule?: NodeModule
): StoryApi {
    if (typeof category !== 'string') {
        di = category;
        category = undefined;
    }
    let name = category;
    if (category.indexOf('|') === -1) {
        name = category ? `${category}|${component.name}` : component.name;
    }
    const stories = storiesOf(name, nodeModule || module);
    stories.addDecorator(withKnobs);

    if (di) {
        stories.addDecorator(moduleMetadata(di));
    }
    return stories;
}

export function spy(action) {
    const decorator = decorate([
        args => {
            window['GLOBAL'].events[action](args && args[0]);
            return args;
        }
    ]);
    window['GLOBAL'].addEvent(action);
    return decorator.action(action);
}
