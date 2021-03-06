import DOM from "../base/dom.js";
import Component from "./component.js";
import { isDuplicate } from "../utilities/listOperations.js";
import {getKeyValue, setKeyValue} from "../utilities/objectOperations.js";
import Navbar from "./navbar.js";
import blockMap from "./internals/blockMap.js";
import { Init } from "./data.js";
import Content from "./content.js";
import ContextMenu from "./contextMenu.js";

class Tedit {
    private activeElement: Component;
    private elements: Component[];
    private domElement: HTMLElement;
    private contextMenu: ContextMenu;
    private isContextMenuActive: boolean;
    public navbar: Navbar;

    constructor({data, types}: Init){
        this.elements = [];
        this.domElement = DOM.create("div");
        this.navbar = new Navbar();
        this.domElement.appendChild(this.navbar.getDomElement());
        this.domElement.appendChild(DOM.create("div"));
        this.domElement.addEventListener("keydown", this.handleKeyDown.bind(this));
        this.domElement.addEventListener("contextmenu", this.handleContextMenu.bind(this));
        this.domElement.addEventListener("click", this.closeContextMenu.bind(this));

        this.contextMenu = new ContextMenu();
        document.body.append(this.contextMenu.getDomElement());

        this.isContextMenuActive = false;

        Component.setTedit(this);

        if(data) {
            for(let i=0; i<data.length; i++){
                //blockMap[data[i].type]
                this.append((new (getKeyValue(data[i].type as never)(blockMap))({variant: data[i].data.variant, content: data[i]})));
            }
            this.elements[0].focus();
        }

        if(types){
            for(let i=0; i<types.length; i++){

            }
        }
    }

    public getActiveElement(): Component{
        return this.activeElement;
    }
    public setActiveElement(activeElement:Component){
        this.activeElement = activeElement;
    }
    public getDomElement(): HTMLElement{
        return this.domElement;
    }

    public getContent(): Content[]{
        let result = {};
        for(let i=0; i<this.elements.length; i++){
            setKeyValue(typeof (this.elements[i] as any) as never, this.elements[i].getContent())(result);
        }
        return this.elements.map((element) => {
            return element.getContent();
        });
    }

    public getContextMenu(): ContextMenu{
        return this.contextMenu;
    }

    public save() {
        const content = this.getContent();
        fetch("/save", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(content),
        }).then((res)=>{
            return res.body;
        }).then((_data)=>{
            console.log("successfull");
        })
    }

    // TODO: Set new position on 2nd if:true
    public append(element: Component, index?:number){
        console.log(isDuplicate(this.elements, element))
        if(isDuplicate(this.elements, element)) {
            if(index){ 
                this.elements.splice(index, 0, element);
                element.setPosition(index);
                for(let i=index; i<this.elements.length; i++){
                    this.elements[i].setPosition(i);
                }
            } else {
                this.elements.push(element);
                element.setPosition(this.elements.length-1);
            }

            this.render();

            element.focus();
        }
    }

    public removeElementAt(index: number){
        this.domElement.childNodes[1].removeChild(this.elements[index].getDomElement());
        this.elements.splice(index, 1);
        this.elements[index-1].focus();
        for(let i=index; i<this.elements.length; i++){
            this.elements[i].setPosition(i);
        }
    }

    public render(){
        if(this.elements.length != 1) {
            (this.domElement.childNodes[1] as HTMLElement).innerHTML = "";
        }

        this.elements.map((element) => {
            this.domElement.childNodes[1].appendChild(element.getDomElement())
        })
    }

    private handleKeyDown(e: KeyboardEvent){
        let position = this.activeElement.getPosition();
        if(e.key === "ArrowUp"){
            e.preventDefault();
            if(position !== 0) this.elements[position-1].focus();

            /* text component specific
            let { anchorOffset } = document.getSelection() as Selection;
            DOMWorker.setCursor( this.elements[position-1].getDomElement().childNodes[0], anchorOffset)
            */
        } else if (e.key === "ArrowDown"){
            e.preventDefault();
            if(position !== this.elements.length-1) this.elements[position+1].focus();
        }
    }

    private handleContextMenu(e: MouseEvent){
        e.preventDefault();

        // check whether event position is equal to previous one, then false, else true (new position)
        if(this.isContextMenuActive){
            this.closeContextMenu();
        }
        else {
            this.contextMenu.show(e.clientX, e.clientY);
            this.isContextMenuActive = true;
        }
    }

    private closeContextMenu(){
        this.contextMenu.hide();
        this.isContextMenuActive = false;
    }
}

export default Tedit;