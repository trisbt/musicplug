import{u as y,j as e,T as b,C as v,B as m,A as C,a,G as r,b as w,L as u,c as T}from"./index-fc09cdcf.js";import{d as S}from"./LockOutlined-bd5dc4f3.js";import{C as W,T as s}from"./TextField-583391b1.js";import"./Select-4bfd07bf.js";function q(n){return e.jsxs(a,{variant:"body2",color:"text.secondary",align:"center",...n,children:["Copyright © ",e.jsx(u,{color:"inherit",href:"https://mui.com/",children:"MusicPlug"})," ",new Date().getFullYear(),"."]})}const A=T();function k(n){const{handleSignup:d,errorMsg:i,setErrorMsg:c}=y(),x=async l=>{l.preventDefault();const t=l.target,h=t.username.value,p=t.password.value,o=t.email.value,f=t.firstname.value,j=t.lastname.value;if(!o.includes("@")){c("Invalid email format.");return}try{await d(h,o,p,f,j)}catch(g){console.error("Error:",g)}};return e.jsx(b,{theme:A,children:e.jsxs(v,{component:"main",maxWidth:"xs",sx:{backgroundColor:"white"},children:[e.jsx(W,{}),e.jsxs(m,{sx:{marginTop:8,display:"flex",flexDirection:"column",alignItems:"center"},children:[e.jsx(C,{sx:{m:1,bgcolor:"secondary.main"},children:e.jsx(S,{})}),e.jsx(a,{component:"h1",variant:"h5",sx:{color:"black"},children:"Sign up"}),e.jsxs(m,{component:"form",noValidate:!0,onSubmit:x,sx:{mt:3},children:[e.jsxs(r,{container:!0,spacing:2,children:[e.jsx(r,{item:!0,xs:12,sm:6,children:e.jsx(s,{autoComplete:"given-name",name:"firstname",required:!0,fullWidth:!0,id:"firstName",label:"First Name",autoFocus:!0})}),e.jsx(r,{item:!0,xs:12,sm:6,children:e.jsx(s,{required:!0,fullWidth:!0,id:"lastName",label:"Last Name",name:"lastname",autoComplete:"family-name"})}),e.jsx(r,{item:!0,xs:12,children:e.jsx(s,{required:!0,fullWidth:!0,id:"email",label:"Email Address",name:"email",autoComplete:"email"})}),e.jsx(r,{item:!0,xs:12,children:e.jsx(s,{required:!0,fullWidth:!0,id:"username",label:"Username",name:"username",autoComplete:"username"})}),e.jsx(r,{item:!0,xs:12,children:e.jsx(s,{required:!0,fullWidth:!0,name:"password",label:"Password",type:"password",id:"password",autoComplete:"new-password"})})]}),i&&e.jsx(a,{color:"error",children:i}),e.jsx(w,{type:"submit",fullWidth:!0,variant:"contained",sx:{mt:3,mb:2},children:"Sign Up"}),e.jsx(r,{container:!0,justifyContent:"flex-end",children:e.jsx(r,{item:!0,children:e.jsx(u,{href:"/login",variant:"body2",children:"Already have an account? Sign in"})})})]})]}),e.jsx(q,{sx:{mt:5}})]})})}export{k as default};
