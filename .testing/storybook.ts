import { decorate } from '@storybook/addon-actions';

export const componentWrapper = templateFn => storyFn => {
    const story = storyFn();
    if (story.component) {
        const selector: string = story.component.__annotations__[0].selector;
        const inputs: string[] = [];
        const outputs: string[] = [];
        const umappedOutputs: string[] = [];
        let componentProps = story.component.__prop__metadata__;
        let proto = story.component.prototype.__proto__;
        while (proto.constructor.__prop__metadata__) {
            componentProps = {
                ...componentProps,
                ...proto.constructor.__prop__metadata__
            };
            proto = proto.constructor.prototype.__proto__;
        }
        for (const key in componentProps) {
            if (
                Object.getPrototypeOf(componentProps[key][0]).ngMetadataName === 'Input' &&
                story.props.hasOwnProperty(key)
            ) {
                inputs.push(key);
            } else if (
                Object.getPrototypeOf(componentProps[key][0]).ngMetadataName === 'Output' &&
                story.props.hasOwnProperty(key)
            ) {
                outputs.push(key);
            } else if (
                Object.getPrototypeOf(componentProps[key][0]).ngMetadataName === 'Output' &&
                !story.props.hasOwnProperty(key)
            ) {
                umappedOutputs.push(key);
            }
        }
        const inputStr: string = inputs.map(input => `[${input}]="${input}"`).join(' ');
        const outputStr: string = [...outputs, ...umappedOutputs]
            .map(output => `(${output})="${output}($event)"`)
            .join(' ');
        const outputSpies = umappedOutputs.reduce((res, output) => ({ ...res, [output]: spy(output) }), {});
        const template = `<${selector} ${inputStr} ${outputStr}></${selector}>`;
        return {
            ...story,
            template: templateFn(template),
            props: {
                ...story.props,
                ...outputSpies
            }
        };
    }
    return {
        ...story,
        template: templateFn(story.template),
        props: {
            ...story.props
        }
    };
};
export const withMaxWidth = (maxWidth: number = 1200, additionalStyle: any = {}, additionalClasses: any[] = []) =>
    componentWrapper(content => {
        const styles = Object.keys(additionalStyle).reduce((s: string, key: string) => {
            return (s += `${key}: ${additionalStyle[key]};`);
        }, '');
        return `<div class='${additionalClasses.join(
            ' '
        )}' style='max-width: ${maxWidth}px; margin: 0 auto;${styles}'>${content}</div>`;
    });

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
