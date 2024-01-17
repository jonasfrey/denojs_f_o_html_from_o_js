

import {
    O_vec2
} from "https://deno.land/x/vector@0.8/mod.js"

let f_o_trn__relative_to_o_html = function(
    o_trn_mouse, 
    o_el
){
    const o_brect  = o_el.getBoundingClientRect();
    
    return o_trn_mouse.sub(o_brect.left, o_brect.top); 
    
}
let f_o_trn__relative_to_o_html__nor = function(
    o_trn_mouse, 
    o_el
){
    const o_brect  = o_el.getBoundingClientRect();
    
    let o_trn = new O_vec2(o_brect.left, o_brect.top);
    let o_scl = new O_vec2(o_brect.width, o_brect.height);
    return o_trn_mouse.sub(o_trn).div(o_scl); 
    
}
let f_s_selector_css_from_s_uuid = function(s_uuid){
    // since a uuid does not always start with a char but a number 
    // it wont be a valid css selector
    return `mod_${s_uuid}`
}
export {
    f_o_trn__relative_to_o_html, 
    f_o_trn__relative_to_o_html__nor, 
    f_s_selector_css_from_s_uuid
}