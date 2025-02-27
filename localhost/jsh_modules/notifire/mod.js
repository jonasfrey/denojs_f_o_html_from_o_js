import {
    f_add_css,
    f_s_css_prefixed,
} from "https://deno.land/x/f_add_css@1.1/mod.js"

import { 
    f_s_css_class_from_s_uuid
} from "./../functions.module.js"
let s_class = 'notifire';
let s_prop_o_js = 'o_js'//`o_js__${s_class}`;
let s_css_class_uuid_module_scope = f_s_css_class_from_s_uuid(crypto.randomUUID());
// Rendering Updates: The browser's UI rendering process runs separately from the JavaScript execution thread but is coordinated with the event loop. Even if a script is deferred using setTimeout(fn, 0), rendering updates (like layout recalculations and repaints) may not occur immediately if the event loop is busy with other tasks.
let n_ms_delay_minimum = Math.ceil(1000/300);//1000/n_fps
let f_o_throw_notification = async function(
    o_state,
    s,
    s_type = 'info',
    s_position_x = 'left', 
    s_position_y = 'top', 
    ){
        return new Promise( async (f_res)=>{

            let n_ms_minimum = 5000;
            let n_words_per_minute_slow_reader = 50;
            let n_chars_per_word_avg = 5;
            let n_chars_per_minute = n_words_per_minute_slow_reader * n_chars_per_word_avg;
            let n_chars_per_second = n_chars_per_minute / 60;
            let n_ms_per_char = 1000 / n_chars_per_second;
            let n_ms_per_text = Array.from(s).filter(s=>s.trim()!='').length * n_ms_per_char;
            let n_ms = Math.max(n_ms_per_text, n_ms_minimum);
            let o = new O_notification(
                s, 
                s_type,
                s_position_x,
                s_position_y, 
                s_type != 'loading',
                n_ms,
                n_ms
            )
            o_state?.a_o_notification.push(o)
            await o_state?.[s_prop_o_js]?._f_render()
            // return f_res(true)
            // timeout is needed to give time to the thread
            // to render the page
            // see 'wtfisgoingon.html'
            setTimeout(() => {
                return f_res(o);
            }, n_ms_delay_minimum);

        })
};
let f_clear_all_notifications = async function(
    o_state
){  
    return new Promise(async (f_res)=>{

        for(let o of o_state.a_o_notification){
            await f_clear_o_notification(o);
        }
        o_state.a_o_notification = []
        // await o_state?.[s_prop_o_js]?._f_render()

        return setTimeout(() => {
            return f_res(true);
        }, n_ms_delay_minimum);
    })
}; 
let f_clear_o_notification = async function(o_notification){

    return new Promise(async (f_res)=>{

        globalThis.cancelAnimationFrame(o_notification.n_id_raf)
        o_notification.n_ms_left = -1;
        await o_notification?.o_js?._f_render?.();

        return setTimeout(() => {
            return f_res(true);
        }, n_ms_delay_minimum);
    })


}
let o_s_type_s_ascii_icon = {
    'success': '✓',
    'warning': '⚠',
    'info': "ℹ", 
    'error': '✖', 
    'loading': '↻'//'|'
}
let a_s_position_x = ['left', 'center', 'right']
let a_s_position_y = ['top', 'bottom']

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
        this.n_wpf = globalThis.performance.now();
        this.n_wpf_last = globalThis.performance.now();
        this.f_raf = async ()=>{
            // console.log(`${o_self.n_wpf} raf ${o_self.n_ms_left}`)
            if(o_self.n_ms_left < 0){
                globalThis.cancelAnimationFrame(o_self.n_id_raf)
                o_self.n_id_raf = 0
                await o_self.o_js?._f_render();
            }else{
                o_self.n_id_raf = globalThis.requestAnimationFrame(o_self.f_raf);
                o_self.n_wpf = globalThis.performance.now()
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
                                                                                    // console.log(o_notification)
                                                                                    // console.log(o_notification.n_ms_left > 0)
                                                                                    if(
                                                                                        o_notification.n_id_raf == 0
                                                                                        && o_notification.n_ms_left > 0
                                                                                        && o_notification.b_timeout
                                                                                    ){
                                                                                        o_notification.n_id_raf = globalThis.requestAnimationFrame(o_notification.f_raf);
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
            .a_o_notification{
                font-family: helvetica;
                position: fixed;
            }
            .o_notification{
                position:relative;
                max-width: 500px;
                padding: 0.5rem;
                margin: 0.5rem;
            }
            .o_notification .icon{
                float:left;
                display:inline;
                padding: 0 0.2rem;
            }
            .o_notification.loading .icon{
                animation: notifire_spin 1s linear infinite;
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
            .info, .loading {
                color: #004085;
                background-color: #cce5ff;
                border-color: #b8daff;
            }
            .info .bar, .loading .bar{
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