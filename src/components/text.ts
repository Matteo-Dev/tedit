import Content from "../core/content.js";
import DOM from "../base/dom.js";
import Component from "../core/component.js";
import { Variant } from "../core/variant.js";
import Tedit from "../core/tedit.js";
import { NavbarConfig } from "../core/navbar.js";
import Button from "../base/button.js";
import { randstr } from "../utilities/random.js";

class TxtContent implements Content{
    type: string;
    data: {text: string, variant: number};
}
class Txt extends Component{
    protected ID: string;
    protected navbarConfig: NavbarConfig;
    protected name: string;
    protected content: TxtContent;
    protected domElement: HTMLElement;

    constructor(tedit: Tedit, config?: {variant: number}){
        super(tedit);
        this.name = "text";

        this.content = {
            type: this.name,
            data: {
                text: "",
                variant: this.state.variant,
            },
        }

        this.variants = {
            0: new Variant({
                style: {
                    color: "#000000",
                    fontWeight: 500,
                    fontSize: "16px",
                }
            }),
            1: new Variant({
                style: {
                    fontWeight: "bold",
                    fontSize: "22px",
                }
            }),
        }

        this.actions = {
            0: () => { this.setState({ variant: 0 }) },
            1: () => { this.setState({ variant: 1 }) },
        }

        this.navbarConfig = {
            0: new Button({
                innerText: "V0",
                onclick: (_e:any) => { 
                    this.setState({ variant: 0 });
                },
            }),
            1: new Button({
                innerText: "V1",
                onclick: () => { this.setState({ variant: 1 }) },
            }),
        }

        this.ID = randstr();

        this.domElement = DOM.create("p", {
            placeHolder: "This is a text element.",
            contentEditable: true,
            className: "p",
            spellcheck: false,
            id: this.ID,
        });

        this.domElement.addEventListener("keydown", (e)=>{
            this.content = {
                type: this.name,
                data: { 
                    text: (e.target as HTMLElement).innerText + e.key,
                    variant: this.state.variant,
                }
            };
        });

        this.domElement.addEventListener("click", ()=>{
            this.tedit.setActiveElement(this);
            this.tedit.navbar.load(this.navbarConfig);
        });

        if(config?.variant) this.setState({variant: config.variant});
    }

    public getContent(): TxtContent {
        return this.content;
    }
    public setContent(content: TxtContent): void {
        this.content = content;
    }
    public getDomElement(): HTMLElement {
        return this.domElement;
    }
    public setDomElement(domElement: HTMLElement): void {
        this.domElement = domElement;
    }    
    public getName(): string{
        return this.name;
    }
    public getID(): string{
        return this.ID;
    }
}

export default Txt;