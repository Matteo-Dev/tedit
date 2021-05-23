import Content from "../core/content.js";
import DOM, { DOMWorker } from "../base/dom.js";
import Component from "../core/component.js";
import { Variant } from "../core/variant.js";
import { NavbarConfig } from "../core/navbar.js";
import Button from "../base/button.js";
import { randstr } from "../utilities/random.js";
import HTMLComponent from "../base/HTMLComponent.js";

class TxtContent implements Content{
    type: string;
    data: {text: string, variant: number};
}
class Txt extends Component{
    protected ID: string;
    protected navbarConfig: NavbarConfig;
    protected name: string;
    protected content: TxtContent;
    protected domComponent: HTMLComponent;
    protected domElement: HTMLElement;

    constructor(config?: {variant: number, content: TxtContent}){
        super();
        this.name = "text";

        this.content = {
            type: this.name,
            data: {
                text: "",
                variant: this.state.variant,
            },
        }

        this.variants = {
            "default": new Variant ({
                className: "p",
                onkeydown: this.handleKeyDown.bind(this),
                onclick: (()=>{
                    Component.tedit.setActiveElement(this);
                    Component.tedit.navbar.load(this.navbarConfig);
                }).bind(this),
            }),
            0: new Variant({
                style: {
                    color: "#000000",
                    fontWeight: 500,
                    fontSize: "16px",
                },
                placeHolder: "Just a normal text field",
                contentEditable: true,
                className: "p",
            }),
            1: new Variant({
                style: {
                    fontWeight: "bold",
                    fontSize: "22px",
                }, 
                tagName: "h1",
                placeHolder: "Header",
                contentEditable: true,
                className: "p",
            }),
        }

        this.actions = {
            0: () => { this.setState({ variant: 0 }) },
            1: () => { this.setState({ variant: 1 }) },
        }

        this.navbarConfig = {
            0: new Button({
                innerText: "P",
                onclick: (_e:any) => { 
                    this.toTextVariant(0);
                },
            }),
            1: new Button({
                innerText: "H1",
                onclick: () => { 
                    this.toTextVariant(1);
                },
            }),
            2: new Button({
                innerText: "B",
                onclick: () => {
                    DOMWorker.surroundSelection(DOM.create("b"));
                },
                contentEditable: false,
            })
        }

        this.ID = randstr();

        let domElement;
        domElement = DOM.create("p", {
            placeHolder: "This is a text element.",
            contentEditable: true,
            className: "p",
            spellcheck: false,
            id: this.ID,
        });

        this.domComponent = new HTMLComponent(domElement);

        if(config?.variant != null) {
            this.setState({variant: config.variant});
        }

        if(config?.content != null){
            this.setContent(config.content);
        }
    }

    private handleKeyDown(e: Event): void {
        setTimeout(()=>{
            this.content.data = { 
                    text: (e.target as HTMLElement).innerText,
                    variant: this.state.variant,
                }
        }, 1);
    }

    private toTextVariant(num: number){
        let { anchorOffset } = document.getSelection() as Selection;
        this.setState({ variant: num });
        DOMWorker.setCursor(this.getDomElement().childNodes[0], anchorOffset); 
        this.getDomElement().focus();
    }

    public getContent(): TxtContent {
        return this.content;
    }
    public setContent(content: TxtContent): void {
        this.content = content;
        this.getDomElement().innerText = content.data.text;
    }  
    public getDomComponent(): HTMLComponent{
        return this.domComponent;
    }
    public setDomComponent(domComponent: HTMLComponent): void {
        this.domComponent = domComponent;
    }
    public getDomElement(): HTMLElement{
        return this.domComponent.getDomElement();
    }
    public getName(): string{
        return this.name;
    }
    public getID(): string{
        return this.ID;
    }
}

export default Txt;