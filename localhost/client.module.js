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


var f_o_html__and_make_renderable = async function(
    o_js, 
){

    return new Promise(
        async (f_res)=>{
            // if(!o_js._s_uuid){
            //     o_js._s_uuid = crypto.randomUUID();
            // }
            // console.log('run')
            if(!o_js?._b_f_render_called){
                o_js._a_o_html = [];
                // console.log('needs rendering!')
                if(typeof o_js.f_o_jsh != 'function'){
                    // static objects can be rendered/converted to html once without having any function    
                    o_js.o_jsh = o_js;
                }else{
                    o_js.o_jsh = await o_js.f_o_jsh();
                }
                // we could create the o_html element here and then clone it ,but because
                // cloneNode(true) does not deep copy functions added with o_html.onclick =...
                // we anyways have to create a new element for each reference
                // retrun o_js._o_html.cloneNod(true)// not working because event listeners are not cloned...:( 
            }
            // we create a new element from the o_jsh information
            o_js._o_html = f_o_html__from_o_jsh(
                o_js.o_jsh, 
                o_js
            );
            // o_js._o_html.setAttribute('data-s_uuid', crypto.randomUUID());
            o_js._a_o_html.push(o_js._o_html)
        
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
                            f_o_html__and_make_renderable(o)
                        )
                        // let o_html_child = await f_o_html__and_make_renderable(o);
                        // o_js._o_html.appendChild(
                        //     o_html_child
                        // )//.cloneNode(true))

                        // f_o_html__and_make_renderable(o).then(
                        //     (o_html)=>{
                        //         o_js._o_html.appendChild(
                        //             o_html
                        //         )//.cloneNode(true))
                        //     }
                        // );
                    }
                }
            }
            let a_v_resolved = await Promise.all(a_o_promise);
            for(let v of a_v_resolved){
                // console.log(v)
                o_js._o_html.appendChild(
                    v
                )
            }
            o_js._b_f_render_called = true;
        
            o_js._f_render = async function(){
                
                let o_self = o_js;//this;
                o_self._b_f_render_called = false;
                let a_o_html_old = o_self._a_o_html;
                return Promise.all(
                    a_o_html_old.map(o_html_old=>{
                        return f_o_html__and_make_renderable(o_self).then(o_html=>{
                            o_html_old.parentElement.replaceChild(
                                o_html,
                                o_html_old, 
                            )
                        })
                    })
                )
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
                // console.log(o_js)
                o_js.o_jsh = await o_js.f_o_jsh();
                for(let o_html of o_js._a_o_html){
                    f_update_o_html_from_o_jsh(
                        o_html,
                        o_js.o_jsh,
                        o_js
                    )
                }
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

export {
    f_o_html__and_make_renderable, 
    f_o_js_from_params
}

export * from './examples/color_picker/mod.js'
export * from './examples/notifire/mod.js'
export * from './examples/overlay_window/mod.js'
export * from './examples/select/mod.js'