import {
    O_vec2
} from "https://deno.land/x/vector@0.8/mod.js"
import {
    f_o_trn__relative_to_o_html
} from "../functions.module.js"
import { 
    f_o_js_from_params
} from "../../client.module.js"

let s_class = 'overlay_window';
let s_uuid_mod_scope = crypto.randomUUID();
let f_o_js__overlay_window = function(
    a_o_js = [], 
    o_state = {}
){
    let s_uuid_func_scope = crypto.randomUUID(); 
    let s_classes = [s_class, s_uuid_mod_scope, s_uuid_func_scope].join(' ')
    let o_scl = new O_vec2(100);
    let o = Object.assign(
        o_state, 
        {
            o_trn : new O_vec2(0),
            o_scl,
            o_scl_last : o_scl.clone(),
            o_trn_mousedown_relative : new O_vec2(),
            o_trn_mouse : new O_vec2(),
            o_trn_mousedown_scl : new O_vec2(0),
            o_scl_mousedown_scl : new O_vec2(0),
            o_trn_mouse_last : null,
            b_mousedown_drag : false,
            b_mousedown_scale : false,
            b_display : true,
            o_js__overlay_window : null
        }
    )
    window.onmousemove = function(
        o_e
        ){
        //tmp disable text selection 

        // console.log(b_mousedown_scale)
        o.o_trn_mouse = new O_vec2(o_e.clientX, o_e.clientY);
        if(o?.b_mousedown_drag){
            o.o_trn = o.o_trn_mouse.sub(
                o.o_trn_mousedown_relative
                )
        }
        if(o?.b_mousedown_scale){
            let o_br = o?.o_js__overlay_window?._o_html?.getBoundingClientRect();
            o.o_scl_last = new O_vec2(o_br.width, o_br.height)
            if(o?.o_trn_mouse_last){
                o_scl = o?.o_scl_last.add(o?.o_trn_mouse.sub(o?.o_trn_mouse_last))
            }
        }
        if(o?.b_mousedown_drag || o?.b_mousedown_scale){
            document.body.style.userSelect = 'none';
            // console.log(o_js)
            o?.o_js__overlay_window._f_update();
        }else{
            document.body.style.userSelect = '';
        }
        o.o_trn_mouse_last = o?.o_trn_mouse.clone()
    }
    window.onmouseup = function(){
        // enable select
        o.b_mousedown_drag = false
        o.b_mousedown_scale = false
    }
    return f_o_js_from_params(
        o, 
        'o_js__overlay_window', 
        {
            f_o_jsh: function(){
                return {
                    class: s_classes,
                    style: [
                        // `background-color: red`, 
                        // `border:2px solid blue`,
                        `position:absolute`,
                        `left: ${o.o_trn.n_x}px`,
                        `top: ${o.o_trn.n_y}px`,
                        `min-width: ${o.o_scl.n_x}px`, 
                        `min-height: ${o.o_scl.n_y}px`, 
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
                                o.o_trn_mousedown_relative = f_o_trn__relative_to_o_html(
                                    new O_vec2(o_e.clientX, o_e.clientY),
                                    o_e.target
                                );
                                // console.log(o_trn_mousedown_relative.toString())
                                if(!o.b_mousedown_scale){
                                    o.b_mousedown_drag = true;
                                }
                            },
                            onmosueup: function(){
                                o.b_mousedown_drag = false
                                o.b_mousedown_scale = false
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
                                o.b_display = !o.b_display;
                                o?.o_js__overlay_window._f_render()
                            },
                        },
                        {
                            style: `display: ${(o.b_display)?"flex": 'none'}`,
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
                                o.o_trn_mousedown_scl = new O_vec2(
                                    o_e.clientX,
                                    o_e.clientY
                                );
                                o.o_scl_last = o_scl.clone()
                                o.b_mousedown_drag = false
                                o.b_mousedown_scale = true
                            },
                            onmosueup: function(){
                                o.b_mousedown_drag = false
                                o.b_mousedown_scale = false
                            }
                        },
                    ],
                    
                } 
            }
        }
    )
}
let s_css = `
.${s_class}.${s_uuid_mod_scope} .clickable:hover{
    background:red;
}
`
export {
    f_o_js__overlay_window, 
    s_css
}