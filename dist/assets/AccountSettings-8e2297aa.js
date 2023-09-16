import{w as T,q as k,i as d,t as h,af as te,X as se,x as D,_ as n,S as V,v as W,J as re,l as P,a7 as ae,j as t,n as f,p as $,Y as ne,a as u,ae as ie,E as le,F as ce,u as de,T as pe,C as ue,B as E,A as xe,G as m,b as L,L as ge,c as me}from"./index-765046d2.js";import{C as he,T as q}from"./TextField-d0185500.js";import"./Select-bbe38a07.js";function fe(e){return k("MuiDialog",e)}const Ce=T("MuiDialog",["root","scrollPaper","scrollBody","container","paper","paperScrollPaper","paperScrollBody","paperWidthFalse","paperWidthXs","paperWidthSm","paperWidthMd","paperWidthLg","paperWidthXl","paperFullWidth","paperFullScreen"]),O=Ce,De=d.createContext({}),G=De,be=["aria-describedby","aria-labelledby","BackdropComponent","BackdropProps","children","className","disableEscapeKeyDown","fullScreen","fullWidth","maxWidth","onBackdropClick","onClose","open","PaperComponent","PaperProps","scroll","TransitionComponent","transitionDuration","TransitionProps"],ve=h(te,{name:"MuiDialog",slot:"Backdrop",overrides:(e,o)=>o.backdrop})({zIndex:-1}),we=e=>{const{classes:o,scroll:s,maxWidth:r,fullWidth:i,fullScreen:a}=e,l={root:["root"],container:["container",`scroll${D(s)}`],paper:["paper",`paperScroll${D(s)}`,`paperWidth${D(String(r))}`,i&&"paperFullWidth",a&&"paperFullScreen"]};return $(l,fe,o)},ye=h(se,{name:"MuiDialog",slot:"Root",overridesResolver:(e,o)=>o.root})({"@media print":{position:"absolute !important"}}),je=h("div",{name:"MuiDialog",slot:"Container",overridesResolver:(e,o)=>{const{ownerState:s}=e;return[o.container,o[`scroll${D(s.scroll)}`]]}})(({ownerState:e})=>n({height:"100%","@media print":{height:"auto"},outline:0},e.scroll==="paper"&&{display:"flex",justifyContent:"center",alignItems:"center"},e.scroll==="body"&&{overflowY:"auto",overflowX:"hidden",textAlign:"center","&:after":{content:'""',display:"inline-block",verticalAlign:"middle",height:"100%",width:"0"}})),Se=h(V,{name:"MuiDialog",slot:"Paper",overridesResolver:(e,o)=>{const{ownerState:s}=e;return[o.paper,o[`scrollPaper${D(s.scroll)}`],o[`paperWidth${D(String(s.maxWidth))}`],s.fullWidth&&o.paperFullWidth,s.fullScreen&&o.paperFullScreen]}})(({theme:e,ownerState:o})=>n({margin:32,position:"relative",overflowY:"auto","@media print":{overflowY:"visible",boxShadow:"none"}},o.scroll==="paper"&&{display:"flex",flexDirection:"column",maxHeight:"calc(100% - 64px)"},o.scroll==="body"&&{display:"inline-block",verticalAlign:"middle",textAlign:"left"},!o.maxWidth&&{maxWidth:"calc(100% - 64px)"},o.maxWidth==="xs"&&{maxWidth:e.breakpoints.unit==="px"?Math.max(e.breakpoints.values.xs,444):`max(${e.breakpoints.values.xs}${e.breakpoints.unit}, 444px)`,[`&.${O.paperScrollBody}`]:{[e.breakpoints.down(Math.max(e.breakpoints.values.xs,444)+32*2)]:{maxWidth:"calc(100% - 64px)"}}},o.maxWidth&&o.maxWidth!=="xs"&&{maxWidth:`${e.breakpoints.values[o.maxWidth]}${e.breakpoints.unit}`,[`&.${O.paperScrollBody}`]:{[e.breakpoints.down(e.breakpoints.values[o.maxWidth]+32*2)]:{maxWidth:"calc(100% - 64px)"}}},o.fullWidth&&{width:"calc(100% - 64px)"},o.fullScreen&&{margin:0,width:"100%",maxWidth:"100%",height:"100%",maxHeight:"none",borderRadius:0,[`&.${O.paperScrollBody}`]:{margin:0,maxWidth:"100%"}})),Me=d.forwardRef(function(o,s){const r=W({props:o,name:"MuiDialog"}),i=re(),a={enter:i.transitions.duration.enteringScreen,exit:i.transitions.duration.leavingScreen},{"aria-describedby":l,"aria-labelledby":c,BackdropComponent:x,BackdropProps:C,children:Y,className:B,disableEscapeKeyDown:b=!1,fullScreen:v=!1,fullWidth:N=!1,maxWidth:w="sm",onBackdropClick:A,onClose:y,open:p,PaperComponent:g=V,PaperProps:j={},scroll:_="paper",TransitionComponent:S=ne,transitionDuration:X=a,TransitionProps:J}=r,Q=P(r,be),R=n({},r,{disableEscapeKeyDown:b,fullScreen:v,fullWidth:N,maxWidth:w,scroll:_}),F=we(R),I=d.useRef(),Z=M=>{I.current=M.target===M.currentTarget},ee=M=>{I.current&&(I.current=null,A&&A(M),y&&y(M,"backdropClick"))},U=ae(c),oe=d.useMemo(()=>({titleId:U}),[U]);return t.jsx(ye,n({className:f(F.root,B),closeAfterTransition:!0,components:{Backdrop:ve},componentsProps:{backdrop:n({transitionDuration:X,as:x},C)},disableEscapeKeyDown:b,onClose:y,open:p,ref:s,onClick:ee,ownerState:R},Q,{children:t.jsx(S,n({appear:!0,in:p,timeout:X,role:"presentation"},J,{children:t.jsx(je,{className:f(F.container),onMouseDown:Z,ownerState:R,children:t.jsx(Se,n({as:g,elevation:24,role:"dialog","aria-describedby":l,"aria-labelledby":U},j,{className:f(F.paper,j.className),ownerState:R,children:t.jsx(G.Provider,{value:oe,children:Y})}))})}))}))}),Te=Me;function ke(e){return k("MuiDialogActions",e)}T("MuiDialogActions",["root","spacing"]);const We=["className","disableSpacing"],Pe=e=>{const{classes:o,disableSpacing:s}=e;return $({root:["root",!s&&"spacing"]},ke,o)},$e=h("div",{name:"MuiDialogActions",slot:"Root",overridesResolver:(e,o)=>{const{ownerState:s}=e;return[o.root,!s.disableSpacing&&o.spacing]}})(({ownerState:e})=>n({display:"flex",alignItems:"center",padding:8,justifyContent:"flex-end",flex:"0 0 auto"},!e.disableSpacing&&{"& > :not(:first-of-type)":{marginLeft:8}})),Ae=d.forwardRef(function(o,s){const r=W({props:o,name:"MuiDialogActions"}),{className:i,disableSpacing:a=!1}=r,l=P(r,We),c=n({},r,{disableSpacing:a}),x=Pe(c);return t.jsx($e,n({className:f(x.root,i),ownerState:c,ref:s},l))}),Re=Ae;function Be(e){return k("MuiDialogContent",e)}T("MuiDialogContent",["root","dividers"]);function Ne(e){return k("MuiDialogTitle",e)}const _e=T("MuiDialogTitle",["root"]),Fe=_e,Ie=["className","dividers"],Ue=e=>{const{classes:o,dividers:s}=e;return $({root:["root",s&&"dividers"]},Be,o)},Ee=h("div",{name:"MuiDialogContent",slot:"Root",overridesResolver:(e,o)=>{const{ownerState:s}=e;return[o.root,s.dividers&&o.dividers]}})(({theme:e,ownerState:o})=>n({flex:"1 1 auto",WebkitOverflowScrolling:"touch",overflowY:"auto",padding:"20px 24px"},o.dividers?{padding:"16px 24px",borderTop:`1px solid ${(e.vars||e).palette.divider}`,borderBottom:`1px solid ${(e.vars||e).palette.divider}`}:{[`.${Fe.root} + &`]:{paddingTop:0}})),Le=d.forwardRef(function(o,s){const r=W({props:o,name:"MuiDialogContent"}),{className:i,dividers:a=!1}=r,l=P(r,Ie),c=n({},r,{dividers:a}),x=Ue(c);return t.jsx(Ee,n({className:f(x.root,i),ownerState:c,ref:s},l))}),qe=Le;function Oe(e){return k("MuiDialogContentText",e)}T("MuiDialogContentText",["root"]);const ze=["children","className"],Ye=e=>{const{classes:o}=e,r=$({root:["root"]},Oe,o);return n({},o,r)},Xe=h(u,{shouldForwardProp:e=>ie(e)||e==="classes",name:"MuiDialogContentText",slot:"Root",overridesResolver:(e,o)=>o.root})({}),Ke=d.forwardRef(function(o,s){const r=W({props:o,name:"MuiDialogContentText"}),{className:i}=r,a=P(r,ze),l=Ye(a);return t.jsx(Xe,n({component:"p",variant:"body1",color:"text.secondary",ref:s,ownerState:a,className:f(l.root,i)},r,{classes:l}))}),Ve=Ke,Ge=["className","id"],He=e=>{const{classes:o}=e;return $({root:["root"]},Ne,o)},Je=h(u,{name:"MuiDialogTitle",slot:"Root",overridesResolver:(e,o)=>o.root})({padding:"16px 24px",flex:"0 0 auto"}),Qe=d.forwardRef(function(o,s){const r=W({props:o,name:"MuiDialogTitle"}),{className:i,id:a}=r,l=P(r,Ge),c=r,x=He(c),{titleId:C=a}=d.useContext(G);return t.jsx(Je,n({component:"h2",className:f(x.root,i),ownerState:c,ref:s,variant:"h6",id:a??C},l))}),Ze=Qe;var z={},eo=ce;Object.defineProperty(z,"__esModule",{value:!0});var H=z.default=void 0,oo=eo(le()),K=t,to=(0,oo.default)([(0,K.jsx)("circle",{cx:"10",cy:"8",r:"4"},"0"),(0,K.jsx)("path",{d:"M10.67 13.02c-.22-.01-.44-.02-.67-.02-2.42 0-4.68.67-6.61 1.82-.88.52-1.39 1.5-1.39 2.53V20h9.26c-.79-1.13-1.26-2.51-1.26-4 0-1.07.25-2.07.67-2.98zM20.75 16c0-.22-.03-.42-.06-.63l1.14-1.01-1-1.73-1.45.49c-.32-.27-.68-.48-1.08-.63L18 11h-2l-.3 1.49c-.4.15-.76.36-1.08.63l-1.45-.49-1 1.73 1.14 1.01c-.03.21-.06.41-.06.63s.03.42.06.63l-1.14 1.01 1 1.73 1.45-.49c.32.27.68.48 1.08.63L16 21h2l.3-1.49c.4-.15.76-.36 1.08-.63l1.45.49 1-1.73-1.14-1.01c.03-.21.06-.41.06-.63zM17 18c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"},"1")],"ManageAccounts");H=z.default=to;const so=me();function io(){const{userDetails:e,changePass:o,deleteAcct:s,handleLogout:r}=de(),[i,a]=d.useState(""),[l,c]=d.useState(""),[x,C]=d.useState(!1),[Y,B]=d.useState(!1),b=e.userInfo.username,v=e.userInfo.email,N=p=>g=>{g.preventDefault(),p==="delete"?C(!0):p==="password"&&B(!0)},w=()=>{C(!1)},A=async p=>{p.preventDefault();const g=p.target["current-password"].value,j=p.target["new-password"].value,_=p.target["confirm-password"].value;if(j!==_){a("New passwords do not match.");return}try{await o(b,v,g,j)==="pw changed successful"&&(c("Successfully changed password"),a(""))}catch(S){S instanceof Error?a(S.message||"An error occurred"):a("An error occurred"),c("")}},y=async p=>{p.preventDefault();try{await s(b,v)==="successfully deleted account"&&(c("Successfully deleted account"),a("")),w(),setTimeout(()=>{r()},1e3)}catch(g){g instanceof Error?a(g.message||"An error occurred"):a("An error occurred"),c("")}};return t.jsx(pe,{theme:so,children:t.jsxs(ue,{component:"main",maxWidth:"xs",sx:{backgroundColor:"white"},children:[t.jsx(he,{}),t.jsxs(E,{sx:{marginTop:2,display:"flex",flexDirection:"column",alignItems:"center"},children:[t.jsx(xe,{sx:{m:1,bgcolor:"primary.main"},children:t.jsx(H,{})}),t.jsx(u,{component:"h1",variant:"h5",sx:{color:"black",marginBottom:2},children:"Account Settings"}),t.jsx(u,{variant:"subtitle1",gutterBottom:!0,children:"Personal Information"}),t.jsxs(E,{sx:{width:"100%",mb:2,pl:2,pr:2},children:[t.jsxs(u,{variant:"body1",color:"#424242",children:[t.jsx("strong",{children:"First Name:"})," ",e.userInfo.firstname]}),t.jsxs(u,{variant:"body1",color:"#424242",mt:1,children:[t.jsx("strong",{children:"Last Name:"})," ",e.userInfo.lastname]}),t.jsxs(u,{variant:"body1",color:"#424242",mt:1,children:[t.jsx("strong",{children:"Email:"})," ",v]})]}),t.jsx(u,{variant:"subtitle1",gutterBottom:!0,children:"Change Password"}),t.jsx(E,{component:"form",noValidate:!0,onSubmit:A,sx:{mt:1,width:"100%"},children:t.jsxs(m,{container:!0,spacing:2,children:[t.jsx(m,{item:!0,xs:12,children:t.jsx(q,{required:!0,fullWidth:!0,id:"oldpassword",label:"Current Password",name:"current-password",type:"password"})}),t.jsx(m,{item:!0,xs:12,children:t.jsx(q,{required:!0,fullWidth:!0,name:"new-password",label:"New Password",type:"password",id:"new-password"})}),t.jsx(m,{item:!0,xs:12,children:t.jsx(q,{required:!0,fullWidth:!0,name:"confirm-password",label:"Confirm New Password",type:"password",id:"confirm-password"})}),t.jsxs(m,{item:!0,xs:12,children:[i&&t.jsx(u,{color:"error",style:{textAlign:"center",marginTop:"10px"},children:i}),l&&t.jsx(u,{color:"#4caf50",style:{textAlign:"center",marginTop:"10px"},children:l})]}),t.jsx(m,{item:!0,xs:12,children:t.jsx(L,{type:"submit",fullWidth:!0,variant:"contained",sx:{mt:2},children:"Change Password"})}),t.jsx(m,{container:!0,justifyContent:"flex-end",mt:2,children:t.jsxs(m,{item:!0,children:[t.jsx(ge,{href:"/deleteaccount",onClick:N("delete"),variant:"body2",color:"error",children:"Delete your account"}),t.jsxs(Te,{open:x,onClose:w,"aria-labelledby":"alert-dialog-title","aria-describedby":"alert-dialog-description",children:[t.jsx(Ze,{id:"alert-dialog-title",children:"Delete Account"}),t.jsx(qe,{children:t.jsx(Ve,{id:"alert-dialog-description",children:"Are you sure you want to delete your account? This action cannot be undone."})}),t.jsxs(Re,{children:[t.jsx(L,{onClick:w,color:"primary",children:"Cancel"}),t.jsx(L,{onClick:y,color:"primary",autoFocus:!0,children:"Confirm"})]})]})]})})]})})]})]})})}export{io as default};
