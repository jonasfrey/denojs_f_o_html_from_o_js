import {
    f_add_css,
    f_s_css_prefixed,
} from "https://deno.land/x/f_add_css@1.1/mod.js"

import { 
    f_s_css_class_from_s_uuid
} from "../functions.module.js"
let s_class = 'gamepad';


class O_notification{
    constructor(
        s_text, 
        s_type, 
        s_position_x, 
        s_position_y,
        b_timeout, 
        n_ms_initial,
        n_ms_left, 
    ){
        this.s_type = s_type
        this.s_text = s_text
        this.s_position_x = s_position_x
        this.s_position_y = s_position_y
        this.b_timeout = b_timeout
        this.n_ms_initial = n_ms_initial
        this.n_ms_left = n_ms_left 
        this.o_js = null
        this.o_js__bar = null
        this.n_id_raf = 0
        let o_self = this
        this.n_wpf = window.performance.now();
        this.n_wpf_last = window.performance.now();
        this.f_raf = async ()=>{
            // console.log(`${o_self.n_wpf} raf ${o_self.n_ms_left}`)
            if(o_self.n_ms_left < 0){
                window.cancelAnimationFrame(o_self.n_id_raf)
                o_self.n_id_raf = 0
                await o_self.o_js?._f_render();
            }else{
                o_self.n_id_raf = window.requestAnimationFrame(o_self.f_raf);
                o_self.n_wpf = window.performance.now()
                o_self.n_ms_left -= Math.abs(o_self.n_wpf_last-o_self.n_wpf);
                o_self.n_wpf_last = o_self.n_wpf
    
                await o_self.o_js__bar?._f_update();
            }
        }
        
    }
}
let f_o_js = function(
    o_state = {}
){
    let s_css_class_uuid_function_scope = f_s_css_class_from_s_uuid(crypto.randomUUID());

    Object.assign(
        o_state, 
        {
            //
            [s_prop_o_js]:  {
                f_o_jsh: ()=>{
                    return {
                        class: [s_class,s_css_class_uuid_module_scope,s_css_class_uuid_function_scope].join(' '),
                        a_o: [
                            ...a_s_position_y.map(
                                s_position_y=>{
                                    return a_s_position_x.map(
                                        s_position_x=>{
                                            return {
                                                class: `a_o_notification ${s_position_y} ${s_position_x}`, 
                                                a_o: [
                                                    ...o_state.a_o_notification.filter(
                                                        o=>{
                                                            return o.s_position_x == s_position_x
                                                            && o.s_position_y == s_position_y
                                                        }
                                                    ).map(
                                                        o_notification=>{
                                                            return {
                                                                a_o: [
                                                                    Object.assign(
                                                                        o_notification, 
                                                                        {
                                                                            o_js: {
                                                                                f_o_jsh: function(){
                                                                                    console.log(o_notification)
                                                                                    console.log(o_notification.n_ms_left > 0)
                                                                                    if(
                                                                                        o_notification.n_id_raf == 0
                                                                                        && o_notification.n_ms_left > 0
                                                                                        && o_notification.b_timeout
                                                                                    ){
                                                                                        o_notification.n_id_raf = window.requestAnimationFrame(o_notification.f_raf);
                                                                                    }
                                                                                    return {
                                                                                        class: [
                                                                                            'o_notification',
                                                                                            'clickable', 
                                                                                            ...o_notification.s_type.split(' ')
                                                                                        ].join(' '),
                                                                                        // b_render: false,
                                                                                        b_render: o_notification.n_ms_left > 0,
                                                                                        // style: `display: ${(o_notification.n_ms_left > 0) ? 'block': 'none'}`,
                                                                                        a_o:[
                                                                                            {
                                                                                                class: "icon",
                                                                                                s_tag: "span",
                                                                                                innerText: `${o_s_type_s_ascii_icon[o_notification.s_type]}`
                                                                                            },
                                                                                            {
                                                                                                innerText: `${o_notification.s_text}`,
                                                                                            }, 
                                                                                            Object.assign(
                                                                                                    o_notification, 
                                                                                                    {
                                                                                                        o_js__bar: {
                                                                                                            f_o_jsh: function(){
                                                                                                                // console.log('render bar')

                                                                                                                return {
                                                                                                                            class: "bar",
                                                                                                                            style: `width: ${(o_notification.n_ms_left / o_notification.n_ms_initial)*100}%`, 
                                                                                                                }
                                                                                            
                                                                                                            }
                                                                                                        }
                                                                                                    }
                                                                                            ).o_js__bar
                                                                                        ]
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                ).o_js,
                                                                
                                                                    
                                                                ]
                                                            } 
                                                        }
                                                    )
                                                ]
                                            }

                                        }
                                    )
                                }
                            ).flat(2)
                        ]
                    }
                }
            },
            //
            a_o_notification: [],
            // 
            s_css_class_uuid_module_scope,
            s_css_class_uuid_function_scope
        }
    )

    


    return o_state[s_prop_o_js]
}
// css for only this module
let s_selector_classscope = `.${[s_class].join('.')}`
let s_selector_modscope = `.${[s_class, s_css_class_uuid_module_scope].join('.')}`
// let s_selector_functionscope = `.${[s_class, s_css_class_uuid_module_scope, s_css_class_uuid_function_scope].join('.')}`
let s_css = 
    `
    @keyframes notifire_spin {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
    }
    ${
        f_s_css_prefixed(
            `
            .o_gamepad{
                font-family: helvetica;
                position: fixed;
            }
            `,
            s_selector_modscope
        )

    }`
f_add_css(s_css)
export {
    f_o_js,
    f_o_throw_notification,  
    f_clear_all_notifications,
    f_clear_o_notification,
    s_css, 
    O_notification
}