import { withMaxWidth } from '.testing/storybook';
import { text } from '@storybook/addon-knobs';
import { moduleMetadata, storiesOf } from '@storybook/angular';
import { AppComponent } from './app.component';

const stories = storiesOf('Features|App', module);

stories.addDecorator(moduleMetadata({
    declarations: [AppComponent]
}));

stories.addDecorator(withMaxWidth(400));

stories.add('Default', () => ({
    component: AppComponent,
    props: {
        title: text('title', 'Hello world!')
    }
}));
