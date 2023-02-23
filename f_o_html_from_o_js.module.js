
// import { f_generate_markdown } from "https://deno.land/x/f_generate_markdown@0.7/mod.js";

var o_s_prop_name_s_attribute_name = {
    "s_inner_text": "innerText",
}
let f_b_is_js_object = function(value){
    return typeof value === 'object' && value !== null;
}
var f_o_html_from_o_js = function(
    o_js
){
    // console.log(o_js)
    if(!f_b_is_js_object(o_js)){
        // o_js has to be object, 
        return null
    }
    if(o_js.b_render === false){
        return null
    }
    var s_tag = (o_js.s_tag ? o_js.s_tag : 'div'); 
    var o_html = document.createElement(s_tag);
    var a_s_prop_name = Object.keys(o_js);
    for(var s_prop_name of a_s_prop_name){
        var value = o_js[s_prop_name];
        
        if(Array.isArray(value)){
            for(var item of value){
                var o_html_child = f_o_html_from_o_js(item);
                if(o_html_child !== null){
                    o_html.appendChild(o_html_child)
                }
            }
        }
        if(
            !Array.isArray(value) 
              && !f_b_is_js_object(value)
        ){
            o_html[s_prop_name] = value;
            if(typeof value != 'function'){
                o_html.setAttribute(s_prop_name, value);
            }
        }
        // o_html.addEventListener(s_prop_name, value);

    }

    return o_html;
}


export {f_o_html_from_o_js}