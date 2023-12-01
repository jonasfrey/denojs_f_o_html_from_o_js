// Assuming you have a function to add event listeners that also tracks them
function addEventListenerWithTracking(element, event, handler) {
    if(event.startsWith('on')){
        event = event.substring(2)
    }
    if (!element.eventListenerList) {
        element.eventListenerList = [];
    }
    element.eventListenerList.push({ event, handler });
    element.addEventListener(event, handler);


    // For debugging
    console.log('Added event:', event, 'to element:', element);
    console.log('Current event listeners:', element.eventListenerList)
}

// Function to clone an element and its event listeners
function cloneWithEventListeners(original) {
    const clone = original.cloneNode(true);

    if (original.eventListenerList) {
        for (let { event, handler } of original.eventListenerList) {
            clone.addEventListener(event, handler);
            // For debugging
            console.log(`Added event: ${event} to cloned element`);
            console.log('cloned element')
            console.log(clone)
        }
    }

    const children = [...original.children];
    const clonedChildren = [...clone.children];
    children.forEach((child, index) => {
        cloneWithEventListeners(child, clonedChildren[index]);
    });

    return clone;
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
                let f_event_handler = function(){
                    value.call(this, ...arguments, o_jsh);
                }
                addEventListenerWithTracking(
                    o_html, 
                    s_prop_name, 
                    f_event_handler
                )
                // o_html.addEventListener(s_prop_name,f_event_handler) 
               
            }
            if(typeof value != 'function'){
                // some attributes such as 'datalist' do only have a getter
                try {
                    o_html[s_prop_name] = value;
                } catch (error) {
                    console.warn(error)
                    try {
                        o_html.setAttribute(s_prop_name, value);
                    } catch (error) {
                        console.warn(error)
                    }
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
    f_update_o_html_from_o_jsh(
        o_html, 
        o_jsh
    );
    return o_html
}


var f_make_renderable = function(
    o_js, 
){
    if(!o_js._s_uuid){
        o_js._s_uuid = crypto.randomUUID();
    }
    console.log('run')
    if(!o_js?._b_f_render_called){
        o_js._a_o_html = [];
        console.log('needs rendering!')
        if(typeof o_js.f_o_jsh != 'function'){
            // static objects can be rendered/converted to html once without having any function    
            o_js.o_jsh = o_js;
        }else{
            o_js.o_jsh = o_js.f_o_jsh();
        }
        o_js._o_html = f_o_html__from_o_jsh(o_js.o_jsh);
        o_js._o_html.setAttribute('data-s_uuid', crypto.randomUUID());
        o_js._a_o_html.push(o_js._o_html)
    }else{
        console.log('already rendered!')
        // let _o_html_clone = o_js._o_html.cloneNode(true)
        let _o_html_clone = cloneWithEventListeners(o_js._o_html)
        o_js._a_o_html.push(_o_html_clone);
        return _o_html_clone
    }
    // console.log(o_js._o_html)

    // let _o_html_parent_old = o_js?._o_html?.parentElement;
    // let _o_html__old = o_js?._o_html;


    // console.log(o_js._o_html)
    for(let s_prop in o_js.o_jsh){
        let v = o_js.o_jsh[s_prop];
        if(!f_b_allowed_propery_name_on_o_jsh(s_prop)){
            continue
        }

        if(Array.isArray(v)){
            for(let o of v){
                // debugger
                // o._b_f_render_called = o_js._b_f_render_called
                let o_html = f_make_renderable(o);

                o_js._o_html.appendChild(
                    o_html
                )//.cloneNode(true))
            }
        }
    }
    o_js._b_f_render_called = true;

    o_js._f_render = function(){
        this._b_f_render_called = false;
        let a_o_html_old = this._a_o_html;
        for(let o_html_old of a_o_html_old){
            let o_html = f_make_renderable(this)
            console.log(o_html_old.parentElement.replaceChild(
                o_html,
                o_html_old, 
            ))
        }
    }
    o_js._f_update = function(){
        console.log(o_js)
        o_js.o_jsh = o_js.f_o_jsh();
    }
    
    return o_js._o_html
    // if(!o_js._b_f_render_called){
    //     // if the o_js is reference multiple times in a parent o_js, 
    //     // it should be rendered only once
    //     o_js.o_jsh = o_js.f_o_jsh(o_js);
    // }

    // for(let s_prop in o_js.o_jsh){

    //     let v = o_js.o_jsh[s_prop];
    //     if(Array.isArray(v)){
    //         for(let o of v){
    //             o._b_f_update_called = false;
    //             o._b_f_render_called = false;
    //             f_make_renderable(o)
                
    //         }
    //     }
    // }

    // if(!o_js._b_f_render_called){
        
    //     o_js._o_html = f_o_html__from_o_jsh(o_js.o_jsh);
    //     o_js._o_html.setAttribute('data-s_uuid', o_js._s_uuid);
    //     o_js._b_f_render_called = true;

    //     for(let s_prop in o_js.o_jsh){
    //         let v = o_js.o_jsh[s_prop];
    //         if(Array.isArray(v)){
    //             for(let o of v){
    //                 console.log('asdf')
    //                 o_js._o_html.appendChild(
    //                     o._o_html
    //                 )
                    
    //             }
    //         }
    //     }
    // }

    // o_js._f_render = function(){

    //     console.log(this)
    //     this._b_f_update_called = false;
    //     this._b_f_render_called = false;
    //     let o_parent = this?._o_html?.parentElement;
    //     let o_child_old = this?._o_html;
    //     f_make_renderable(this, false, true);
    //     if(o_parent){
    //         o_parent.replaceChild(
    //             this._o_html, 
    //             o_child_old
    //         )
    //     }

    // }

    // o_js._f_update = function(){
    //     console.log(this)
    //     this._b_f_update_called = false;
    //     this._b_f_render_called = false;
    //     this.o_jsh = this.f_o_jsh(this);
    //     console.log(
    //         this._o_html, this.o_jsh
    //     )
    //     f_update_o_html_from_o_jsh(this._o_html, this.o_jsh);
    // }

    // if(b_init || b_render){
    //     o_js._b_f_render_called = true
    //     o_js._b_f_update_called = false;
    // }else{
    //     o_js._b_f_update_called = true;
    // }

    // return o_js;
}


export {
    f_make_renderable
}