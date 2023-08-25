let document = window.document;
if( "Deno" in window){
    let o_mod_deno_dom = await import("https://deno.land/x/deno_dom/deno-dom-wasm.ts")
    // console.log(o_mod_deno_dom)
    document = new o_mod_deno_dom.Document()
    // console.log(document)
    let el = document.createElement("div");
    // console.log(el)
}

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
    var o_js_outer = o_js;

    if(typeof o_js.f_o_js  == "function"){
        o_js = o_js.f_o_js(o_js);
    }

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
        if(s_prop_name.indexOf("_") == 0){
            continue
        }

        let value = o_js[s_prop_name];
        
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

            if(typeof value == "function"){
                o_html[s_prop_name] = function(){
                    value.call(this, o_js);
                } 
            }
            if(typeof value != 'function'){
                // some attributes such as 'datalist' do only have a getter
                try {
                    o_html[s_prop_name] = value;
                } catch (error) {
                    console.warn(error)
                }
                try {
                    o_html.setAttribute(s_prop_name, value);
                } catch (error) {
                    console.warn(error)
                }
            }
        }
        // o_html.addEventListener(s_prop_name, value);

    }
    o_js._o_html = o_html;
    var _f_render = function(){
        var o_html_old = o_js._o_html;
        o_js._o_html = f_o_html_from_o_js(this);
        if(o_js._o_html instanceof HTMLElement){
            if(o_html_old?.parentElement){
                o_html_old.parentElement.replaceChild(o_js._o_html, o_html_old);
            }
        }
    }
    o_js._f_render = _f_render;
    o_js_outer._f_render = _f_render;
    o_js_outer._o_html = o_html;
    return o_html;
}


export {
    f_o_html_from_o_js
}