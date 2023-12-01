import {
    O_vec2
} from "https://deno.land/x/vector@0.8/mod.js"

let f_o_trn__relative_to_o_html = function(
    o_e
){
    const o_brect  = o_e.target.getBoundingClientRect();
    return new O_vec2(
        o_e.clientX - o_brect.left, 
        o_e.clientY - o_brect.top
    )
}

let f_o_js__draggable_window = function(
    a_o_js = []
){

    let o_trn = new O_vec2(0)
    let o_scl = new O_vec2(100);
    let o_scl_last = o_scl.clone();
    let o_trn_mousedown_relative = new O_vec2();
    let o_trn_mouse = new O_vec2();
    let o_trn_mousedown_scl = new O_vec2(0);
    let o_scl_mousedown_scl = new O_vec2(0);
    let o_trn_mouse_last = null;
    let b_mousedown_drag = false;
    let b_mousedown_scale = false;
    let b_display = true;
    let b_added_event_listener = false;
    let o_js__draggable_window = null;
    let f_add_mousemove_if_not_already = function(
        o_js
    ){
        if(!b_added_event_listener){
            window.onmousemove = function(
                o_e
                ){
                //tmp disable text selection 

                // console.log(b_mousedown_scale)
                o_trn_mouse = new O_vec2(o_e.clientX, o_e.clientY);
                if(b_mousedown_drag){
                    o_trn = o_trn_mouse.sub(
                        o_trn_mousedown_relative
                        )
                }
                if(b_mousedown_scale){
                    let o_br = o_js__draggable_window._o_html.getBoundingClientRect();
                    o_scl_last = new O_vec2(o_br.width, o_br.height)
                    // console.log(o_scl_last)
                    // console.log(o_trn_mousedown_scl.sub(
                    //     o_trn_mouse
                    // ))
                    
                    // o_scl = o_scl_last.sub(
                    //     o_trn_mousedown_scl.sub(
                    //         o_trn_mouse
                    //     )
                    // )
                    if(o_trn_mouse_last){
                        o_scl = o_scl_last.add(o_trn_mouse.sub(o_trn_mouse_last))
                    }
                }
                if(b_mousedown_drag || b_mousedown_scale){
                    document.body.style.userSelect = 'none';
                    console.log(o_js)
                    o_js__draggable_window._f_update();
                }else{
                    document.body.style.userSelect = '';
                }
                o_trn_mouse_last = o_trn_mouse.clone()
            }
            window.onmouseup = function(){
                // enable select
                b_mousedown_drag = false
                b_mousedown_scale = false
            }

            b_added_event_listener = true;
        }
    }
    o_js__draggable_window = {
        f_o_jsh: function(){
            return {
                class: "draggable_window",
                style: [
                    // `background-color: red`, 
                    // `border:2px solid blue`,
                    `position:absolute`,
                    `left: ${o_trn.n_x}px`,
                    `top: ${o_trn.n_y}px`,
                    `min-width: ${o_scl.n_x}px`, 
                    `min-height: ${o_scl.n_y}px`, 
                ].join(";"), 
                a_o: [
                    {
                        style: [
                            `width: 100%`, 
                            `height:1rem`, 
                            `cursor:move`,
                            // `position: absolute`, 
                            `top: 0`, 
                            `left: 0`,
                            `z-index: 10`, 
                        ].join(`;`),
                        class: `clickable`, 
                        onmousedown: function(o_e, o_js){
                            o_trn_mousedown_relative = f_o_trn__relative_to_o_html(o_e);
                            // console.log(o_trn_mousedown_relative.toString())
                            f_add_mousemove_if_not_already(o_js)
                            if(!b_mousedown_scale){
                                b_mousedown_drag = true;
                            }
                        },
                        onmosueup: function(){
                            b_mousedown_drag = false
                            b_mousedown_scale = false
                        }
                    },
                    {
                        style: [
                            `width: 1rem`, 
                            `height:1rem`, 
                            `position: absolute`, 
                            `top: 0`, 
                            `right: 0`,
                            `z-index: 10`, 
                        ].join(`;`),
                        class: `clickable`, 
                        onclick: function(o_e){
                            b_display = !b_display;
                            o_js__draggable_window._f_render()
                        },
                    },
                    {
                        style: `display: ${(b_display)?"flex": 'none'}`,
                        a_o: a_o_js
                    },
                    {
                        style: [
                            `width: 1rem`, 
                            `height:1rem`, 
                            `cursor:nwse-resize`,
                            `position: absolute`, 
                            `bottom: 0`, 
                            `right: 0`,
                            `z-index: 10`, 
                        ].join(`;`),
                        class: `clickable`, 
                        onmousedown: function(o_e,o_js){
                            f_add_mousemove_if_not_already(o_js)
                            o_trn_mousedown_scl = new O_vec2(
                                o_e.clientX,
                                o_e.clientY
                            );
                            o_scl_last = o_scl.clone()
                            b_mousedown_drag = false
                            b_mousedown_scale = true
                        },
                        onmosueup: function(){
                            b_mousedown_drag = false
                            b_mousedown_scale = false
                        }
                    },
                ],
                
            } 
        }
    }
    return o_js__draggable_window
}
export {
    f_o_js__draggable_window
}