"use client";
import {useState} from "react";
import {useCommerce} from "./commerce-context";
type ProductActionItem={id:string;name:string;price:number;image:string;variant:string};
export function AddProductButton({item,bundle=false,bundlePrice}:{item:ProductActionItem;bundle?:boolean;bundlePrice?:number}){const {addToCart}=useCommerce();const [added,setAdded]=useState(false);const target=bundle?{...item,id:`${item.id}-bundle`,name:`${item.name} Complete Look`,price:bundlePrice||item.price}:item;return <button onClick={()=>{addToCart(target);setAdded(true);setTimeout(()=>setAdded(false),1500)}}>{added?"ADDED TO CART ✓":bundle?"ADD COMPLETE LOOK TO CART":"ADD TO CART"}</button>}
export function FavouriteButton({item}:{item:ProductActionItem}){const {toggleFavourite,favourites}=useCommerce();const active=favourites.some(x=>x.id===item.id);return <button aria-label="Toggle favourite" onClick={()=>toggleFavourite(item)}>{active?"♥":"♡"}</button>}
export function AddCustomDrapery(){const {addToCart}=useCommerce();const [added,setAdded]=useState(false);return <button onClick={()=>{addToCart({id:"custom-ripple-drapery",name:"Custom Ripple Fold Drapery",price:545,image:"/figma/home-01.jpeg",variant:"Oatmeal Linen · Pair · Antique Brass"});setAdded(true)}}>{added?"ADDED TO CART ✓":"ADD TO CART"}</button>}
