let s_class = 'template';
let s_prop_o_js = `o_js__${s_class}`;
let s_uuid_module_scope = crypto.randomUUID();

let f_o_js__overlay_window = function(
    a_o_js = [], 
    o_state = {}
){
    let s_uuid_function_scope = crypto.randomUUID();

    let o = Object.assign(
        o_state, 
        {
            //
            [s_prop_o_js]: null,
            //
            n_num: 1, 
            s_string: 'asdf',
            b_bool: true, 
            o_obj: {n:1}, 
            a_n: [1,2,3], 
            // 
            s_uuid_module_scope,
            s_uuid_function_scope
        }
    )
    return Object.assign(
        o, 
        {
            [s_prop_o_js]: {
                f_o_jsh: function(){
                    return {
                        class: [s_class,s_uuid_module_scope,s_uuid_function_scope].join(' '),
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
            }
        }
    )[s_prop_o_js]
}
// css for only this module
let s_selector_classscope = `.${[s_class].join('.')}`
let s_selector_modscope = `.${[s_class, s_uuid_module_scope].join('.')}`
let s_selector_functionscope = `.${[s_class, s_uuid_module_scope, s_uuid_function_scope].join('.')}`
let s_css = `
${s_selector_modscope} .clickable:hover{
    background:red;
}
`

export {
    f_o_js__overlay_window,
    s_css
}