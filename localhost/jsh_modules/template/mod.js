import {
    f_add_css,
    f_s_css_prefixed,
} from "https://deno.land/x/f_add_css@1.1/mod.js"

import { 
    f_s_css_class_from_s_uuid
} from "./../functions.module.js"
let s_class = 'template';
let s_css_class_uuid_module_scope = f_s_css_class_from_s_uuid(crypto.randomUUID());

let f_o_js = function(
    o_state = {}
){
    let s_css_class_uuid_function_scope = f_s_css_class_from_s_uuid(crypto.randomUUID());

    Object.assign(
        o_state, 
        {
            //
            o_js: {
                f_o_jsh: function(){
                    return {
                        class: [
                            s_class,
                            s_css_class_uuid_module_scope,
                            s_css_class_uuid_function_scope
                        ].join(' '),
                        a_o: [
                            ...Object.keys(o_state).map(
                                s=>{
                                    return {
                                        innerText: `o_state.${s}: ${o_state[s].toString()}`
                                    }
                                }
                            ), 
                            {
                                innerText: "this module can be rendered and updated with o_state.o_js__template._f_render() and ..._f_update()"
                            }
                        ]
                    }
                }
            },
            //
            n_num:
                (o_state.n_num) 
                    ? o_state.n_num
                    : 1,
            s_string:
                (o_state.s_string) 
                    ? o_state.s_string
                    : 'asdf',
            b_bool:
                (o_state.b_bool) 
                    ? o_state.b_bool
                    : false,
            o_obj:
                (o_state.o_obj) 
                    ? o_state.o_obj
                    : {n:1,s:'ad',b:true,a:[1,2],o:{n:1}},
            a_n:
                (o_state.a_n) 
                    ? o_state.a_n
                    : [1,2],
            v_n:
                (o_state.v_n) 
                    ? o_state.v_n
                    : null,
            f_test:
                (o_state.f_test) 
                    ? o_state.f_test
                    : ()=>{console.log('f_test was called')},
            //
            s_css_class_uuid_module_scope:
                (o_state.s_css_class_uuid_module_scope) 
                    ? o_state.s_css_class_uuid_module_scope
                    : s_css_class_uuid_module_scope,
            s_css_class_uuid_function_scope:
                (o_state.s_css_class_uuid_function_scope) 
                    ? o_state.s_css_class_uuid_function_scope
                    : s_css_class_uuid_function_scope,
        }
    )
    return o_state.o_js
}
// css for only this module
let s_css = f_s_css_prefixed(
    `
        .clickable:hover{
            background: blue;
        }
    `,
    `.${s_css_class_uuid_module_scope}`
)

export {
    f_o_js,
    s_css
}