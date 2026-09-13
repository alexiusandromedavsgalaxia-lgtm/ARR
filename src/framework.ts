export interface UINode { kind:string; props:Record<string,unknown>; children:UINode[] }
const n=(kind:string,props:Record<string,unknown>={},children:UINode[]=[]):UINode=>({kind,props,children});
export class ARRUI {
 private root:UINode|null=null;
 private listeners=new Set<(tree:UINode|null)=>void>();
 mount(tree:UINode){this.root=tree;for(const f of this.listeners)f(tree);return tree}
 current(){return this.root}
 onRender(f:(tree:UINode|null)=>void){this.listeners.add(f);return()=>this.listeners.delete(f)}
 text(value:unknown,props={}){return n('Text',{value:String(value),...props})}
 image(source:string,props={}){return n('Image',{source,...props})}
 icon(name:string,props={}){return n('Icon',{name,...props})}
 box(children:UINode[]=[],props={}){return n('Box',props,children)}
 row(children:UINode[]=[],props={}){return n('Row',props,children)}
 column(children:UINode[]=[],props={}){return n('Column',props,children)}
 stack(children:UINode[]=[],props={}){return n('Stack',props,children)}
 scroll(children:UINode[]=[],props={}){return n('Scroll',props,children)}
 button(label:string,action?:()=>void,props={}){return n('Button',{label,action,...props})}
 toggle(value:boolean,action?:(next:boolean)=>void,props={}){return n('Toggle',{value,action,...props})}
 slider(value:number,min=0,max=1,action?:(next:number)=>void,props={}){return n('Slider',{value,min,max,action,...props})}
 input(value='',action?:(next:string)=>void,props={}){return n('Input',{value,action,...props})}
 canvas(draw:unknown,props={}){return n('Canvas',{draw,...props})}
 fragment(children:UINode[]=[]){return n('Fragment',{},children)}
}
export class ARRAudio {
 readonly master={volume:1,muted:false}; private next=1; private voices=new Map<number,{clip:string;playing:boolean;volume:number;position:number}>();
 load(id:string,source:string){return{id,source}}
 play(id:string,volume=1){const voice=this.next++;this.voices.set(voice,{clip:id,playing:true,volume,position:0});return voice}
 pause(id:number){const v=this.voices.get(id);if(v)v.playing=false}
 resume(id:number){const v=this.voices.get(id);if(v)v.playing=true}
 stop(id:number){this.voices.delete(id)}
 seek(id:number,seconds:number){const v=this.voices.get(id);if(v)v.position=Math.max(0,seconds)}
 setVolume(id:number,volume:number){const v=this.voices.get(id);if(v)v.volume=Math.max(0,Math.min(1,volume))}
 isPlaying(id:number){return this.voices.get(id)?.playing??false}
 stopAll(){this.voices.clear()}
 haptic(pattern:number|number[]){return pattern}
}
export interface Vec2{x:number;y:number}
export interface Rect{x:number;y:number;width:number;height:number}
export class ARRGraphics {
 clear(color:string='#000000'){return{op:'clear',color}}
 rect(bounds:Rect,color:string){return{op:'rect',bounds,color}}
 circle(center:Vec2,radius:number,color:string){return{op:'circle',center,radius,color}}
 line(a:Vec2,b:Vec2,width=1,color='#ffffff'){return{op:'line',a,b,width,color}}
 text(value:string,position:Vec2,size=16,color='#ffffff'){return{op:'text',value,position,size,color}}
 viewport(width:number,height:number){return{x:0,y:0,width,height}}
}
export class ARRInput {
 private keys=new Set<string>(); private pointers=new Map<number,Vec2>();
 key(key:string){return this.keys.has(key)} pointer(id=0){return this.pointers.get(id)??{x:0,y:0}}
 feedKey(key:string,down:boolean){down?this.keys.add(key):this.keys.delete(key)}
 feedPointer(id:number,x:number,y:number){this.pointers.set(id,{x,y})}
}
export class ARRStorage {
 private data=new Map<string,unknown>();
 get<T=unknown>(key:string,fallback?:T){return(this.data.has(key)?this.data.get(key):fallback) as T|undefined}
 set<T>(key:string,value:T){this.data.set(key,value)} has(key:string){return this.data.has(key)} delete(key:string){return this.data.delete(key)} clear(){this.data.clear()} keys(){return[...this.data.keys()]}
}
export class ARRTime { now(){return Date.now()} seconds(){return Date.now()/1000} sleep(ms:number){return new Promise<void>(r=>setTimeout(r,Math.max(0,ms)))} }
export interface ARRFramework {ui:ARRUI;audio:ARRAudio;graphics:ARRGraphics;input:ARRInput;storage:ARRStorage;time:ARRTime}
export function createFramework():ARRFramework{return{ui:new ARRUI(),audio:new ARRAudio(),graphics:new ARRGraphics(),input:new ARRInput(),storage:new ARRStorage(),time:new ARRTime()}}
