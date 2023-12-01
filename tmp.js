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
    o_jsh
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
                o_html[s_prop_name] = function(){
                    value.call(this, ...arguments, o_jsh);
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
    }
}
let f_o_html__from_o_jsh = function(
    o_jsh
){

    var s_tag = (o_jsh.s_tag ? o_jsh.s_tag : 'div'); 
    let o_html = document.createElement(s_tag);

    for(var s_prop_name of Object.keys(o_jsh)){
        if(!f_b_allowed_propery_name_on_o_jsh(s_prop_name)){
            continue
        }
        let value = o_jsh[s_prop_name];
        f_update_o_html_from_o_jsh(
            o_html, 
            o_jsh
        );

        if(Array.isArray(value)){
            for(let o of value){
                o_html.appendChild(
                    f_o_html__from_o_jsh(o)
                )
            }
        }

    }

    return o_html
}


var f_make_renderable = function(
    o_js, 
    b_init = true, 
    b_render = false
){
    if(!o_js._s_uuid){
        o_js._s_uuid = crypto.randomUUID();
    }

    if(!o_js._a_o_html_parent){
        o_js._a_o_html_parent = []
    }

    if(!f_b_is_js_object(o_js)){
        // o_js has to be object, 
        return null
    }
    if(o_js?.o_jsh?.b_render === false){
        return null
    }

    if(typeof o_js.f_o_jsh != 'function'){
        // static objects can be rendered/converted to html once without having any function 
        let o_jsh = o_js
        o_js.f_o_jsh = function(){
            return o_jsh
        }
    }

    if(!o_js._b_f_render_called){
        // if the o_js is reference multiple times in a parent o_js, 
        // it should be rendered only once
        o_js.o_jsh = o_js.f_o_jsh(o_js);
    }

    for(let s_prop in o_js.o_jsh){

        let v = o_js.o_jsh[s_prop];
        if(Array.isArray(v)){
            for(let o of v){
                o._b_f_update_called = false;
                o._b_f_render_called = false;
                f_make_renderable(o)
                
            }
        }
    }

    if(!o_js._b_f_render_called){
        
        o_js._o_html = f_o_html__from_o_jsh(o_js.o_jsh);
        o_js._o_html.setAttribute('data-s_uuid', o_js._s_uuid);
        o_js._b_f_render_called = true;

        for(let s_prop in o_js.o_jsh){
            let v = o_js.o_jsh[s_prop];
            if(Array.isArray(v)){
                for(let o of v){
                    console.log('asdf')
                    o_js._o_html.appendChild(
                        o._o_html
                    )
                    
                }
            }
        }
    }

    o_js._f_render = function(){

        console.log(this)
        this._b_f_update_called = false;
        this._b_f_render_called = false;
        let o_parent = this?._o_html?.parentElement;
        let o_child_old = this?._o_html;
        f_make_renderable(this, false, true);
        if(o_parent){
            o_parent.replaceChild(
                this._o_html, 
                o_child_old
            )
        }

    }

    o_js._f_update = function(){
        console.log(this)
        this._b_f_update_called = false;
        this._b_f_render_called = false;
        this.o_jsh = this.f_o_jsh(this);
        console.log(
            this._o_html, this.o_jsh
        )
        f_update_o_html_from_o_jsh(this._o_html, this.o_jsh);
    }

    if(b_init || b_render){
        o_js._b_f_render_called = true
        o_js._b_f_update_called = false;
    }else{
        o_js._b_f_update_called = true;
    }

    return o_js;
}


export {
    f_make_renderable
}