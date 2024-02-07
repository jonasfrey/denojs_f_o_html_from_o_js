let o_DOMParser = null; 
if("Deno" in window){
    o_DOMParser = (await import("https://deno.land/x/deno_dom@v0.1.43/deno-dom-wasm.ts")).DOMParser;
}
let f_o_html_element__from_s_tag = function(s_tag){
    
    let o_doc;
    if("Deno" in window){
        o_doc = new o_DOMParser().parseFromString(
            '<div></div>',
            'text/html'
        );
    }else{
        o_doc = document;
    }
    return o_doc.createElement(s_tag);

}

let f_b_is_js_object = function(value){
    return typeof value === 'object' && value !== null;
}
let f_b_allowed_propery_name_on_o_jsh = function(
    s_prop_name
){
    if(s_prop_name.indexOf("_") == 0){
        //properties starting with _ are reserved for special cases like 
        //_f_render
        //_f_update
        return false
    }
    return true;
}
let f_update_o_html_from_o_jsh = function(
    o_html, 
    o_jsh, 
    o_js
){
    //update does not go into arrays
    for(var s_prop_name of Object.keys(o_jsh)){
        if(!f_b_allowed_propery_name_on_o_jsh(s_prop_name)){
            continue
        }
        let value = o_jsh[s_prop_name];
        
        if(
            !Array.isArray(value) 
                && !f_b_is_js_object(value)
        ){

            if(typeof value == "function"){
                let f_event_handler = function(){
                    value.call(this, ...arguments, o_js);
                }

                o_html[s_prop_name] = f_event_handler
               
            }
            if(typeof value != 'function'){
                // some attributes such as 'datalist' do only have a getter
                try {
                    o_html[s_prop_name] = value;
                } catch (error) {
                    console.warn(error)
                }
                // console.log(o_html)
                try {
                    o_html.setAttribute(s_prop_name, value);
                } catch (error) {
                    console.warn(error)
                }
            }
        }
    }
}
let f_o_html__from_o_jsh = function(
    o_jsh, 
    o_js
){
    var s_tag = (o_jsh.s_tag ? o_jsh.s_tag : 'div'); 
    let o_html = f_o_html_element__from_s_tag(s_tag);
    f_update_o_html_from_o_jsh(
        o_html, 
        o_jsh, 
        o_js
    );
    return o_html
}


var f_v_o_html__and_make_renderable = async function(
    o_js, 
){

    return new Promise(
        async (f_res)=>{
            // if(!o_js._s_uuid){
            //     o_js._s_uuid = crypto.randomUUID();
            // }            
            // so the initial thought was to be able to place multiple references of the same object
            // as child objects and then only one has to be rendered and since the others are the same reference
            // the already rendered content could be used / unfortunately this will then not render the child object 
            // if it is dynamically exchanged in the parent /therefore i disable it again in this version
            if(o_js?.b_render == false){
                return f_res(null);
            }
            if(typeof o_js.f_o_jsh != 'function'){
                // static objects can be rendered/converted to html once without having any function    
                o_js.o_jsh = o_js;
            }else{
                o_js.o_jsh = await o_js.f_o_jsh();
            }

            // we create a new element from the o_jsh information
            o_js._o_html = f_o_html__from_o_jsh(
                o_js.o_jsh, 
                o_js
            );
            // o_js._o_html.setAttribute('data-s_uuid', crypto.randomUUID());
        
            let a_o_promise = []
            for(let s_prop in o_js.o_jsh){
                let v = o_js.o_jsh[s_prop];
                if(!f_b_allowed_propery_name_on_o_jsh(s_prop)){
                    continue
                }
        
                if(Array.isArray(v)){
                    for(let o of v){
                        // debugger
                        // o._b_f_render_called = o_js._b_f_render_called
                        a_o_promise.push(
                            f_v_o_html__and_make_renderable(o)
                        )

                    }
                }
            }
            let a_v_resolved = await Promise.all(a_o_promise);
            for(let v of a_v_resolved){
                // console.log(v)
                if(v){
                    o_js._o_html.appendChild(
                        v
                    )
                }
            }
            o_js._b_f_render_called = true;
        
            o_js._f_render = async function(){
                
                let o_self = o_js;//this;
                o_self._b_f_render_called = false;
                let o_html_old = o_self._o_html
                return f_v_o_html__and_make_renderable(o_self).then(v_o_html=>{
                        if(v_o_html){
                            o_html_old.parentElement.replaceChild(
                                v_o_html,
                                o_html_old, 
                            )
                        }
                })
                
                // for(let o_html_old of a_o_html_old){
                //     f_o_html__and_make_renderable(this).then(o_html=>{
                //         o_html_old.parentElement.replaceChild(
                //             o_html,
                //             o_html_old, 
                //         )
                //     })
                // }
            }
            o_js._f_update = async function(){
                o_js.o_jsh = await o_js.f_o_jsh();
                f_update_o_html_from_o_jsh(
                    o_js._o_html,
                    o_js.o_jsh,
                    o_js
                )
            }
            
            return f_res(o_js._o_html)
        }
    )
}


let f_o_js_from_params = function(o_o_js, s_name, o){
    if(!o_o_js[s_name]){
        o_o_js[s_name] = o
    }else{
        return o_o_js[s_name]
    }
    return o
}
let f_o_html__and_make_renderable = f_v_o_html__and_make_renderable 
export {
    f_o_html__and_make_renderable,
    f_v_o_html__and_make_renderable, 
    f_o_js_from_params
}

