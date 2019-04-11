
import { render } from '../lighterhtml.js'
import { adaptLighterHtml } from "./adapt-lighter-html.js"
import { configureComponent } from './configure-component.js'

const lighterComponent = configureComponent({render: adaptLighterHtml(render)});

export { lighterComponent };
