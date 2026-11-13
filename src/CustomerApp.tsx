import { FormEvent, useEffect, useMemo, useState } from "react";
import { addDoc, collection, onSnapshot, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

type Product = { id:string; name:string; sku?:string; unit:string; price:number; stock:number };
type CartLine = { product:Product; qty:number };

const ownerId = import.meta.env.VITE_BUSINESS_OWNER_UID || "";
const money = (n:number) => new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:2}).format(n||0);

export default function CustomerApp(){
 const [products,setProducts]=useState<Product[]>([]);
 const [cart,setCart]=useState<CartLine[]>([]);
 const [search,setSearch]=useState("");
 const [name,setName]=useState("");
 const [phone,setPhone]=useState("");
 const [address,setAddress]=useState("");
 const [note,setNote]=useState("");
 const [sending,setSending]=useState(false);
 const [error,setError]=useState("");
 const [success,setSuccess]=useState("");
 const [loading,setLoading]=useState(true);

 useEffect(()=>{
  if(!db||!ownerId){setLoading(false);setError("The store is not connected yet. Please contact the business owner.");return;}
  return onSnapshot(collection(db,"businesses",ownerId,"publicProducts"),snap=>{
   setProducts(snap.docs.map(d=>({id:d.id,...d.data()} as Product)).filter(p=>p.stock>0));
   setLoading(false);
  },()=>{setError("Could not load products. Please try again later.");setLoading(false);});
 },[]);

 const visible=useMemo(()=>products.filter(p=>(p.name+" "+(p.sku||"")).toLowerCase().includes(search.toLowerCase())),[products,search]);
 const count=cart.reduce((n,l)=>n+l.qty,0);
 const add=(p:Product)=>setCart(old=>{const found=old.find(x=>x.product.id===p.id);return found?old.map(x=>x.product.id===p.id?{...x,qty:Math.min(p.stock,x.qty+1)}:x):[...old,{product:p,qty:1}];});
 const changeQty=(id:string,qty:number)=>setCart(old=>old.map(l=>l.product.id===id?{...l,qty}:l).filter(l=>l.qty>0));
 const submit=async(e:FormEvent)=>{
  e.preventDefault();setError("");setSuccess("");
  if(!db||!ownerId){setError("The store is not configured.");return;}
  if(!cart.length){setError("Please add at least one product.");return;}
  if(!/^[0-9+() -]{10,16}$/.test(phone.trim())){setError("Please enter a valid phone number.");return;}
  setSending(true);
  try{
   const ref=await addDoc(collection(db,"businesses",ownerId,"orders"),{
    customerName:name.trim(),phone:phone.trim(),address:address.trim(),note:note.trim(),
    items:cart.map(l=>({productId:l.product.id,name:l.product.name,qty:l.qty,unit:l.product.unit})),
    status:"New",createdAt:serverTimestamp()
   });
   setSuccess("Booking received! Your reference is "+ref.id.slice(-8).toUpperCase()+". We will call you to confirm the order and payment.");
   setCart([]);setName("");setPhone("");setAddress("");setNote("");
  }catch(err){setError(err instanceof Error?err.message:"Booking could not be submitted. Please try again.");}
  finally{setSending(false);}
 };

 return <div className="customer-app">
  <header className="customer-header"><a className="customer-brand" href="#top"><span className="customer-logo">N</span><span><b>NEXORA</b><small>WHOLESALE STORE</small></span></a><a className="cart-pill" href="#booking">Booking <b>{count}</b></a></header>
  <main id="top" className="customer-main">
   <section className="customer-hero"><p>WELCOME TO OUR STORE</p><h1>Wholesale products,<br/>made simple.</h1><span>Browse our available products and send a booking. We will call you to confirm the order, final price and payment.</span></section>
   <section className="catalog-section"><div className="catalog-heading"><div><p className="customer-eyebrow">OUR CATALOGUE</p><h2>Available products</h2></div><input aria-label="Search products" placeholder="Search products..." value={search} onChange={e=>setSearch(e.target.value)}/></div>
    {loading?<p className="customer-empty">Loading products…</p>:visible.length?<div className="product-grid">{visible.map(p=><article className="customer-product" key={p.id}><div className="product-symbol">N</div><div className="product-info"><h3>{p.name}</h3><p>{p.sku||"Available for wholesale"}</p><div className="product-price">{money(p.price)} <small>/ {p.unit}</small></div><small className="product-stock">Available: {p.stock} {p.unit}</small></div><button onClick={()=>add(p)} disabled={cart.some(l=>l.product.id===p.id&&l.qty>=p.stock)}>Add to booking</button></article>)}</div>:<p className="customer-empty">{error||"No products are available right now."}</p>}
   </section>
   <section id="booking" className="booking-section"><div><p className="customer-eyebrow">NO ONLINE PAYMENT</p><h2>Your booking</h2><p className="booking-intro">Send your request now. We will phone you to confirm availability, final pricing and how to pay. No money is collected in this app.</p></div>
    <div className="booking-layout"><div className="booking-cart">{cart.length?cart.map(l=><div className="cart-line" key={l.product.id}><div><b>{l.product.name}</b><small>{l.product.unit}</small></div><div className="qty-control"><button type="button" onClick={()=>changeQty(l.product.id,l.qty-1)}>−</button><span>{l.qty}</span><button type="button" onClick={()=>changeQty(l.product.id,Math.min(l.product.stock,l.qty+1))}>+</button></div></div>):<p className="customer-empty">Your booking list is empty. Add products above.</p>}</div>
     <form className="customer-form" onSubmit={submit}><label>Full name<input required minLength={2} maxLength={100} value={name} onChange={e=>setName(e.target.value)} placeholder="Your name"/></label><label>Phone number<input required type="tel" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="Mobile number"/></label><label>Delivery address<textarea required minLength={5} maxLength={500} value={address} onChange={e=>setAddress(e.target.value)} placeholder="Full address"/></label><label>Note (optional)<textarea maxLength={500} value={note} onChange={e=>setNote(e.target.value)} placeholder="Any special requirement"/></label>{error&&<p className="customer-error">{error}</p>}{success&&<p className="customer-success">{success}</p>}<button className="submit-booking" disabled={sending||!cart.length}>{sending?"Sending booking…":"Submit booking request"}</button><small className="payment-note">Booking only · Pay later after our phone confirmation</small></form>
    </div>
   </section>
  </main><footer className="customer-footer">© {new Date().getFullYear()} Nexora Wholesale Store</footer>
 </div>;
}
