import {
    f_add_css,
    f_s_css_prefixed,
} from "https://deno.land/x/f_add_css@1.1/mod.js"

import { 
    f_s_selector_css_from_s_uuid
} from "./../functions.module.js"
let s_class = 'notifire';
let s_prop_o_js = 'o_js'//`o_js__${s_class}`;
let s_uuid_module_scope = f_s_selector_css_from_s_uuid(crypto.randomUUID());

let f_throw_notification = null;  

let o_s_type_s_ascii_icon = {
    'success': '✓',
    'warning': '⚠',
    'info': "ℹ", 
    'error': '✖'
}
let a_s_position_x = ['left', 'center', 'right']
let a_s_position_y = ['top', 'bottom']

class O_notification{
    constructor(
        s_text, 
        s_type, 
        s_position_x, 
        s_position_y, 
        n_ms_initial,
        n_ms_left, 
        o_js
    ){
        this.s_type = s_type
        this.s_text = s_text
        this.s_position_x = s_position_x
        this.s_position_y = s_position_y
        this.n_ms_initial = n_ms_initial
        this.n_ms_left = n_ms_left 
        this.o_js = null
        this.o_js__bar = null
        this.n_id_raf = 0
        let o_self = this
        this.n_wpf = window.performance.now();
        this.n_wpf_last = window.performance.now();
        this.f_raf = async ()=>{ 
            console.log(`${o_self.n_wpf} raf ${o_self.n_ms_left}`)
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
    a_o_js = [], 
    o_state = {}
){
    let s_uuid_function_scope = f_s_selector_css_from_s_uuid(crypto.randomUUID());

    Object.assign(
        o_state, 
        {
            //
            [s_prop_o_js]:  {
                f_o_jsh: ()=>{
                    return {
                        class: [s_class,s_uuid_module_scope,s_uuid_function_scope].join(' '),
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
                                                                                    if(o_notification.n_id_raf == 0 && o_notification.n_ms_left > 0){
                                                                                        o_notification.n_id_raf = window.requestAnimationFrame(o_notification.f_raf);
                                                                                    }
                                                                                    return {
                                                                                        class: [
                                                                                            'o_notification',
                                                                                            'clickable', 
                                                                                            ...o_notification.s_type.split(' ')
                                                                                        ].join(' '),
                                                                                        style: `display: ${(o_notification.n_ms_left > 0) ? 'block': 'none'}`,
                                                                                        a_o:[
                                                                                            {
                                                                                                innerText: `${o_s_type_s_ascii_icon[o_notification.s_type]} ${o_notification.s_text}`,
                                                                                            }, 
                                                                                            Object.assign(
                                                                                                    o_notification, 
                                                                                                    {
                                                                                                        o_js__bar: {
                                                                                                            f_o_jsh: function(){
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
            s_uuid_module_scope,
            s_uuid_function_scope
        }
    )

    f_throw_notification = async function(
        s,
        s_type = 'info',
        s_position_x = 'left', 
        s_position_y = 'top', 
        ){
        let n_ms_min = 5000;
        let n_words_per_minute_slow_reader = 50;
        let n_chars_per_word_avg = 5;
        let n_chars_per_minute = n_words_per_minute_slow_reader * n_chars_per_word_avg;
        let n_chars_per_second = n_chars_per_minute / 60;
        let n_ms_per_char = 1000 / n_chars_per_second;
        let n_ms_per_text = Array.from(s).filter(s=>s.trim()!='').length * n_ms_per_char;
        let n_ms = Math.max(n_ms_per_text, n_ms_min);
        let o = new O_notification(
            s, 
            s_type,
            s_position_x,
            s_position_y,
            n_ms,
            n_ms
        )
        o_state?.a_o_notification.push(o)
        await o_state?.[s_prop_o_js]?._f_render()
    }

    return o_state[s_prop_o_js]
}
// css for only this module
let s_selector_classscope = `.${[s_class].join('.')}`
let s_selector_modscope = `.${[s_class, s_uuid_module_scope].join('.')}`
// let s_selector_functionscope = `.${[s_class, s_uuid_module_scope, s_uuid_function_scope].join('.')}`
let s_css = `

.a_o_notification{
    font-family: helvetica;
    position: absolute;
}
.o_notification{
    position:relative;
    max-width: 500px;
    padding: 0.5rem;
    margin: 0.5rem;
}
.bar{
    position: absolute;
    bottom: 0;
    left: 0;
    height:  5px;
}
.top {
    top:0;
}
.bottom{
    bottom:0;
}
.left{
    left: 0;
}
.right{
    right:0;
}
.center{
    left: 50%;
    transform: translate(-50%)
}

.success {
    color: #155724;
    background-color: #d4edda;
    border-color: #c3e6cb;
}
.success .bar{
    background: #1557243f;
}
.warning {
    color: #856404;
    background-color: #fff3cd;
    border-color: #ffeeba;
}
.warning .bar{
    background: #8564043f;
}
.info {
    color: #004085;
    background-color: #cce5ff;
    border-color: #b8daff;
}
.info .bar{
    background: #0040853f;
}
.error {
    color: #721c24;
    background-color: #f8d7da;
    border-color: #f5c6cb;
}
.error .bar{
    background: #721c243f;
}
`;
f_add_css(
    f_s_css_prefixed(
        s_css,
        s_selector_modscope
    )
)
export {
    f_o_js,
    f_throw_notification, 
    s_css, 
    O_notification
}