import React,{useEffect,useId,useState,type ReactNode}from'react';

/** Mobile-first technique controls: compact while positioning, expanded without losing the image. */
export function MobileControlSheet({title,primaryAction,children}:{title:string;primaryAction?:ReactNode;children:ReactNode}){
 const[open,setOpen]=useState(false),contentId=useId();
 useEffect(()=>{if(!open)return;const onKey=(e:KeyboardEvent)=>{if(e.key==='Escape')setOpen(false)};window.addEventListener('keydown',onKey);return()=>window.removeEventListener('keydown',onKey)},[open]);
 return <div className={`mobile-control-sheet ${open?'open':''}`} data-state={open?'open':'closed'}>
  <button type="button" className="sheet-grab" aria-label={open?'Collapse technique controls':'Expand technique controls'} aria-controls={contentId} aria-expanded={open} onClick={()=>setOpen(v=>!v)}/>
  <div className="sheet-bar"><button type="button" className="sheet-toggle" aria-controls={contentId} aria-expanded={open} onClick={()=>setOpen(v=>!v)}>{open?'Hide controls':title}</button>{primaryAction&&<div className="sheet-primary">{primaryAction}</div>}</div>
  <div id={contentId} className="sheet-content" aria-hidden={!open} inert={!open?true:undefined}>{children}</div>
 </div>
}
