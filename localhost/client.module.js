

var o_s_prop_name_s_attribute_name = {
    "s_inner_text": "innerText",
}
let f_b_is_js_object = function(value){
    return typeof value === 'object' && value !== null;
}
let f_update_o_js = function(
    o_js
){
    let o_js_rendered = o_js.f_o_js(o_js);
    for(let o_html of o_js._a_o_html){

        var a_s_prop_name = Object.keys(o_js_rendered);
        for(var s_prop_name of a_s_prop_name){
            if(s_prop_name.indexOf("_") == 0){
                continue
            }
    
            let value = o_js_rendered[s_prop_name];
            
            if(
                !Array.isArray(value) 
                    && !f_b_is_js_object(value)
            ){
    
                if(typeof value == "function"){
                    o_html[s_prop_name] = function(){
                        value.call(this, ...arguments, o_js);
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
    }
}

var f_o_html_from_o_js = function(
    o_js, 
    b_init = true
){
    // console.log(o_js)
    var o_js_outer = o_js;

    if(typeof o_js.f_o_js  == "function"){
        o_js = o_js.f_o_js(o_js);
        o_js._a_o_html = o_js_outer._a_o_html
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
    if(!o_js._a_o_html){
        o_js._a_o_html = []
    }
    if(b_init){
        o_js._a_o_html.push(o_html)
    }
    let _a_o_html = [o_html];
    if(b_init){
        _a_o_html = o_js._a_o_html
    }

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
                    value.call(this, ...arguments, o_js);
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

    

    var _f_render = function(){
        
        let o_html_rendered = f_o_html_from_o_js(this, false);
        for(let n_idx in o_js._a_o_html){
            let o_html = o_js._a_o_html[n_idx]
            let o_html_rendered_clone = o_html_rendered.cloneNode(true)
            o_html.parentElement.replaceChild(o_html_rendered_clone, o_html);
            o_js._a_o_html[n_idx] = o_html_rendered_clone
        }
        // console.log(o_js)
    }
    let _f_update = function(){
        f_update_o_js(this);
    }

    o_js_outer._f_render = _f_render;
    o_js_outer._f_update = _f_update;
    o_js_outer._a_o_html = o_js._a_o_html;

    return o_html;
}


export {
    f_o_html_from_o_js
}