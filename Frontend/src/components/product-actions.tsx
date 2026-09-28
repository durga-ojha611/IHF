"use client";
import {useState} from "react";
import {useCommerce} from "./commerce-context";
const item={id:"linen-blend-bedspread",name:"Linen Blend Bedspread",price:430,image:"/figma/home-15.jpeg",variant:"Natural · King"};
export function AddProductButton({bundle=false}:{bundle?:boolean}){const {addToCart}=useCommerce();const [added,setAdded]=useState(false);return <button onClick={()=>{addToCart(bundle?{...item,id:"primary-suite-bundle",name:"Primary Suite Bedding Bundle",price:1227.5}:item);setAdded(true);setTimeout(()=>setAdded(false),1500)}}>{added?"ADDED TO CART ✓":bundle?"ADD COMPLETE LOOK TO CART — SAVE 10%":"BUY BEDSPREAD ONLY — $430"}</button>}
export function FavouriteButton(){const {toggleFavourite,favourites}=useCommerce();const active=favourites.some(x=>x.id===item.id);return <button aria-label="Toggle favourite" onClick={()=>toggleFavourite(item)}>{active?"♥":"♡"}</button>}
export function AddCustomDrapery(){const {addToCart}=useCommerce();const [added,setAdded]=useState(false);return <button onClick={()=>{addToCart({id:"custom-ripple-drapery",name:"Custom Ripple Fold Drapery",price:545,image:"/figma/home-01.jpeg",variant:"Oatmeal Linen · Pair · Antique Brass"});setAdded(true)}}>{added?"ADDED TO CART ✓":"ADD TO CART"}</button>}
